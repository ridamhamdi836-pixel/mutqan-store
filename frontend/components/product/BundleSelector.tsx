"use client";

import { cn } from "@/lib/utils";
import type { ProductBundle } from "@/types";
import { getBundleLabel } from "@/lib/storefront-labels";
import { formatSavings } from "@/lib/storefront-i18n";
import { useStorefront } from "@/providers/storefront-provider";

interface BundleSelectorProps {
  bundles: ProductBundle[];
  selectedId: string;
  onSelect: (bundle: ProductBundle) => void;
  productSlug?: string;
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

function formatSavingsLabel(
  bundle: ProductBundle,
  savings: { sar: number } | null,
  locale: "ar" | "en",
  market: "SA" | "AE",
): string | null {
  if (bundle.savings_label_ar) {
    return bundle.savings_label_ar
      .replace(/^وفر\s/i, "وفّر ")
      .replace(/^وفّري\s/i, "وفّر ");
  }
  if (savings && savings.sar > 0) {
    return formatSavings(savings.sar, locale, market);
  }
  return null;
}

export function BundleSelector({
  bundles,
  selectedId,
  onSelect,
}: BundleSelectorProps) {
  const { formatMoney, locale, market, t } = useStorefront();
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
    <div className="space-y-3" role="group" aria-label={t("bundleChooseOffer")}>
      <p className="font-bold text-sm md:text-base text-brand-espresso">{t("bundleChooseOfferHeading")}</p>

      <div className="flex flex-col gap-3">
        {sorted.map((bundle) => {
          const isSelected = bundle.id === selectedId;
          const isDefault = bundle.is_default;
          const isBestValue = bestValueBundle?.id === bundle.id;
          const savings = bundleSavings(bundle, unitPrice);
          const savingsLabel = formatSavingsLabel(bundle, savings, locale, market);

          const parts = getBundleLabel(bundle, locale).split(" - ");
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
                "relative w-full flex items-center justify-between rounded-2xl border-2 p-4 md:p-5 text-start max-md:transition-none md:transition-all md:duration-200",
                isSelected
                  ? "border-brand-bronze bg-brand-bronze/5 md:shadow-md md:shadow-brand-bronze/10"
                  : "border-brand-border bg-white hover:border-brand-bronze/30",
              )}
            >
              {isDefault ? (
                <span className="absolute -top-3 end-4 md:end-5 bg-brand-bronze text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold shadow-md whitespace-nowrap z-10">
                  {t("bundleMostPopular")}
                </span>
              ) : null}
              {isBestValue ? (
                <span className="absolute -top-3 end-4 md:end-5 bg-amber-500 text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold shadow-md whitespace-nowrap z-10">
                  {t("bundleBestValue")}
                </span>
              ) : null}

              <div className="flex items-center gap-3 flex-1 min-w-0 pt-1">
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
                  {formatMoney(bundle.price_sar)}
                </p>
                {bundle.compare_at_price_sar ? (
                  <p className="text-xs text-brand-muted line-through tabular-nums">
                    {formatMoney(bundle.compare_at_price_sar)}
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
