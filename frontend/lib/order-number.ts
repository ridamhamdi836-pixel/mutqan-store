import type { PoolClient } from "pg";
import { getPool } from "@/lib/db";

const ORDER_PREFIX = "mutqan-";
const PAD_MIN = 4;
const ORDER_NUMBER_LOCK_KEY = 783451;

/** mutqan-0001, mutqan-0002, … (padding grows past 9999) */
export function formatOrderNumber(sequence: number): string {
  const digits = String(sequence);
  const width = Math.max(PAD_MIN, digits.length);
  return `${ORDER_PREFIX}${digits.padStart(width, "0")}`;
}

async function ensureOrderNumberSequence(client: PoolClient): Promise<void> {
  await client.query(
    `CREATE SEQUENCE IF NOT EXISTS order_number_seq AS BIGINT START WITH 1`,
  );

  const { rows } = await client.query<{ max_n: string | null }>(
    `SELECT MAX(
       CAST(SUBSTRING(order_number FROM '^mutqan-([0-9]+)$') AS BIGINT)
     )::text AS max_n
     FROM orders
     WHERE order_number ~ '^mutqan-[0-9]+$'`,
  );

  const maxExisting = Number(rows[0]?.max_n ?? 0);
  if (maxExisting > 0) {
    await client.query(
      `SELECT setval(
         'order_number_seq',
         GREATEST((SELECT last_value FROM order_number_seq), $1::bigint),
         true
       )`,
      [maxExisting],
    );
  }
}

/** Allocate next order number inside an open transaction (caller must BEGIN). */
export async function allocateOrderNumber(client: PoolClient): Promise<string> {
  await client.query(`SELECT pg_advisory_xact_lock($1)`, [ORDER_NUMBER_LOCK_KEY]);
  await ensureOrderNumberSequence(client);
  const { rows } = await client.query<{ n: string }>(
    `SELECT nextval('order_number_seq')::text AS n`,
  );
  return formatOrderNumber(Number(rows[0].n));
}

/** Standalone allocation when not already in a transaction */
export async function allocateOrderNumberStandalone(): Promise<string> {
  const pool = getPool();
  if (!pool) {
    console.warn("[OrderNumber] DATABASE_URL missing — cannot assign sequential id");
    throw new Error("order_number_db_required");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const orderNumber = await allocateOrderNumber(client);
    await client.query("COMMIT");
    return orderNumber;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
