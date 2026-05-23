const PRODUCT_SKUS: Record<string, string> = {
  "powerful-cordless-vacuum": "MTQ-VAC-001",
  "smart-stackable-cabinet": "MTQ-CAB-002",
  "pull-out-cabinet-drawer": "MTQ-DRW-003",
  "magic-under-sink-organizer": "MTQ-SNK-004",
  "pure-faucet-filter": "MTQ-FLT-005",
  "smart-table-warmer": "MTQ-WRM-006",
  "thermal-lunch-box": "MTQ-LNB-007",
};

const PRODUCT_NAMES_AR: Record<string, string> = {
  "powerful-cordless-vacuum": "المكنسة اللاسلكية القوية",
  "smart-stackable-cabinet": "الخزانة التراكمية الذكية",
  "pull-out-cabinet-drawer": "درج الخزانة المنزلق",
  "magic-under-sink-organizer": "منظّم المغسلة السحري",
  "pure-faucet-filter": "فلتر الصنبور النقي",
  "smart-table-warmer": "سخّان المائدة الذكي",
  "thermal-lunch-box": "حافظة الغداء الحرارية",
};

export function getProductSku(slug: string): string {
  return PRODUCT_SKUS[slug] || `MTQ-${slug.slice(0, 8).toUpperCase()}`;
}

export function getProductNameAr(slug: string, fallback?: string): string {
  return PRODUCT_NAMES_AR[slug] || fallback || slug;
}

interface OrderItem {
  product_slug: string;
  bundle_id?: string;
  quantity: number;
  item_type: string;
  price_sar: number;
  name_ar?: string;
}

export interface CodNetworkRow {
  date: string;
  orderid: string;
  country: string;
  name: string;
  phone: string;
  product: string;
  sku: string;
  quantity: string;
  total_price: number;
  currency: string;
  status: string;
  note: string;
}

interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
}

function formatDateDDMMYYYY(): string {
  const now = new Date();
  const saudi = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const dd = String(saudi.getUTCDate()).padStart(2, "0");
  const mm = String(saudi.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = saudi.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatSaudiPhoneCodNetwork(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  return `966${digits}`;
}

export function buildCodNetworkRow(
  orderNumber: string,
  customerName: string,
  phoneE164: string,
  items: OrderItem[],
  totalSar: number,
  tracking?: TrackingData | null,
): CodNetworkRow {
  const products: string[] = [];
  const skus: string[] = [];
  const quantities: string[] = [];

  for (const item of items) {
    const nameAr = getProductNameAr(item.product_slug, item.name_ar);
    const sku = getProductSku(item.product_slug);
    const qty = item.quantity || 1;

    products.push(nameAr);
    skus.push(sku);
    quantities.push(String(qty));
  }

  const noteParts: string[] = [];
  if (tracking?.utm_source) noteParts.push(`source: ${tracking.utm_source}`);
  if (tracking?.utm_medium) noteParts.push(`medium: ${tracking.utm_medium}`);
  if (tracking?.utm_campaign) noteParts.push(`campaign: ${tracking.utm_campaign}`);
  if (tracking?.utm_content) noteParts.push(`content: ${tracking.utm_content}`);
  if (tracking?.utm_term) noteParts.push(`term: ${tracking.utm_term}`);
  if (tracking?.landing_page) noteParts.push(`page: ${tracking.landing_page}`);

  return {
    date: formatDateDDMMYYYY(),
    orderid: orderNumber,
    country: "KSA",
    name: customerName,
    phone: formatSaudiPhoneCodNetwork(phoneE164),
    product: products.join("/"),
    sku: skus.join("/"),
    quantity: quantities.join("/"),
    total_price: totalSar,
    currency: "SAR",
    status: "",
    note: noteParts.join(" | "),
  };
}

export async function sendToCodNetwork(
  webhookUrl: string,
  payload: CodNetworkRow,
  retries = 2,
): Promise<{ success: boolean; status?: string; error?: string }> {
  const url = webhookUrl.trim();
  console.log(`[CodNetwork] Attempting to send order ${payload.orderid} to ${url.substring(0, 60)}...`);

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload),
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const text = await response.text().catch(() => "");
      console.log(`[CodNetwork] Attempt ${attempt} — HTTP ${response.status} — Body: ${text.substring(0, 300)}`);

      let result: Record<string, unknown> = {};
      try { result = JSON.parse(text); } catch { /* not JSON */ }

      if (result.status === "duplicate") {
        console.log(`[CodNetwork] Duplicate order skipped: ${payload.orderid}`);
        return { success: true, status: "duplicate" };
      }

      if (result.status === "success" || response.ok) {
        console.log(`[CodNetwork] Order sent successfully: ${payload.orderid}`);
        return { success: true, status: "sent" };
      }

      console.warn(`[CodNetwork] Attempt ${attempt} failed with HTTP ${response.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[CodNetwork] Attempt ${attempt} error for ${payload.orderid}: ${message}`);

      if (attempt <= retries) {
        const delay = attempt * 2000;
        console.log(`[CodNetwork] Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        return { success: false, error: message };
      }
    }
  }

  return { success: false, error: "All retries exhausted" };
}
