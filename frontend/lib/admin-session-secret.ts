import { createHmac } from "crypto";

const SESSION_SALT = "mutqan-admin-session-v1";

/** Normalize so frontend (pg) and backend (psycopg) URLs produce the same secret */
export function normalizeDatabaseUrl(url: string): string {
  return url.trim().replace(/^postgresql\+psycopg:\/\//i, "postgresql://");
}

/**
 * Session signing key: explicit env first, else derived from DATABASE_URL
 * (same DB URL on frontend + backend => matching tokens without extra env).
 */
export function resolveAdminSessionSecret(): string {
  const explicit =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.SECRET_KEY?.trim();
  if (explicit) return explicit;

  const db = process.env.DATABASE_URL?.trim();
  if (!db) return "";

  return createHmac("sha256", SESSION_SALT)
    .update(normalizeDatabaseUrl(db))
    .digest("hex");
}

export function sessionSecretSource(): "explicit" | "database_url" | "none" {
  if (process.env.ADMIN_SESSION_SECRET?.trim() || process.env.SECRET_KEY?.trim()) {
    return "explicit";
  }
  if (process.env.DATABASE_URL?.trim()) return "database_url";
  return "none";
}
