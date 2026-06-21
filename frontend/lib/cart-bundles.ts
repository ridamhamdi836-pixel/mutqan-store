import type { CartItem } from "@/types";

const BEAUTY_CABINET_SLUG = "beauty-vanity-cabinet";
const BRUSH_ORGANIZER_SLUG = "rotating-brush-organizer";
const BEAUTY_CABINET_BUNDLE_ID = "beauty-cabinet-1";
const BRUSH_ORGANIZER_ADDON_BUNDLE_ID = "brush-org-addon-with-cabinet";

export type CartDisplayLine =
  | {
      kind: "bundle";
      id: string;
      title: string;
      subtitle: string;
      items: CartItem[];
      totalSar: number;
    }
  | {
      kind: "item";
      id: string;
      item: CartItem;
      totalSar: number;
    };

export function buildCartDisplayLines(items: CartItem[]): CartDisplayLine[] {
  const cabinetItem = items.find(
    (item) =>
      item.productSlug === BEAUTY_CABINET_SLUG &&
      item.bundleId === BEAUTY_CABINET_BUNDLE_ID,
  );
  const brushOrganizerItem = items.find(
    (item) =>
      item.productSlug === BRUSH_ORGANIZER_SLUG &&
      item.bundleId === BRUSH_ORGANIZER_ADDON_BUNDLE_ID,
  );
  const hasCompleteMutqanSet = Boolean(cabinetItem && brushOrganizerItem);
  const lines: CartDisplayLine[] = [];

  for (const item of items) {
    if (
      hasCompleteMutqanSet &&
      item.bundleId === BEAUTY_CABINET_BUNDLE_ID &&
      cabinetItem &&
      brushOrganizerItem
    ) {
      lines.push({
        kind: "bundle",
        id: "mutqan-complete-beauty-cabinet-set",
        title: "✨ المجموعة الكاملة من متقن",
        subtitle: "خزانة الجمال + منظم الفرش الدوار الفاخر",
        items: [cabinetItem, brushOrganizerItem],
        totalSar:
          cabinetItem.priceSar * cabinetItem.quantity +
          brushOrganizerItem.priceSar * brushOrganizerItem.quantity,
      });
      continue;
    }

    if (hasCompleteMutqanSet && item.bundleId === BRUSH_ORGANIZER_ADDON_BUNDLE_ID) {
      continue;
    }

    lines.push({
      kind: "item",
      id: item.bundleId,
      item,
      totalSar: item.priceSar * item.quantity,
    });
  }

  return lines;
}
