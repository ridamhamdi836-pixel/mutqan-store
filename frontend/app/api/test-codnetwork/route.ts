import { NextResponse } from "next/server";
import { buildCodNetworkRow, sendToCodNetwork } from "@/lib/codnetwork";

export async function POST() {
  const webhookUrl = process.env.CODNETWORK_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "CODNETWORK_WEBHOOK_URL not configured" },
      { status: 500 }
    );
  }

  const testRow = buildCodNetworkRow(
    `mutqan-test-${Date.now()}`,
    "سارة محمد (اختبار)",
    "+966504752330",
    [
      {
        product_slug: "smart-table-warmer",
        quantity: 2,
        item_type: "main",
        price_sar: 449,
        name_ar: "سخّان المائدة الذكي",
      },
      {
        product_slug: "pure-faucet-filter",
        quantity: 1,
        item_type: "main",
        price_sar: 199,
        name_ar: "فلتر الصنبور النقي",
      },
    ],
    648,
    {
      utm_source: "snapchat",
      utm_medium: "paid",
      utm_campaign: "ramadan_2026",
      landing_page: "https://mutqan.online/products/smart-table-warmer",
    },
  );

  const result = await sendToCodNetwork(webhookUrl, testRow);

  return NextResponse.json({
    test: "CodNetwork integration",
    row_sent: testRow,
    result,
  });
}
