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

export function BundleSelector({ bundles, selectedId, onSelect }: BundleSelectorProps) {
  const sorted = [...bundles].sort((a, b) => a.sort_order - b.sort_order);
  const unitBundle = sorted.find((b) => b.quantity === 1) ?? sorted[0];
  const unitPrice = unitBundle.price_sar;
  const defaultBundle = sorted.find((b) => b.is_default) ?? sorted[Math.floor(sorted.length / 2)];

  return (
    <div className="space-y-3" role="group" aria-label="اختر العرض">
      <p className="font-bold text-sm md:text-base text-brand-espresso">اختر العرض:</p>

      <div className="flex flex-col gap-2.5 md:gap-3 pt-4">
        {sorted.map((bundle) => {
          const isSelected = bundle.id === selectedId;
          const isFeatured = bundle.id === defaultBundle.id;
          const savings = bundleSavings(bundle, unitPrice);

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
                "relative w-full flex items-center justify-between rounded-2xl border-2 text-start max-md:transition-none md:transition-colors md:duration-150",
                isFeatured ? "p-4 md:p-6 max-md:shadow-none md:shadow-lg" : "p-3.5 md:p-4 max-md:shadow-none",
                isSelected
                  ? "border-brand-bronze bg-brand-bronze/5"
                  : "border-brand-border bg-white md:hover:border-brand-bronze/40",
                isFeatured && !isSelected && "border-brand-bronze/30 bg-brand-bronze/[0.03]",
              )}
            >
              {isFeatured && (
                <span className="absolute -top-3 right-4 md:right-6 bg-brand-bronze text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold shadow-md whitespace-nowrap z-10">
                  الأكثر طلباً
                </span>
              )}

              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "rounded-full border-2 flex items-center justify-center flex-shrink-0 max-md:transition-none md:transition-colors",
                    isFeatured ? "w-7 h-7" : "w-6 h-6",
                    isSelected ? "border-brand-bronze" : "border-brand-muted/40",
                  )}
                >
                  {isSelected && (
                    <div
                      className={cn(
                        "rounded-full bg-brand-bronze",
                        isFeatured ? "w-3.5 h-3.5" : "w-3 h-3",
                      )}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p
                    className={cn(
                      "font-bold leading-snug text-brand-espresso",
                      isFeatured ? "text-base md:text-lg" : "text-sm",
                    )}
                  >
                    {fullLabel}
                  </p>
                  {savings && savings.sar > 0 ? (
                    <p className="text-xs md:text-sm font-bold text-emerald-700">
                      وفّر {savings.sar} ر.س ({savings.percent}%)
                    </p>
                  ) : bundle.savings_label_ar ? (
                    <p className="text-xs md:text-sm font-bold text-emerald-700">
                      {bundle.savings_label_ar}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="text-end flex-shrink-0 ms-2 md:ms-3">
                <p
                  className={cn(
                    "font-black text-brand-espresso tabular-nums",
                    isFeatured ? "text-2xl md:text-3xl" : "text-xl",
                  )}
                >
                  {bundle.price_sar}{" "}
                  <span className="text-sm font-bold">ر.س</span>
                </p>
                {bundle.compare_at_price_sar ? (
                  <p className="text-xs text-red-500 line-through tabular-nums">
                    {bundle.compare_at_price_sar} ر.س
                  </p>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
