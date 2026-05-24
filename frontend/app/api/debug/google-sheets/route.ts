import { NextResponse } from "next/server";

/** App Router: force dynamic — never static at build time */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getWebhookUrl(): string {
  return (
    process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
    process.env.CODNETWORK_WEBHOOK_URL?.trim() ||
    ""
  );
}

function buildTestPayload() {
  const now = new Date();
  const saudi = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const dd = String(saudi.getUTCDate()).padStart(2, "0");
  const mm = String(saudi.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = saudi.getUTCFullYear();
  const orderid = `DEBUG-${Date.now()}`;

  return {
    date: `${dd}/${mm}/${yyyy}`,
    orderid,
    country: "KSA",
    name: "اختبار Debug",
    phone: "966501234567",
    address: orderid,
    url: "https://mutqan.online/api/debug/google-sheets",
    product: "منتج تجريبي",
    sku: "MTQ-TEST-001",
    quantity: "1",
    total_price: 1,
    currency: "SAR",
    status: "test",
    note: "debug route GET",
  };
}

/**
 * GET https://mutqan.online/api/debug/google-sheets
 * Sends one test row to Google Apps Script (text/plain body).
 */
export async function GET() {
  console.log("[debug/google-sheets] route reached");

  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    console.error(
      "[debug/google-sheets] GOOGLE_SHEETS_WEBHOOK_URL is missing on frontend env",
    );
    return NextResponse.json(
      {
        ok: false,
        error: "GOOGLE_SHEETS_WEBHOOK_URL not configured",
        hint: "EasyPanel → frontend → Environment → add GOOGLE_SHEETS_WEBHOOK_URL ending with /exec",
      },
      { status: 500 },
    );
  }

  if (!webhookUrl.endsWith("/exec")) {
    console.error("[debug/google-sheets] invalid URL (must end with /exec):", webhookUrl.slice(0, 80));
    return NextResponse.json(
      {
        ok: false,
        error: "Webhook URL must end with /exec",
        url_preview: webhookUrl.slice(0, 80),
      },
      { status: 500 },
    );
  }

  const payload = buildTestPayload();
  const body = JSON.stringify(payload);

  console.log("[debug/google-sheets] sending test row", payload.orderid, "→", webhookUrl.slice(0, 72));

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body,
      redirect: "follow",
      cache: "no-store",
    });

    const responseText = await response.text();
    console.log(
      "[debug/google-sheets] response",
      response.status,
      responseText.slice(0, 400),
    );

    const sheetAccepted =
      response.ok &&
      (responseText.includes('"status":"success"') ||
        responseText.includes("success"));

    if (sheetAccepted) {
      return NextResponse.json({
        ok: true,
        status_code: response.status,
        orderid: payload.orderid,
        message: "Test row sent to Google Sheets",
        response_preview: responseText.slice(0, 300),
      });
    }

    return NextResponse.json(
      {
        ok: false,
        status_code: response.status,
        orderid: payload.orderid,
        error: "Apps Script did not return success",
        response_preview: responseText.slice(0, 500),
        payload_sent: payload,
      },
      { status: 502 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[debug/google-sheets] fetch failed:", message, err);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        payload_sent: payload,
      },
      { status: 500 },
    );
  }
}
