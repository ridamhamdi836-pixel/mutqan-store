import { NextResponse } from "next/server";
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
 * Sends one test row to Google Sheets.
 */
export async function GET() {
  console.log("[debug/google-sheets] route hit", { build: SHEETS_BUILD });

  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    console.error("[debug/google-sheets] GOOGLE_SHEETS_WEBHOOK_URL missing");
    return NextResponse.json(
      {
        ok: false,
        build: SHEETS_BUILD,
        error: "GOOGLE_SHEETS_WEBHOOK_URL not configured on frontend",
      },
      { status: 500 },
    );
  }

  const testOrder = buildTestOrder();
  const payload = buildPayload(testOrder);

  console.log("[debug/google-sheets] sending test", { payload, webhookUrl: webhookUrl.slice(0, 72) });

  const result = await sendOrderToGoogleSheets(testOrder);

  if (!result.success) {
    console.error("[debug/google-sheets] failed", result);
    return NextResponse.json(
      {
        ok: false,
        build: SHEETS_BUILD,
        payload_sent: payload,
        webhook_url_preview: `${webhookUrl.slice(0, 60)}...`,
        ...result,
      },
      { status: 502 },
    );
  }

  console.log("[debug/google-sheets] success", result);

  return NextResponse.json({
    ok: true,
    build: SHEETS_BUILD,
    message: "Test row sent to Google Sheets",
    orderid: payload.orderid,
    payload_sent: payload,
    sheets_response: result.body,
    status_code: result.status,
  });
}
