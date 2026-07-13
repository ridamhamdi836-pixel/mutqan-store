import { getPool } from "@/lib/db";

export type DateRange = { from: string; to: string };

function parseRange(from?: string | null, to?: string | null): DateRange {
  const now = new Date();
  const toDate = to ? new Date(to) : now;
  const fromDate = from
    ? new Date(from)
    : new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
}

export async function getAdminMetrics(from?: string | null, to?: string | null) {
  const pool = getPool();
  const range = parseRange(from, to);
  if (!pool) {
    return emptyMetrics(range);
  }

  const [analytics, orders, byProduct, byUtm, dailyViews, dailyOrders] = await Promise.all([
    pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE is_valid_ksa AND event_type = 'page_view')::int AS page_views,
        COUNT(*) FILTER (WHERE is_valid_ksa AND event_type = 'product_view')::int AS product_views,
        COUNT(*) FILTER (WHERE is_valid_ksa AND event_type = 'add_to_cart')::int AS add_to_carts,
        COUNT(*) FILTER (WHERE is_valid_ksa AND event_type = 'initiate_checkout')::int AS checkouts_started,
        COUNT(DISTINCT session_id) FILTER (WHERE is_valid_ksa)::int AS valid_sessions,
        COUNT(*) FILTER (WHERE NOT is_valid_ksa)::int AS blocked_events
      FROM store_analytics_events
      WHERE created_at >= $1 AND created_at <= $2`,
      [range.from, range.to],
    ),
    pool.query(
      `SELECT
        COUNT(*)::int AS orders_count,
        COALESCE(SUM(total_sar), 0)::int AS revenue_sar,
        COALESCE(AVG(total_sar), 0)::float AS avg_order_sar
      FROM orders
      WHERE created_at >= $1 AND created_at <= $2`,
      [range.from, range.to],
    ),
    pool.query(
      `SELECT oi.product_slug,
        COUNT(DISTINCT o.id)::int AS orders,
        COALESCE(SUM(oi.total_price_sar), 0)::int AS revenue_sar
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id AND oi.item_type = 'main'
      WHERE o.created_at >= $1 AND o.created_at <= $2
      GROUP BY oi.product_slug
      ORDER BY orders DESC`,
      [range.from, range.to],
    ),
    pool.query(
      `SELECT COALESCE(utm_source, '(direct)') AS source,
        COUNT(*)::int AS orders,
        COALESCE(SUM(total_sar), 0)::int AS revenue_sar
      FROM orders
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY utm_source
      ORDER BY orders DESC
      LIMIT 15`,
      [range.from, range.to],
    ),
    pool.query(
      `SELECT DATE(created_at AT TIME ZONE 'Asia/Riyadh')::text AS day,
        COUNT(*) FILTER (WHERE is_valid_ksa AND event_type = 'product_view')::int AS product_views
      FROM store_analytics_events
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY 1 ORDER BY 1`,
      [range.from, range.to],
    ),
    pool.query(
      `SELECT DATE(created_at AT TIME ZONE 'Asia/Riyadh')::text AS day,
        COUNT(*)::int AS orders
      FROM orders
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY 1 ORDER BY 1`,
      [range.from, range.to],
    ),
  ]);

  const a = analytics.rows[0] || {};
  const o = orders.rows[0] || {};
  const validSessions = Number(a.valid_sessions) || 0;
  const ordersCount = Number(o.orders_count) || 0;
  const productViews = Number(a.product_views) || 0;

  const conversionFromSessions =
    validSessions > 0 ? Math.round((ordersCount / validSessions) * 10000) / 100 : 0;
  const conversionFromProductViews =
    productViews > 0 ? Math.round((ordersCount / productViews) * 10000) / 100 : 0;

  const dayMap = new Map<string, { day: string; product_views: number; orders: number }>();
  for (const row of dailyViews.rows) {
    dayMap.set(row.day, {
      day: row.day,
      product_views: Number(row.product_views) || 0,
      orders: 0,
    });
  }
  for (const row of dailyOrders.rows) {
    const existing = dayMap.get(row.day) || {
      day: row.day,
      product_views: 0,
      orders: 0,
    };
    existing.orders = Number(row.orders) || 0;
    dayMap.set(row.day, existing);
  }
  const daily = [...dayMap.values()].sort((a, b) => a.day.localeCompare(b.day));

  return {
    range,
    page_views: Number(a.page_views) || 0,
    product_views: productViews,
    add_to_carts: Number(a.add_to_carts) || 0,
    checkouts_started: Number(a.checkouts_started) || 0,
    valid_sessions: validSessions,
    blocked_events: Number(a.blocked_events) || 0,
    orders_count: ordersCount,
    revenue_sar: Number(o.revenue_sar) || 0,
    avg_order_sar: Math.round(Number(o.avg_order_sar) || 0),
    conversion_rate_session: conversionFromSessions,
    conversion_rate_product_view: conversionFromProductViews,
    by_product: byProduct.rows,
    by_utm: byUtm.rows,
    daily,
  };
}

function emptyMetrics(range: DateRange) {
  return {
    range,
    page_views: 0,
    product_views: 0,
    add_to_carts: 0,
    checkouts_started: 0,
    valid_sessions: 0,
    blocked_events: 0,
    orders_count: 0,
    revenue_sar: 0,
    avg_order_sar: 0,
    conversion_rate_session: 0,
    conversion_rate_product_view: 0,
    by_product: [],
    by_utm: [],
    daily: [],
  };
}

export async function listAdminOrders(params: {
  from?: string | null;
  to?: string | null;
  status?: string | null;
  q?: string | null;
  /** Filter by order market currency: SAR (Saudi) or AED (UAE) */
  currency?: string | null;
  limit?: number;
  offset?: number;
}) {
  const pool = getPool();
  if (!pool) return { orders: [], total: 0 };

  const range = parseRange(params.from, params.to);
  const limit = Math.min(params.limit ?? 50, 100);
  const offset = params.offset ?? 0;
  const conditions = ["o.created_at >= $1", "o.created_at <= $2"];
  const values: unknown[] = [range.from, range.to];
  let idx = 3;

  if (params.status) {
    conditions.push(`(o.confirmation_status = $${idx} OR o.delivery_status = $${idx})`);
    values.push(params.status);
    idx++;
  }

  if (params.currency === "SAR" || params.currency === "AED") {
    conditions.push(`COALESCE(o.currency, 'SAR') = $${idx}`);
    values.push(params.currency);
    idx++;
  }

  if (params.q?.trim()) {
    conditions.push(
      `(o.order_number ILIKE $${idx} OR o.customer_name ILIKE $${idx} OR o.customer_phone_e164 ILIKE $${idx})`,
    );
    values.push(`%${params.q.trim()}%`);
    idx++;
  }

  const where = conditions.join(" AND ");

  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS total FROM orders o WHERE ${where}`,
    values,
  );

  values.push(limit, offset);
  const rows = await pool.query(
    `SELECT o.id, o.order_number, o.customer_name, o.customer_phone_e164,
      o.confirmation_status, o.delivery_status, o.total_sar, o.currency,
      o.utm_source, o.utm_medium, o.utm_campaign, o.created_at,
      (SELECT COUNT(*)::int FROM order_items oi WHERE oi.order_id = o.id) AS items_count
    FROM orders o
    WHERE ${where}
    ORDER BY o.created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}`,
    values,
  );

  return { orders: rows.rows, total: countRes.rows[0]?.total ?? 0, range };
}

export async function getAdminOrderById(id: string) {
  const pool = getPool();
  if (!pool) return null;

  const orderRes = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [id],
  );
  if (!orderRes.rows[0]) return null;

  const itemsRes = await pool.query(
    `SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at`,
    [id],
  );

  return { order: orderRes.rows[0], items: itemsRes.rows };
}

export async function updateAdminOrder(
  id: string,
  patch: {
    confirmation_status?: string;
    delivery_status?: string;
    internal_notes?: string;
  },
) {
  const pool = getPool();
  if (!pool) return null;

  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (patch.confirmation_status) {
    sets.push(`confirmation_status = $${i++}`);
    values.push(patch.confirmation_status);
  }
  if (patch.delivery_status) {
    sets.push(`delivery_status = $${i++}`);
    values.push(patch.delivery_status);
  }
  if (patch.internal_notes !== undefined) {
    sets.push(`internal_notes = $${i++}`);
    values.push(patch.internal_notes);
  }

  if (!sets.length) return getAdminOrderById(id);

  sets.push(`updated_at = NOW()`);
  values.push(id);

  await pool.query(
    `UPDATE orders SET ${sets.join(", ")} WHERE id = $${i}`,
    values,
  );

  return getAdminOrderById(id);
}
