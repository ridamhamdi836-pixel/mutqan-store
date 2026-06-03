/**
 * Google Sheets order sync — clean v1
 * Primary destination for every checkout order (frontend only).
 */

import { getCatalogNameAr, getCatalogSku } from "@/config/catalog";
import { getPool } from "@/lib/db";

export const SHEETS_BUILD = "google-sheets-order-number-col-v3";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
const WEBHOOK_TIMEOUT_MS = 25_000;

/** Payload keys match Apps Script + sheet columns */
export interface GoogleSheetsPayload {
  date: string;
  orderid: string;
  order_number: string;
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

/** @deprecated Use allocateOrderNumber — kept for debug test label only */
export function generateOrderId(): string {
  return "mutqan-TEST0001";
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
  return nameAr?.trim() || getCatalogNameAr(slug);
}

function productSku(slug: string): string {
  return getCatalogSku(slug);
}

function productUrl(slug: string): string {
  return `${SITE_URL}/products/${slug}`;
}

/** Readable line for Sheets quantity column — avoids 1/1/1 being parsed as a date */
export function formatOrderItemsSummary(
  items: GoogleSheetsOrderInput["items"],
): string {
  return items
    .map((item) => {
      const name = productName(item.product_slug, item.name_ar);
      const qty = item.quantity || 1;
      return `${name} ${qty}`;
    })
    .join(" ");
}

export function buildPayload(order: GoogleSheetsOrderInput): GoogleSheetsPayload {
  const products: string[] = [];
  const skus: string[] = [];
  const urls: string[] = [];

  for (const item of order.items) {
    products.push(productName(item.product_slug, item.name_ar));
    skus.push(productSku(item.product_slug));
    urls.push(productUrl(item.product_slug));
  }

  const orderId = order.orderid.trim();

  return {
    date: formatDateSaudi(),
    orderid: orderId,
    order_number: orderId,
    country: "KSA",
    name: order.customerName.trim(),
    phone: formatSaudiPhone(order.phoneE164),
    address: order.address?.trim() || "",
    url: urls.join("/"),
    sku: skus.join("/"),
    product: products.join("/"),
    quantity: formatOrderItemsSummary(order.items),
    price: order.totalSar,
    currency: "SAR",
  };
}

export function getWebhookUrl(): string | null {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  return url || null;
}

export function getSheetsConfigStatus(): {
  configured: boolean;
  validExecUrl: boolean;
  preview: string | null;
} {
  const url = getWebhookUrl();
  if (!url) {
    return { configured: false, validExecUrl: false, preview: null };
  }
  return {
    configured: true,
    validExecUrl: url.endsWith("/exec"),
    preview: `${url.slice(0, 55)}...`,
  };
}

function parseAppsScriptResponse(text: string): { ok: boolean; message?: string } {
  const trimmed = text.trim();
  try {
    const json = JSON.parse(trimmed) as { status?: string; message?: string };
    if (json.status === "success") return { ok: true };
    return {
      ok: false,
      message: json.message || `apps_script_status_${json.status || "unknown"}`,
    };
  } catch {
    if (trimmed.includes("<!DOCTYPE") || trimmed.includes("<html")) {
      return { ok: false, message: "html_response_check_webhook_url" };
    }
    return { ok: false, message: trimmed.slice(0, 200) || "empty_response" };
  }
}

export type SheetsSendResult = {
  success: boolean;
  status?: number;
  body?: string;
  error?: string;
};

/** Quick GET check — Apps Script doGet should return JSON */
export async function pingWebhook(): Promise<SheetsSendResult> {
  const webhookUrl = getWebhookUrl();
  if (!webhookUrl) {
    return { success: false, error: "webhook_not_configured" };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(webhookUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timer);
    const text = await response.text();
    const parsed = parseAppsScriptResponse(text);
    const sheetIdOk =
      text.includes('"sheet_id_set":true') ||
      text.includes('"sheet_id_set": true') ||
      (text.includes('"sheet_id"') &&
        !text.includes("PASTE_YOUR_SHEET_ID") &&
        !text.includes('"sheet_id_set":false'));

    return {
      success:
        response.ok &&
        (parsed.ok || text.includes('"status":"ok"')) &&
        sheetIdOk,
      status: response.status,
      body: text.slice(0, 500),
      error: sheetIdOk
        ? parsed.ok
          ? undefined
          : parsed.message
        : "apps_script_stale_deploy_set_sheet_id_or_new_version",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

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

    const parsed = parseAppsScriptResponse(text);
    const accepted = response.ok && parsed.ok;

    if (!accepted) {
      console.error("[GoogleSheets] rejected", {
        orderid: payload.orderid,
        httpStatus: response.status,
        message: parsed.message,
        bodyPreview: text.slice(0, 300),
      });
      return {
        success: false,
        status: response.status,
        body: text.slice(0, 500),
        error: parsed.message || "apps_script_rejected",
      };
    }

    return { success: true, status: response.status, body: text.slice(0, 500) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GoogleSheets] POST failed", { orderid: order.orderid, error: message });
    return { success: false, error: message };
  }
}

/** Merge upsell lines into one Sheets row (same orderid — Apps Script updates, never duplicates). */
export async function mergeUpsellIntoGoogleSheets(
  order: GoogleSheetsOrderInput,
): Promise<SheetsSendResult> {
  return sendOrderToGoogleSheets(order);
}

/** Re-sync full order to Sheets (e.g. after post-purchase upsell). Updates row if orderid exists. */
export async function syncOrderByNumberToGoogleSheets(
  orderNumber: string,
): Promise<SheetsSendResult> {
  const pool = getPool();
  if (!pool) {
    console.warn("[GoogleSheets] sync skipped — no DATABASE_URL");
    return { success: false, error: "db_not_configured" };
  }

  try {
    const client = await pool.connect();
    try {
      const orderRes = await client.query(
        `SELECT order_number, customer_name, customer_phone_e164, total_sar
         FROM orders WHERE order_number = $1`,
        [orderNumber],
      );
      if (orderRes.rows.length === 0) {
        return { success: false, error: "order_not_found" };
      }
      const order = orderRes.rows[0];
      const itemsRes = await client.query(
        `SELECT product_slug, name_ar, quantity FROM order_items
         WHERE order_id = (SELECT id FROM orders WHERE order_number = $1)
         ORDER BY created_at`,
        [orderNumber],
      );

      const sheetsOrder: GoogleSheetsOrderInput = {
        orderid: order.order_number,
        customerName: order.customer_name,
        phoneE164: order.customer_phone_e164,
        items: itemsRes.rows.map((row) => ({
          product_slug: row.product_slug,
          name_ar: row.name_ar,
          quantity: row.quantity || 1,
        })),
        totalSar: Number(order.total_sar),
        address: "",
      };

      return sendOrderToGoogleSheets(sheetsOrder);
    } finally {
      client.release();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GoogleSheets] sync failed", { orderNumber, error: message });
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
