import type { CreateOrderResponse } from "@/types";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data?.error?.message_ar || "حدث خطأ. فضلاً حاول مرة أخرى.";
    const errorCode = data?.error?.code || "UNKNOWN_ERROR";
    const error = new Error(errorMsg) as Error & { code: string; field?: string };
    error.code = errorCode;
    error.message = errorMsg;
    if (data?.error?.field) error.field = data.error.field;
    throw error;
  }

  return data;
}

export const apiClient = {
  createOrder: (payload: object) =>
    apiFetch<CreateOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  acceptUpsell: (orderId: string, offerId: string) =>
    apiFetch<{ order: unknown; message_ar: string }>(`/api/orders/upsell`, {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, offer_id: offerId, action: "accept" }),
    }),

  declineUpsell: (orderId: string, offerId: string) =>
    apiFetch<{ order: unknown; message_ar: string }>(`/api/orders/upsell`, {
      method: "POST",
      body: JSON.stringify({ order_id: orderId, offer_id: offerId, action: "decline" }),
    }),

  trackOrder: (orderNumber: string, phone: string) =>
    apiFetch<unknown>("/api/orders/track", {
      method: "POST",
      body: JSON.stringify({ public_order_number: orderNumber, phone }),
    }),
};
