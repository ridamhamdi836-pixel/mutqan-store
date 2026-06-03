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
  savedAt: number;
};

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
