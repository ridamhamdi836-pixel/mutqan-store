-- One-time: remove all test orders and analytics before real launch.
-- Easypanel → PostgreSQL → run this file, or: node frontend/scripts/reset-test-store-data.mjs

BEGIN;

DELETE FROM order_items;
DELETE FROM orders;
ALTER SEQUENCE order_number_seq RESTART WITH 1;

DELETE FROM store_analytics_events;
DELETE FROM tracking_events;

COMMIT;
