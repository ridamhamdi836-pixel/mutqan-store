import { NextResponse } from "next/server";
import { sendToCodNetwork } from "@/lib/codnetwork";
import type { CodNetworkRow } from "@/lib/codnetwork";

export async function GET() {
  const webhookUrl = process.env.CODNETWORK_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      error: "CODNETWORK_WEBHOOK_URL not configured",
      env_keys: Object.keys(process.env).filter((k) => k.includes("COD") || k.includes("WEBHOOK")),
    }, { status: 500 });
  }

  const testPayload: CodNetworkRow = {
    date: new Date().toLocaleDateString("en-GB"),
    orderid: `TEST-DIAG-${Date.now()}`,
    country: "KSA",
    name: "تشخيص تلقائي",
    phone: "966500000000",
    product: "اختبار الاتصال",
    sku: "TEST-001",
    quantity: "1",
    total_price: 0,
    currency: "SAR",
    status: "test",
    note: "اختبار تشخيصي — يرجى الحذف",
  };

  const result = await sendToCodNetwork(webhookUrl.trim(), testPayload);

  return NextResponse.json({
    webhook_url: webhookUrl.substring(0, 60) + "...",
    webhook_url_length: webhookUrl.length,
    has_trailing_spaces: webhookUrl !== webhookUrl.trim(),
    result,
  });
}
