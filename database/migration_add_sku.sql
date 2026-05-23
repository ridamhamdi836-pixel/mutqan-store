-- Migration: Add SKU column to products table
-- Run this to add the sku field to existing products

ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(255);

-- Update existing products with SKUs (if needed)
UPDATE products SET sku = 'MTQ-VAC-001' WHERE slug = 'powerful-cordless-vacuum';
UPDATE products SET sku = 'MTQ-CAB-002' WHERE slug = 'smart-stackable-cabinet';
UPDATE products SET sku = 'MTQ-DRW-003' WHERE slug = 'pull-out-cabinet-drawer';
UPDATE products SET sku = 'MTQ-ORG-004' WHERE slug = 'magic-under-sink-organizer';
UPDATE products SET sku = 'MTQ-FLT-005' WHERE slug = 'pure-faucet-filter';
UPDATE products SET sku = 'MTQ-WRM-006' WHERE slug = 'smart-table-warmer';
UPDATE products SET sku = 'MTQ-LNH-007' WHERE slug = 'thermal-lunch-box';

-- Update the updated_at timestamp for products that were updated
UPDATE products SET updated_at = NOW() WHERE sku IS NOT NULL;
