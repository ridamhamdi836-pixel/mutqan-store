import { NextResponse } from "next/server";

function buildTestPayload() {
  return {
    order_id: `mutqan-test-${Date.now()}`,
    name: "تشخيص تلقائي",
    phone: "966500000000",
    product: "اختبار الاتصال",
    price: 0,
    country: "KSA",
    currency: "SAR",
  };
}

export async function GET() {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      {
        error: "GOOGLE_SHEETS_WEBHOOK_URL not configured",
        env_keys: Object.keys(process.env).filter((k) => k.includes("WEBHOOK") || k.includes("SHEET")),
      },
      { status: 500 }
    );
  }

  const payload = buildTestPayload();

  try {
    const response = await fetch(webhookUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      response_body: body,
      payload,
      webhook_url: webhookUrl.trim(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        payload,
      },
      { status: 500 }
    );
  }
}
