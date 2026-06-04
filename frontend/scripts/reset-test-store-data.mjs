/**
 * One-time cleanup: deletes all orders + store analytics (test data only).
 * Usage: node scripts/reset-test-store-data.mjs
 * Requires DATABASE_URL in frontend/.env.local
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("Missing frontend/.env.local with DATABASE_URL");
    process.exit(1);
  }
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.DATABASE_URL?.replace(
  "postgresql+psycopg://",
  "postgresql://",
);
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: false });

await client.connect();

const before = await client.query(`SELECT COUNT(*)::int AS n FROM orders`);
const ordersBefore = before.rows[0]?.n ?? 0;

await client.query("BEGIN");
await client.query("DELETE FROM order_items");
await client.query("DELETE FROM orders");
await client.query("ALTER SEQUENCE order_number_seq RESTART WITH 1");
await client.query("DELETE FROM store_analytics_events");
await client.query("DELETE FROM tracking_events");
await client.query("COMMIT");

const after = await client.query(`SELECT COUNT(*)::int AS n FROM orders`);
await client.end();

console.log(`Removed ${ordersBefore} test order(s). Orders now: ${after.rows[0]?.n ?? 0}`);
console.log("Analytics cleared. Next order will be mutqan-0001.");
