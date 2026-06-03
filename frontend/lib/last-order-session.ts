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
