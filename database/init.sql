-- Mutqan Store Database Schema
-- Run this once on your PostgreSQL database to create all required tables

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
