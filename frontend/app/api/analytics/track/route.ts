import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { getClientIpFromHeaders, isValidKsaTraffic, lookupIp } from "@/lib/geoip";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "product_view",
  "add_to_cart",
  "initiate_checkout",
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = String(body.event_type || "").trim();
    if (!ALLOWED_EVENTS.has(eventType)) {
      return NextResponse.json({ ok: false, error: "invalid_event" }, { status: 400 });
    }

    const sessionId = String(body.session_id || "").trim().slice(0, 100);
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "missing_session" }, { status: 400 });
    }

    const ip = getClientIpFromHeaders(request.headers);
    const geo = ip ? await lookupIp(ip) : null;
    const isValidKsa = geo ? isValidKsaTraffic(geo) : false;

    const pool = getPool();
    if (pool) {
      await pool.query(
        `INSERT INTO store_analytics_events (
          event_type, page_path, product_slug, session_id, ip_address,
          country_code, is_valid_ksa, is_vpn_or_proxy, block_reason, geo_provider,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          referrer, user_agent
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          eventType,
          body.page_path?.slice(0, 500) || null,
          body.product_slug?.slice(0, 100) || null,
          sessionId,
          ip || null,
          geo?.country || null,
          isValidKsa,
          geo?.isSuspicious ?? false,
          geo?.blockReason || null,
          geo?.provider || null,
          body.utm_source || null,
          body.utm_medium || null,
          body.utm_campaign || null,
          body.utm_content || null,
          body.utm_term || null,
          body.referrer || null,
          request.headers.get("user-agent")?.slice(0, 500) || null,
        ],
      );
    }

    return NextResponse.json({
      ok: true,
      counted: isValidKsa,
      country: geo?.country,
    });
  } catch (err) {
    console.error("[analytics/track]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
