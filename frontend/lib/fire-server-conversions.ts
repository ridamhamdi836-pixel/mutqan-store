import type { TrackingData } from "@/types";

type PurchaseConversionInput = {
  eventId: string;
  phoneE164: string;
  value: number;
  orderNumber: string;
  items: Array<{
    product_slug: string;
    quantity: number;
    price_sar: number;
  }>;
  tracking?: TrackingData;
  clientIp?: string | null;
};

/** Server-side CAPI via FastAPI (tokens live on backend service). */
export async function firePurchaseConversions(
  input: PurchaseConversionInput,
): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const secret = process.env.SECRET_KEY?.trim();

  if (!apiBase) {
    console.warn("[CAPI] skipped — NEXT_PUBLIC_API_URL not set");
    return;
  }
  if (!secret) {
    console.warn("[CAPI] skipped — SECRET_KEY not set on frontend service");
    return;
  }

  const t = input.tracking;
  const body = {
    event_id: input.eventId,
    phone_e164: input.phoneE164,
    value: input.value,
    order_number: input.orderNumber,
    product_slugs: input.items.map((i) => i.product_slug),
    quantities: input.items.map((i) => i.quantity || 1),
    prices: input.items.map((i) => i.price_sar || 0),
    client_ip: input.clientIp || undefined,
    user_agent: t?.user_agent,
    meta_fbp: t?.meta_fbp,
    meta_fbc: t?.meta_fbc,
    landing_page: t?.landing_page,
    tiktok_click_id: t?.tiktok_click_id,
    snapchat_click_id: t?.snapchat_click_id,
  };

  try {
    const res = await fetch(`${apiBase}/api/v1/conversions/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": secret,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[CAPI] backend rejected", res.status, text.slice(0, 300));
      return;
    }

    const data = await res.json();
    console.log("[CAPI] sent", data);
  } catch (err) {
    console.error("[CAPI] request failed", err);
  }
}
