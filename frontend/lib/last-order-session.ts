export type LastOrderLineItem = {
  productSlug: string;
  productNameAr: string;
  bundleLabelAr: string;
  quantity: number;
  priceSar: number;
};

export type LastOrderSession = {
  orderNumber: string;
  totalSar: number;
  items: LastOrderLineItem[];
  orderedSlugs: string[];
  /** For merging upsell into the same Google Sheets row when DB sync is delayed */
  customerName?: string;
  phoneE164?: string;
  /** User finished or skipped the post-purchase offer interstitial */
  upsellOfferCompleted?: boolean;
  savedAt: number;
};

export function buildThankYouUrl(orderNumber: string, totalSar: number): string {
  const params = new URLSearchParams({
    order: orderNumber,
    total: String(totalSar),
  });
  return `/thank-you?${params.toString()}`;
}

export function buildOrderOfferUrl(orderNumber: string, totalSar: number): string {
  const params = new URLSearchParams({
    order: orderNumber,
    total: String(totalSar),
  });
  return `/order-offer?${params.toString()}`;
}

export function markUpsellOfferCompleted(): void {
  const current = loadLastOrderSession();
  if (!current) return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...current,
        upsellOfferCompleted: true,
        savedAt: Date.now(),
      }),
    );
  } catch {
    /* ignore */
  }
}

const STORAGE_KEY = "mutqan_last_order";
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function saveLastOrderSession(
  data: Omit<LastOrderSession, "savedAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, savedAt: Date.now() }),
    );
  } catch {
    /* quota / private mode */
  }
}

/** Payload for merging upsell lines into the same order (DB + Google Sheets). */
export function buildOrderMergeContext(session: LastOrderSession) {
  return {
    customer_name: session.customerName?.trim() || "",
    phone_e164: session.phoneE164 || "",
    existing_items: session.items.map((i) => ({
      product_slug: i.productSlug,
      name_ar: i.productNameAr,
      quantity: i.quantity,
    })),
    total_sar: session.totalSar,
  };
}

export function appendUpsellToLastOrderSession(
  added: LastOrderLineItem[],
): LastOrderSession | null {
  const current = loadLastOrderSession();
  if (!current) return null;

  const next: LastOrderSession = {
    ...current,
    items: [...current.items, ...added],
    orderedSlugs: [
      ...current.orderedSlugs,
      ...added.map((a) => a.productSlug),
    ],
    totalSar: current.totalSar + added.reduce((s, i) => s + i.priceSar, 0),
    savedAt: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function loadLastOrderSession(): LastOrderSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastOrderSession;
    if (!parsed.orderNumber || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
