import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { buildCodNetworkRow, sendToCodNetwork } from "@/lib/codnetwork";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_number, items } = body;

    if (!order_number || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message_ar: "بيانات غير صالحة." } },
        { status: 400 }
      );
    }

    const totalAdded = items.reduce(
      (sum: number, item: { price_sar?: number }) => sum + (item.price_sar || 0),
      0
    );

    const now = new Date().toISOString();
    let customerName = "";
    let customerPhone = "";

    const pool = getPool();
    if (pool) {
      try {
        const client = await pool.connect();
        try {
          const orderResult = await client.query(
            "SELECT id, total_sar, upsell_total_sar, customer_name, customer_phone_e164 FROM orders WHERE order_number = $1",
            [order_number]
          );

          if (orderResult.rows.length > 0) {
            const order = orderResult.rows[0];
            customerName = order.customer_name || "";
            customerPhone = order.customer_phone_e164 || "";

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
                  "upsell",
                  now,
                ]
              );
            }

            const newUpsellTotal = (order.upsell_total_sar || 0) + totalAdded;
            const newTotal = (order.total_sar || 0) + totalAdded;
            await client.query(
              "UPDATE orders SET upsell_total_sar = $1, total_sar = $2, updated_at = $3 WHERE id = $4",
              [newUpsellTotal, newTotal, now, order.id]
            );

            await client.query("COMMIT");
          }
        } catch (dbErr) {
          await client.query("ROLLBACK");
          console.error("[DB] Upsell insert failed:", dbErr);
        } finally {
          client.release();
        }
      } catch (connErr) {
        console.error("[DB] Connection failed:", connErr);
      }
    }

    const codnetworkUrl = process.env.CODNETWORK_WEBHOOK_URL;
    if (codnetworkUrl && customerName && customerPhone) {
      const upsellItems = items.map((item: { slug: string; name_ar?: string; price_sar?: number }) => ({
        product_slug: item.slug,
        quantity: 1,
        item_type: "upsell" as const,
        price_sar: item.price_sar || 0,
        name_ar: item.name_ar,
      }));

      const row = buildCodNetworkRow(
        `${order_number}-UPSELL`,
        customerName,
        customerPhone,
        upsellItems,
        totalAdded,
      );
      row.note = `اضافة بعد الطلب | الطلب الأصلي: ${order_number}`;

      sendToCodNetwork(codnetworkUrl, row).catch((err) => {
        console.error("[CodNetwork] Upsell send failed:", err);
      });
    }

    return NextResponse.json({
      success: true,
      message_ar: "تم إضافة المنتجات لطلبك بنجاح!",
      total_added_sar: totalAdded,
    });
  } catch {
    return NextResponse.json(
      { error: { code: "SERVER_ERROR", message_ar: "حدث خطأ." } },
      { status: 500 }
    );
  }
}
