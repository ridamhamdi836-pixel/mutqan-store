import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import {
  mergeUpsellIntoGoogleSheets,
  syncOrderByNumberToGoogleSheets,
  type GoogleSheetsOrderInput,
} from "@/lib/google-sheets";

type AddItemInput = {
  slug: string;
  name_ar?: string;
  price_sar?: number;
};

type MergeContext = {
  customer_name: string;
  phone_e164: string;
  existing_items: Array<{
    product_slug: string;
    name_ar?: string;
    quantity?: number;
  }>;
  total_sar: number;
};

function buildMergedSheetsOrder(
  orderNumber: string,
  items: AddItemInput[],
  mergeContext: MergeContext,
  totalSar: number,
): GoogleSheetsOrderInput {
  const mergedItems = [
    ...mergeContext.existing_items.map((i) => ({
      product_slug: i.product_slug,
      name_ar: i.name_ar,
      quantity: i.quantity || 1,
    })),
    ...items.map((i) => ({
      product_slug: i.slug,
      name_ar: `${i.name_ar || i.slug} (إضافة لنفس الطلب)`,
      quantity: 1,
    })),
  ];

  return {
    orderid: orderNumber,
    customerName: mergeContext.customer_name,
    phoneE164: mergeContext.phone_e164,
    items: mergedItems,
    totalSar,
    address: "",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, items, merge_context } = body as {
      order_number: string;
      items: AddItemInput[];
      merge_context?: MergeContext;
    };

    if (!order_number || !items?.length) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message_ar: "بيانات غير صالحة." } },
        { status: 400 },
      );
    }

    if (!merge_context?.existing_items?.length) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_MERGE_CONTEXT",
            message_ar: "تعذر دمج الإضافة — أعد إتمام الطلب من السلة.",
          },
        },
        { status: 400 },
      );
    }

    const totalAdded = items.reduce(
      (sum, item) => sum + (item.price_sar || 0),
      0,
    );

    const now = new Date().toISOString();
    const pool = getPool();
    let dbUpdated = false;
    let newTotalSar = merge_context.total_sar + totalAdded;

    if (pool) {
      try {
        const client = await pool.connect();
        try {
          const orderResult = await client.query(
            "SELECT id, total_sar, upsell_total_sar FROM orders WHERE order_number = $1",
            [order_number],
          );

          if (orderResult.rows.length > 0) {
            const order = orderResult.rows[0];

            await client.query("BEGIN");

            for (const item of items) {
              await client.query(
                `INSERT INTO order_items (
                  id, order_id, product_slug, name_ar, quantity,
                  unit_price_sar, total_price_sar, item_type, created_at
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [
                  crypto.randomUUID(),
                  order.id,
                  item.slug,
                  item.name_ar || item.slug,
                  1,
                  item.price_sar || 0,
                  item.price_sar || 0,
                  "post_order_upsell",
                  now,
                ],
              );
            }

            const newUpsellTotal = (order.upsell_total_sar || 0) + totalAdded;
            newTotalSar = (order.total_sar || 0) + totalAdded;
            await client.query(
              "UPDATE orders SET upsell_total_sar = $1, total_sar = $2, updated_at = $3 WHERE id = $4",
              [newUpsellTotal, newTotalSar, now, order.id],
            );

            await client.query("COMMIT");
            dbUpdated = true;
          }
        } catch (dbErr) {
          await client.query("ROLLBACK");
          console.error("[add-item] DB failed:", dbErr);
        } finally {
          client.release();
        }
      } catch (connErr) {
        console.error("[add-item] DB connection failed:", connErr);
      }
    }

    const mergedOrder = buildMergedSheetsOrder(
      order_number,
      items,
      merge_context,
      newTotalSar,
    );

    // Always merge into the same Sheets row (session has full line items + new upsells).
    let sheetsResult = await mergeUpsellIntoGoogleSheets(mergedOrder);

    if (!sheetsResult.success && dbUpdated) {
      sheetsResult = await syncOrderByNumberToGoogleSheets(order_number);
    }

    if (!dbUpdated && !sheetsResult.success) {
      return NextResponse.json(
        {
          error: {
            code: "ORDER_NOT_FOUND",
            message_ar: "تعذر دمج الإضافة مع الطلب. تواصل معنا عبر واتساب.",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message_ar: "تم إضافة المنتجات لطلبك بنجاح!",
      total_added_sar: totalAdded,
      total_sar: newTotalSar,
      sheets_synced: sheetsResult.success,
      merged_into_order: order_number,
    });
  } catch {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message_ar: "حدث خطأ." } },
      { status: 500 },
    );
  }
}
