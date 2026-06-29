import { getPool } from "@/lib/db";
import type {
  ProductOverride,
  StoreSettingsOverride,
} from "@/types/store-dashboard";

let ensured = false;

export async function ensureStoreDashboardTables() {
  const pool = getPool();
  if (!pool || ensured) return;

  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      is_public BOOLEAN NOT NULL DEFAULT true,
      updated_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      storage_path TEXT NOT NULL UNIQUE,
      public_url TEXT NOT NULL,
      mime_type TEXT,
      width INTEGER,
      height INTEGER,
      alt_ar TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      version INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_overrides (
      product_slug TEXT PRIMARY KEY,
      override JSONB NOT NULL DEFAULT '{}'::jsonb,
      is_enabled BOOLEAN NOT NULL DEFAULT true,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS product_media_slots (
      product_slug TEXT NOT NULL,
      slot_key TEXT NOT NULL,
      asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
      alt_ar TEXT,
      aspect_ratio TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_enabled BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (product_slug, slot_key)
    );

    CREATE TABLE IF NOT EXISTS store_pages (
      page_key TEXT PRIMARY KEY,
      settings JSONB NOT NULL DEFAULT '{}'::jsonb,
      is_enabled BOOLEAN NOT NULL DEFAULT true,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS store_page_sections (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      page_key TEXT NOT NULL REFERENCES store_pages(page_key) ON DELETE CASCADE,
      section_key TEXT NOT NULL,
      section_type TEXT NOT NULL,
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_enabled BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (page_key, section_key)
    );

    CREATE INDEX IF NOT EXISTS idx_media_assets_status ON media_assets(status);
    CREATE INDEX IF NOT EXISTS idx_product_media_slots_slug ON product_media_slots(product_slug);
    CREATE INDEX IF NOT EXISTS idx_store_page_sections_page_sort ON store_page_sections(page_key, sort_order);
  `);

  ensured = true;
}

export async function readStoreSettings(): Promise<StoreSettingsOverride> {
  const pool = getPool();
  if (!pool) return {};
  await ensureStoreDashboardTables();
  const result = await pool.query<{ value: StoreSettingsOverride }>(
    "SELECT value FROM store_settings WHERE key = 'global' AND is_public = true LIMIT 1",
  );
  return result.rows[0]?.value ?? {};
}

export async function saveStoreSettings(
  value: StoreSettingsOverride,
  updatedBy?: string,
) {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured.");
  await ensureStoreDashboardTables();
  await pool.query(
    `INSERT INTO store_settings (key, value, updated_by, updated_at)
     VALUES ('global', $1::jsonb, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
    [JSON.stringify(value), updatedBy ?? null],
  );
}

export async function readProductOverrides(): Promise<Record<string, ProductOverride>> {
  const pool = getPool();
  if (!pool) return {};
  await ensureStoreDashboardTables();
  const result = await pool.query<{
    product_slug: string;
    override: ProductOverride;
  }>("SELECT product_slug, override FROM product_overrides WHERE is_enabled = true");

  return Object.fromEntries(
    result.rows.map((row) => [row.product_slug, row.override ?? {}]),
  );
}

export async function readProductOverride(
  slug: string,
): Promise<ProductOverride | null> {
  const pool = getPool();
  if (!pool) return null;
  await ensureStoreDashboardTables();
  const result = await pool.query<{ override: ProductOverride }>(
    "SELECT override FROM product_overrides WHERE product_slug = $1 AND is_enabled = true LIMIT 1",
    [slug],
  );
  return result.rows[0]?.override ?? null;
}

export async function saveProductOverride(
  slug: string,
  override: ProductOverride,
) {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured.");
  await ensureStoreDashboardTables();
  await pool.query(
    `INSERT INTO product_overrides (product_slug, override, is_enabled, published_at, updated_at)
     VALUES ($1, $2::jsonb, true, NOW(), NOW())
     ON CONFLICT (product_slug)
     DO UPDATE SET override = EXCLUDED.override, is_enabled = true, published_at = NOW(), updated_at = NOW()`,
    [slug, JSON.stringify(override)],
  );
}
