import { NextRequest, NextResponse } from "next/server";
import {
  SHEETS_BUILD,
  buildPayload,
  buildTestOrder,
  getWebhookUrl,
  sendOrderToGoogleSheets,
} from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET https://mutqan.online/api/debug/google-sheets
 */
export async function GET(request: NextRequest) {
  const secret = process.env.DEBUG_SECRET?.trim();
  if (secret) {
    const key = request.nextUrl.searchParams.get("key");
    if (key !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  console.log("[debug/google-sheets] GET", { build: SHEETS_BUILD });

  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    console.error("[debug/google-sheets] GOOGLE_SHEETS_WEBHOOK_URL not set");
    return NextResponse.json(
      {
        ok: false,
        build: SHEETS_BUILD,
        error: "GOOGLE_SHEETS_WEBHOOK_URL not configured",
      },
      { status: 500 },
    );
  }

  const testOrder = buildTestOrder();
  const payload = buildPayload(testOrder);

  console.log("[debug/google-sheets] sending", {
    orderid: payload.orderid,
    webhook: webhookUrl.slice(0, 72),
  });

  const result = await sendOrderToGoogleSheets(testOrder);

  if (!result.success) {
    console.error("[debug/google-sheets] failed", result);
    return NextResponse.json(
      {
        ok: false,
        build: SHEETS_BUILD,
        status_code: result.status ?? 0,
        response_body: result.body ?? result.error ?? "unknown_error",
        payload_sent: payload,
      },
      { status: 502 },
    );
  }

  console.log("[debug/google-sheets] success", {
    status_code: result.status,
    response_body: result.body?.slice(0, 200),
  });

  return NextResponse.json({
    ok: true,
    build: SHEETS_BUILD,
    status_code: result.status ?? 200,
    response_body: result.body ?? "",
    orderid: payload.orderid,
  });
}
