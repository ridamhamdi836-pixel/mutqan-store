/**
 * Google Apps Script webhook — same format as backend integration.
 * POST must use text/plain body (not application/json) to avoid Google 404.
 */

export interface GoogleSheetsOrderPayload {
  date: string;
  orderid: string;
  country: string;
  name: string;
  phone: string;
  address: string;
  url: string;
  product: string;
  sku: string;
  quantity: string;
  total_price: number;
  currency: string;
  status: string;
  note: string;
}

function formatDateDDMMYYYY(): string {
  const now = new Date();
  const saudi = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const dd = String(saudi.getUTCDate()).padStart(2, "0");
  const mm = String(saudi.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = saudi.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatPhone(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "").replace(/^\+/, "");
}

const SKU_MAP: Record<string, string> = {
  "powerful-cordless-vacuum": "MTQ-VAC-001",
  "smart-stackable-cabinet": "MTQ-CAB-002",
  "pull-out-cabinet-drawer": "MTQ-DRW-003",
  "magic-under-sink-organizer": "MTQ-SNK-004",
  "pure-faucet-filter": "MTQ-FLT-005",
  "smart-table-warmer": "MTQ-WRM-006",
  "thermal-lunch-box": "MTQ-LNB-007",
};

export function buildGoogleSheetsPayload(
  orderNumber: string,
  customerName: string,
  phoneE164: string,
  items: Array<{
    product_slug: string;
    name_ar?: string;
    quantity: number;
    price_sar: number;
  }>,
  totalSar: number,
  tracking?: { landing_page?: string } | null,
): GoogleSheetsOrderPayload {
  const names: string[] = [];
  const skus: string[] = [];
  const qtys: string[] = [];

  for (const item of items) {
    names.push(item.name_ar || item.product_slug);
    skus.push(SKU_MAP[item.product_slug] || `MTQ-${item.product_slug.slice(0, 8).toUpperCase()}`);
    qtys.push(String(item.quantity || 1));
  }

  return {
    date: formatDateDDMMYYYY(),
    orderid: orderNumber,
    country: "KSA",
    name: customerName,
    phone: formatPhone(phoneE164),
    address: orderNumber,
    url: tracking?.landing_page || "",
    product: names.join("/"),
    sku: skus.join("/"),
    quantity: qtys.join("/"),
    total_price: totalSar,
    currency: "SAR",
    status: "",
    note: "",
  };
}

export function getGoogleSheetsWebhookUrl(): string | null {
  const url =
    process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
    process.env.CODNETWORK_WEBHOOK_URL?.trim() ||
    "";
  return url || null;
}

export async function sendOrderToGoogleSheets(
  payload: GoogleSheetsOrderPayload,
): Promise<{ success: boolean; status?: number; body?: string; error?: string }> {
  const url = getGoogleSheetsWebhookUrl();
  if (!url) {
    console.warn("[GoogleSheets] GOOGLE_SHEETS_WEBHOOK_URL not set — skip");
    return { success: false, error: "webhook_not_configured" };
  }

  if (!url.endsWith("/exec")) {
    console.error("[GoogleSheets] URL must end with /exec:", url.slice(0, 60));
    return { success: false, error: "invalid_webhook_url_must_end_with_exec" };
  }

  console.log("[GoogleSheets] Sending order", payload.orderid, "→", url.slice(0, 60));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const text = await response.text();
    console.log("[GoogleSheets] Response", response.status, text.slice(0, 300));

    const ok = response.ok && (text.includes("success") || response.status < 300);
    return { success: ok, status: response.status, body: text.slice(0, 500) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GoogleSheets] Failed:", message);
    return { success: false, error: message };
  }
}
