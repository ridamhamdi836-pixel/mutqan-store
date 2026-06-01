-- Sequential order numbers: mutqan-0001, mutqan-0002, …
-- Run once on existing PostgreSQL (after deploy).

CREATE SEQUENCE IF NOT EXISTS order_number_seq AS BIGINT START WITH 1;

SELECT setval(
  'order_number_seq',
  GREATEST(
    COALESCE(
      (
        SELECT MAX(CAST(SUBSTRING(order_number FROM '^mutqan-([0-9]+)$') AS BIGINT))
        FROM orders
        WHERE order_number ~ '^mutqan-[0-9]+$'
      ),
      0
    ),
    (SELECT COUNT(*) FROM orders)
  ),
  true
);
