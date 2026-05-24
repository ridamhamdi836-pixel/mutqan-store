import { NextRequest, NextResponse } from "next/server";
import {
  SHEETS_BUILD,
  buildPayload,
  buildTestOrder,
  getSheetsConfigStatus,
  getWebhookUrl,
  pingWebhook,
  sendOrderToGoogleSheets,
} from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET https://mutqan.online/api/debug/google-sheets
 * Always returns JSON (never 502) so you can read the real error.
 */
export async function GET(request: NextRequest) {
  try {
    const secret = process.env.DEBUG_SECRET?.trim();
    if (secret) {
      const key = request.nextUrl.searchParams.get("key");
      if (key !== secret) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
    }

    const config = getSheetsConfigStatus();
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      return NextResponse.json({
        ok: false,
        build: SHEETS_BUILD,
        error: "GOOGLE_SHEETS_WEBHOOK_URL not configured on frontend",
        config,
      });
    }

    const ping = await pingWebhook();
    const testOrder = buildTestOrder();
    const payload = buildPayload(testOrder);
    const post = await sendOrderToGoogleSheets(testOrder);

    const ok = ping.success && post.success;

    return NextResponse.json({
      ok,
      build: SHEETS_BUILD,
      config,
      ping: {
        ok: ping.success,
        status_code: ping.status,
        response_body: ping.body,
        error: ping.error,
      },
      post_test_row: {
        ok: post.success,
        status_code: post.status,
        response_body: post.body,
        error: post.error,
        orderid: payload.orderid,
      },
      payload_sent: payload,
      hint: !ok
        ? "إذا error يحتوي Set SHEET_ID — عيّن SHEET_ID في Apps Script وأعد Deploy كـ Web app (Anyone)"
        : "تحقق من صف جديد في Google Sheet",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[debug/google-sheets] crash:", message);
    return NextResponse.json({
      ok: false,
      build: SHEETS_BUILD,
      error: "route_crash",
      message,
    });
  }
}
