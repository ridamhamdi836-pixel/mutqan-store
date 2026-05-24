/**
 * Google Sheets order sync — clean v1
 * Primary destination for every checkout order (frontend only).
 */

export const SHEETS_BUILD = "google-sheets-clean-v1";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
const WEBHOOK_TIMEOUT_MS = 25_000;

/** Payload keys match Apps Script + sheet columns */
export interface GoogleSheetsPayload {
  date: string;
  orderid: string;
  country: string;
  name: string;
  phone: string;
  address: string;
  url: string;
  sku: string;
  product: string;
  quantity: string;
  price: number;
  currency: string;
}

export interface GoogleSheetsOrderInput {
  orderid: string;
  customerName: string;
  phoneE164: string;
  items: Array<{
    product_slug: string;
    name_ar?: string;
    quantity: number;
  }>;
  totalSar: number;
  address?: string;
}

const PRODUCT_SKU: Record<string, string> = {
  "powerful-cordless-vacuum": "MTQ-VAC-001",
  "smart-stackable-cabinet": "MTQ-CAB-002",
  "pull-out-cabinet-drawer": "MTQ-DRW-003",
  "magic-under-sink-organizer": "MTQ-SNK-004",
  "pure-faucet-filter": "MTQ-FLT-005",
  "smart-table-warmer": "MTQ-WRM-006",
  "thermal-lunch-box": "MTQ-LNB-007",
};

const PRODUCT_NAME_AR: Record<string, string> = {
  "powerful-cordless-vacuum": "المكنسة اللاسلكية القوية",
  "smart-stackable-cabinet": "الخزانة التراكمية الذكية",
  "pull-out-cabinet-drawer": "درج الخزانة المنزلق",
  "magic-under-sink-organizer": "منظّم المغسلة السحري",
  "pure-faucet-filter": "فلتر الصنبور النقي",
  "smart-table-warmer": "سخّان المائدة الذكي",
  "thermal-lunch-box": "حافظة الغداء الحرارية",
};

/** mutqan-XXXXXXXX (8 alphanumeric) */
export function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 8; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `mutqan-${suffix}`;
}

function formatDateSaudi(): string {
  const saudi = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const dd = String(saudi.getUTCDate()).padStart(2, "0");
  const mm = String(saudi.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = saudi.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatSaudiPhone(phoneE164: string): string {
  const digits = phoneE164.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  return `966${digits}`;
}

function productName(slug: string, nameAr?: string): string {
  return nameAr?.trim() || PRODUCT_NAME_AR[slug] || slug;
}

function productSku(slug: string): string {
  return PRODUCT_SKU[slug] || `MTQ-${slug.slice(0, 6).toUpperCase()}`;
}

function productUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

export function buildPayload(order: GoogleSheetsOrderInput): GoogleSheetsPayload {
  const products: string[] = [];
  const skus: string[] = [];
  const quantities: string[] = [];
  const urls: string[] = [];

  for (const item of order.items) {
    products.push(productName(item.product_slug, item.name_ar));
    skus.push(productSku(item.product_slug));
    quantities.push(String(item.quantity || 1));
    urls.push(productUrl(item.product_slug));
  }

  return {
    date: formatDateSaudi(),
    orderid: order.orderid,
    country: "KSA",
    name: order.customerName.trim(),
    phone: formatSaudiPhone(order.phoneE164),
    address: order.address?.trim() || order.orderid,
    url: urls.join("/"),
    sku: skus.join("/"),
    product: products.join("/"),
    quantity: quantities.join("/"),
    price: order.totalSar,
    currency: "SAR",
  };
}

export function getWebhookUrl(): string | null {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  return url || null;
}

export type SheetsSendResult = {
  success: boolean;
  status?: number;
  body?: string;
  error?: string;
};

export async function sendOrderToGoogleSheets(
  order: GoogleSheetsOrderInput,
): Promise<SheetsSendResult> {
  const webhookUrl = getWebhookUrl();

  if (!webhookUrl) {
    console.error("[GoogleSheets] GOOGLE_SHEETS_WEBHOOK_URL is not set");
    return { success: false, error: "webhook_not_configured" };
  }

  if (!webhookUrl.endsWith("/exec")) {
    console.error("[GoogleSheets] Invalid URL — must end with /exec");
    return { success: false, error: "invalid_webhook_url" };
  }

  const payload = buildPayload(order);
  const body = JSON.stringify(payload);

  console.log("[GoogleSheets] POST start", {
    build: SHEETS_BUILD,
    orderid: payload.orderid,
    url: webhookUrl.slice(0, 72),
    payload,
  });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
      redirect: "follow",
      signal: controller.signal,
    });

    clearTimeout(timer);

    const text = await response.text();
    console.log("[GoogleSheets] POST done", {
      orderid: payload.orderid,
      status: response.status,
      body: text.slice(0, 400),
    });

    const accepted =
      response.ok &&
      (text.includes('"status":"success"') || text.includes("success"));

    if (!accepted) {
      return {
        success: false,
        status: response.status,
        body: text.slice(0, 500),
        error: "apps_script_rejected",
      };
    }

    return { success: true, status: response.status, body: text.slice(0, 500) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GoogleSheets] POST failed", { orderid: order.orderid, error: message });
    return { success: false, error: message };
  }
}

export function buildTestOrder(): GoogleSheetsOrderInput {
  return {
    orderid: generateOrderId(),
    customerName: "اختبار متقن",
    phoneE164: "+966501234567",
    items: [
      {
        product_slug: "smart-table-warmer",
        name_ar: "سخّان المائدة الذكي",
        quantity: 1,
      },
    ],
    totalSar: 249,
    address: "اختبار",
  };
}
