"use client";

import { cn } from "@/lib/utils";
import type { ProductBundle } from "@/types";

interface BundleSelectorProps {
  bundles: ProductBundle[];
  selectedId: string;
  onSelect: (bundle: ProductBundle) => void;
}

function bundleSavings(
  bundle: ProductBundle,
  unitPrice: number,
): { percent: number; sar: number } | null {
  if (bundle.compare_at_price_sar && bundle.compare_at_price_sar > bundle.price_sar) {
    const sar = bundle.compare_at_price_sar - bundle.price_sar;
    return {
      sar,
      percent: Math.round((sar / bundle.compare_at_price_sar) * 100),
    };
  }
  if (bundle.quantity > 1 && unitPrice > 0) {
    const full = unitPrice * bundle.quantity;
    if (full > bundle.price_sar) {
      const sar = full - bundle.price_sar;
      return { sar, percent: Math.round((sar / full) * 100) };
    }
  }
  return null;
}

function formatSavingsLabel(bundle: ProductBundle, savings: { sar: number } | null): string | null {
  if (bundle.savings_label_ar) {
    return bundle.savings_label_ar
      .replace(/^وفر\s/i, "وفّر ")
      .replace(/^وفّري\s/i, "وفّر ");
  }
  if (savings && savings.sar > 0) {
    return `وفّر ${savings.sar} ر.س`;
  }
  return null;
}

export function BundleSelector({ bundles, selectedId, onSelect }: BundleSelectorProps) {
  const sorted = [...bundles].sort((a, b) => a.sort_order - b.sort_order);
  const unitBundle = sorted.find((b) => b.quantity === 1) ?? sorted[0];
  const unitPrice = unitBundle.price_sar;

  let bestValueBundle: ProductBundle | null = null;
  let bestValueSavings = 0;
  for (const bundle of sorted) {
    if (bundle.is_default) continue;
    const savings = bundleSavings(bundle, unitPrice);
    if (savings && savings.sar > bestValueSavings) {
      bestValueSavings = savings.sar;
      bestValueBundle = bundle;
    }
  }

  return (
    <div className="space-y-3" role="group" aria-label="اختر العرض">
      <p className="font-bold text-sm md:text-base text-brand-espresso">اختر العرض:</p>

      {/* overflow-visible + in-flow badges — absolute badges ghost on mobile scroll */}
      <div className="flex flex-col gap-3 overflow-visible">
        {sorted.map((bundle) => {
          const isSelected = bundle.id === selectedId;
          const isDefault = bundle.is_default;
          const isBestValue = bestValueBundle?.id === bundle.id;
          const savings = bundleSavings(bundle, unitPrice);
          const savingsLabel = formatSavingsLabel(bundle, savings);

          const parts = bundle.label_ar.split(" - ");
          const title = parts[0].trim();
          let subtitle = parts.length > 1 ? parts.slice(1).join(" - ").trim() : "";
          subtitle = subtitle
            .replace(/\|?\s*الأكثر اختيارًا(\s*للمطبخ|\s*للعائلة والضيوف)?/g, "")
            .trim();
          const fullLabel = subtitle ? `${title} · ${subtitle}` : title;

          return (
            <button
              key={bundle.id}
              type="button"
              onClick={() => onSelect(bundle)}
              aria-pressed={isSelected}
              className={cn(
                "w-full rounded-2xl border-2 p-4 md:p-5 text-start max-md:transition-none md:transition-colors md:duration-200",
                isSelected
                  ? "border-brand-bronze bg-brand-bronze/5 md:shadow-md md:shadow-brand-bronze/10"
                  : "border-brand-border bg-white hover:border-brand-bronze/30",
              )}
            >
              {isDefault || isBestValue ? (
                <div className="flex flex-wrap justify-end gap-2 mb-2">
                  {isDefault ? (
                    <span className="bg-brand-bronze text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold whitespace-nowrap md:shadow-md">
                      الأكثر اختياراً
                    </span>
                  ) : null}
                  {isBestValue ? (
                    <span className="bg-amber-500 text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold whitespace-nowrap md:shadow-md">
                      الأكثر توفيراً
                    </span>
                  ) : null}
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "border-brand-bronze" : "border-brand-muted/40",
                    )}
                  >
                    {isSelected ? (
                      <div className="w-3 h-3 rounded-full bg-brand-bronze" />
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm md:text-base leading-snug text-brand-espresso">
                      {fullLabel}
                    </p>
                    {savingsLabel ? (
                      <p className="text-xs md:text-sm font-bold text-brand-bronze mt-1">
                        {savingsLabel}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="text-end flex-shrink-0 ms-3">
                  <p className="font-black text-xl md:text-2xl text-brand-espresso tabular-nums">
                    {bundle.price_sar}{" "}
                    <span className="text-sm font-bold">ر.س</span>
                  </p>
                  {bundle.compare_at_price_sar ? (
                    <p className="text-xs text-brand-muted line-through tabular-nums">
                      {bundle.compare_at_price_sar} ر.س
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
