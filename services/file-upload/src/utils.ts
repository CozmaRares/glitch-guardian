import { join } from "path"

[
  "PORT",
  "KEYS_RELATIVE_PATH",
  "KEY_HEADER",
].forEach(
  (envKey) => {
    if (process.env[envKey] === undefined)
      console.error("Uninitialized env variable:", envKey);
  }
)

export type APIKey = {
  key: string;
  permissions: Array<"upload" | "delete">
}

if (process.env.KEYS_RELATIVE_PATH === undefined)
  throw new Error("Incorrect env file. Missing 'KEYS_PATH' variable.");

export const KEYS_PATH = Object.freeze(join(__dirname, "..", process.env.KEYS_RELATIVE_PATH));
