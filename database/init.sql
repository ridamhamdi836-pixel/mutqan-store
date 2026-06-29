-- Mutqan Store Database Schema
-- Run this once on your PostgreSQL database to create all required tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequential public order numbers: mutqan-0001, mutqan-0002, …
CREATE SEQUENCE IF NOT EXISTS order_number_seq AS BIGINT START WITH 1;

-- Orders table (matches frontend Next.js API)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone_e164 VARCHAR(20) NOT NULL,
    customer_phone_national VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    confirmation_status VARCHAR(30) DEFAULT 'pending',
    delivery_status VARCHAR(30) DEFAULT 'pending',
    subtotal_sar INTEGER NOT NULL DEFAULT 0,
    upsell_total_sar INTEGER NOT NULL DEFAULT 0,
    total_sar INTEGER NOT NULL DEFAULT 0,
    currency VARCHAR(5) NOT NULL DEFAULT 'SAR',
    landing_page TEXT,
    referrer TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone_e164);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Order items table (main products + upsell items)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_slug VARCHAR(100) NOT NULL,
    bundle_id VARCHAR(100),
    name_ar VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price_sar INTEGER NOT NULL DEFAULT 0,
    total_price_sar INTEGER NOT NULL DEFAULT 0,
    item_type VARCHAR(20) NOT NULL DEFAULT 'main',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_type ON order_items(item_type);

-- Tracking events (page views, conversions, etc.)
CREATE TABLE IF NOT EXISTS tracking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_order ON tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_name ON tracking_events(event_name);

-- Alembic version tracking (for backend compatibility)
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL PRIMARY KEY
);

-- Store dashboard override tables.
-- These tables are additive and keep the current TypeScript config as fallback.
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
