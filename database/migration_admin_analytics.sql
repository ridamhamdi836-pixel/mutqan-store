-- Admin dashboard: KSA-valid analytics + order notes
-- Run once on PostgreSQL (same DB as init.sql)

CREATE TABLE IF NOT EXISTS store_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    page_path TEXT,
    product_slug VARCHAR(100),
    session_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    country_code VARCHAR(2),
    is_valid_ksa BOOLEAN NOT NULL DEFAULT false,
    is_vpn_or_proxy BOOLEAN NOT NULL DEFAULT false,
    block_reason VARCHAR(50),
    geo_provider VARCHAR(50),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_content VARCHAR(255),
    utm_term VARCHAR(255),
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sae_created_at ON store_analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sae_valid_ksa_created ON store_analytics_events (is_valid_ksa, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sae_event_valid ON store_analytics_events (event_type, is_valid_ksa, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sae_session ON store_analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_sae_product ON store_analytics_events (product_slug) WHERE product_slug IS NOT NULL;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city VARCHAR(120);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
