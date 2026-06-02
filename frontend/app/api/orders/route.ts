import { NextRequest, NextResponse } from "next/server";
import { normalizePhone, validatePhone } from "@/lib/phone";
import { getPool } from "@/lib/db";
import { sendOrderToGoogleSheets, type GoogleSheetsOrderInput } from "@/lib/google-sheets";
import { allocateOrderNumber, allocateOrderNumberStandalone } from "@/lib/order-number";

interface OrderItemInput {
  product_slug: string;
  bundle_id?: string;
  quantity: number;
  item_type: string;
  price_sar: number;
  name_ar?: string;
}

interface TrackingInput {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_page?: string;
  referrer?: string;
}

const recentOrders = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

function cleanupRecentOrders() {
  const now = Date.now();
  for (const [key, timestamp] of recentOrders) {
    if (now - timestamp > DUPLICATE_WINDOW_MS) recentOrders.delete(key);
  }
}

function isDuplicateOrder(phoneE164: string, totalSar: number): boolean {
  cleanupRecentOrders();
  const key = `${phoneE164}:${totalSar}`;
  if (recentOrders.has(key)) return true;
  recentOrders.set(key, Date.now());
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, tracking } = body as {
      customer: { full_name: string; phone: string };
      items: OrderItemInput[];
      tracking?: TrackingInput;
    };

    if (!customer?.full_name?.trim() || customer.full_name.trim().length < 2) {
      return NextResponse.json(
        { error: { code: "INVALID_NAME", message_ar: "فضلاً أدخل الاسم الكامل.", field: "name" } },
        { status: 400 },
      );
    }

    if (!validatePhone(customer.phone)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_PHONE",
            message_ar: "فضلاً أدخل رقم جوال صحيح.",
            field: "phone",
          },
        },
        { status: 400 },
      );
    }

    if (!items?.length) {
      return NextResponse.json(
        { error: { code: "EMPTY_CART", message_ar: "السلة فارغة." } },
        { status: 400 },
      );
    }

    const { e164: phoneE164, local: phoneLocal } = normalizePhone(customer.phone);

    const totalSar = items.reduce(
      (sum, item) => sum + (item.price_sar || 0) * (item.quantity || 1),
      0,
    );

    if (isDuplicateOrder(phoneE164, totalSar)) {
      return NextResponse.json(
        {
          error: {
            code: "DUPLICATE_ORDER",
            message_ar: "تم استلام طلبك بالفعل. يرجى الانتظار للتأكيد عبر واتساب.",
          },
        },
        { status: 409 },
      );
    }

    const orderId = crypto.randomUUID();
    const now = new Date().toISOString();

    const pool = getPool();
    let orderNumber: string;

    if (pool) {
      try {
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          orderNumber = await allocateOrderNumber(client);

          await client.query(
            `INSERT INTO orders (
              id, order_number, customer_name, customer_phone_e164, customer_phone_national,
              status, confirmation_status, delivery_status,
              subtotal_sar, upsell_total_sar, total_sar, currency,
              landing_page, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
              created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$20)`,
            [
              orderId,
              orderNumber,
              customer.full_name.trim(),
              phoneE164,
              phoneLocal,
              "confirmed",
              "pending",
              "pending",
              totalSar,
              0,
              totalSar,
              "SAR",
              tracking?.landing_page || null,
              tracking?.referrer || null,
              tracking?.utm_source || null,
              tracking?.utm_medium || null,
              tracking?.utm_campaign || null,
              tracking?.utm_content || null,
              tracking?.utm_term || null,
              now,
            ],
          );

          for (const item of items) {
            await client.query(
              `INSERT INTO order_items (
                id, order_id, product_slug, bundle_id, name_ar, quantity,
                unit_price_sar, total_price_sar, item_type, created_at
              ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
              [
                crypto.randomUUID(),
                orderId,
                item.product_slug,
                item.bundle_id || null,
                item.name_ar || item.product_slug,
                item.quantity || 1,
                item.price_sar || 0,
                (item.price_sar || 0) * (item.quantity || 1),
                item.item_type || "main",
                now,
              ],
            );
          }

          await client.query("COMMIT");
        } catch (dbErr) {
          await client.query("ROLLBACK");
          console.error("[Orders] DB insert failed:", dbErr);
          return NextResponse.json(
            {
              error: {
                code: "SERVER_ERROR",
                message_ar: "تعذر تسجيل الطلب. فضلاً حاول مرة أخرى.",
              },
            },
            { status: 503 },
          );
        } finally {
          client.release();
        }
      } catch (connErr) {
        console.error("[Orders] DB connection failed:", connErr);
        return NextResponse.json(
          {
            error: {
              code: "SERVER_ERROR",
              message_ar: "تعذر تسجيل الطلب. فضلاً حاول مرة أخرى.",
            },
          },
          { status: 503 },
        );
      }
    } else {
      try {
        orderNumber = await allocateOrderNumberStandalone();
      } catch {
        return NextResponse.json(
          {
            error: {
              code: "SERVER_ERROR",
              message_ar: "تعذر تسجيل الطلب. فضلاً حاول مرة أخرى.",
            },
          },
          { status: 503 },
        );
      }
    }

    const sheetsOrder: GoogleSheetsOrderInput = {
      orderid: orderNumber,
      customerName: customer.full_name.trim(),
      phoneE164,
      items: items.map((i) => ({
        product_slug: i.product_slug,
        name_ar: i.name_ar,
        quantity: i.quantity || 1,
      })),
      totalSar,
      address: "",
    };

    const sheetsResult = await sendOrderToGoogleSheets(sheetsOrder);
    if (!sheetsResult.success) {
      console.error("[Orders] Google Sheets FAILED — order saved in DB only:", {
        orderid: orderNumber,
        error: sheetsResult.error,
        status: sheetsResult.status,
        body: sheetsResult.body?.slice(0, 300),
      });
    } else {
      console.log("[Orders] Google Sheets OK:", orderNumber);
    }

    return NextResponse.json(
      {
        order: {
          id: orderId,
          public_order_number: orderNumber,
          status: "placed",
          subtotal_sar: totalSar,
          discount_sar: 0,
          shipping_sar: 0,
          total_sar: totalSar,
          currency: "SAR",
        },
        customer: { phone_e164: phoneE164 },
        order_slugs: items.map((i) => i.product_slug),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[Orders] Unexpected error:", err);
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message_ar: "حدث خطأ في الخادم. فضلاً حاول مرة أخرى." } },
      { status: 500 },
    );
  }
}
