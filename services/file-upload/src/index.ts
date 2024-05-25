import * as fs from "fs";
import * as path from "path";

import { Hono, type Next, type Context } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";

import { type APIKey, KEYS_PATH } from "./utils";

let apiKeys: Map<string, APIKey> = new Map();

const KEY_HEADER = process.env.KEY_HEADER!;
const STATIC_PATH = path.join(__dirname, "..", "static");

if (fs.existsSync(KEYS_PATH)) {
  const keys = JSON.parse(fs.readFileSync(KEYS_PATH, "utf8")) as APIKey[];
  keys.forEach(key => apiKeys.set(key.key, key));
} else {
  console.error("API keys file does not exist. Please initialize it first.");
  process.exit(1);
}

async function checkApiKey(ctx: Context, next: Next) {
  const apiKey = ctx.req.header(KEY_HEADER);
  if (!apiKey) return ctx.json({ error: "Unauthorized" }, 401);
  const keyData = apiKeys.get(apiKey);
  if (!keyData) return ctx.json({ error: "Invalid API key" }, 401);
  ctx.set(KEY_HEADER, keyData);
  await next();
}

function checkPermission(permission: string) {
  return async (ctx: Context, next: Next) => {
    const key = ctx.get(KEY_HEADER) as APIKey;
    if (!(key.permissions as string[]).includes(permission))
      return ctx.json({ error: "Insufficient permissions" }, 403);
    await next();
  };
}

const app = new Hono();

app.use(logger());
app.use("/static/*", serveStatic({ root: "./" }));
app.use(checkApiKey);

app.post("/upload", checkPermission("upload"), async c => {
  const data = await c.req.formData();
  const blob = data.get("file") as Blob;
  const buffer = Buffer.from(await blob.arrayBuffer());
  const id = crypto.randomUUID();

  fs.writeFileSync(path.join(STATIC_PATH, id), buffer);

  return c.json({ id });
});

app.delete("/delete/:id", checkPermission("delete"), c => {
  const fileID = c.req.param("id");
  const filePath = path.join(STATIC_PATH, fileID);

  if (!fs.existsSync(filePath)) return c.json({ error: "Not found" }, 404);

  fs.unlinkSync(filePath);

  return c.body("", 204);
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};
