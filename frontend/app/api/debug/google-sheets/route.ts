import { NextResponse } from "next/server";
import {
  buildGoogleSheetsPayload,
  getGoogleSheetsWebhookUrl,
  sendOrderToGoogleSheets,
} from "@/lib/google-sheets";

export async function GET() {
  const url = getGoogleSheetsWebhookUrl();

  if (!url) {
    return NextResponse.json({
      ok: false,
      error: "GOOGLE_SHEETS_WEBHOOK_URL (or CODNETWORK_WEBHOOK_URL) not set on FRONTEND",
      hint: "Add GOOGLE_SHEETS_WEBHOOK_URL in EasyPanel → frontend → Environment",
    });
  }

  const issues: string[] = [];
  if (!url.startsWith("https://script.google.com/macros/s/")) {
    issues.push("URL must start with https://script.google.com/macros/s/");
  }
  if (!url.endsWith("/exec")) {
    issues.push("URL must end with /exec");
  }

  if (issues.length > 0) {
    return NextResponse.json({ ok: false, url_preview: url.slice(0, 72), issues });
  }

  const testPayload = buildGoogleSheetsPayload(
    `FE-TEST-${Date.now()}`,
    "اختبار Frontend",
    "+966501234567",
    [{ product_slug: "smart-table-warmer", name_ar: "سخّان المائدة", quantity: 1, price_sar: 249 }],
    249,
    { landing_page: "https://mutqan.online" },
  );

  const result = await sendOrderToGoogleSheets(testPayload);

  return NextResponse.json({
    ok: result.success,
    service: "frontend",
    url_preview: url.slice(0, 72) + "...",
    payload_sent: testPayload,
    result,
  });
}
