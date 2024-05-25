import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

import { type APIKey, KEYS_PATH } from "./utils";

function initKeys() {
    const initialData: APIKey[] = [];

    if (!fs.existsSync(KEYS_PATH)) {
        const dir = path.dirname(KEYS_PATH);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(KEYS_PATH, JSON.stringify(initialData, null, 2), 'utf8');
        console.log(`File created at ${KEYS_PATH}`);
    } else {
        console.log(`File already exists at ${KEYS_PATH}`);
    }
}

function randomKey(length = 24) {
    return crypto.randomBytes(Math.floor(length / 2)).toString('hex');
}

function createKey(permissions: APIKey["permissions"]): void {
    if (!fs.existsSync(KEYS_PATH)) {
        console.error(`File does not exist at ${KEYS_PATH}. Please run init first.`);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8')) as APIKey[];
    const newKey = {
        key: randomKey(),
        permissions: permissions
    };

    data.push(newKey);
    fs.writeFileSync(KEYS_PATH, JSON.stringify(data, null, 2), 'utf8');
    console.log(`New API key created: ${newKey.key}`);
}

const args = process.argv.slice(2);

if (args.length == 0) {
    console.error('No command provided');
    process.exit(1);
}

const command = args[0];

if (command === 'init')
    initKeys();
else if (command === 'create') {
    const permissions: APIKey["permissions"] = [];
    args.forEach(arg => {
        if (arg === "upload" || arg === "delete")
            permissions.push(arg);
        else {
            console.error(`Invalid permission ${arg}`);
            process.exit(1);
        }
    });
    createKey(permissions);
} else {
    console.error(`Invalid command ${command}`);
    process.exit(1);
}
