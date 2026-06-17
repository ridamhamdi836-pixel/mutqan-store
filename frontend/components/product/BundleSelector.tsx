"use client";

import { Check, Gem, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductBundle } from "@/types";

interface BundleSelectorProps {
  bundles: ProductBundle[];
  selectedId: string;
  onSelect: (bundle: ProductBundle) => void;
  productSlug?: string;
}

type LuxuryPricingCopy = {
  originalPrice: number;
  mainIncludes: string[];
  valueNote: string;
};

const LUXURY_BEAUTY_PRICING: Record<string, LuxuryPricingCopy> = {
  "beauty-vanity-cabinet": {
    originalPrice: 299,
    mainIncludes: [
      "تصميم فاخر مقاوم للغبار",
      "تنظيم أنيق لمستحضرات التجميل",
      "الدفع عند الاستلام",
    ],
    valueNote: "مثالية لك ولشخص تحبينه.",
  },
  "led-makeup-bag": {
    originalPrice: 349,
    mainIncludes: [
      "مرآة بإضاءة LED",
      "تقسيمات داخلية قابلة للتعديل",
      "مثالية للسفر والاستخدام اليومي",
    ],
    valueNote: "وفري أكثر عند طلب قطعتين.",
  },
  "makeup-brush-cleaner": {
    originalPrice: 329,
    mainIncludes: [
      "تنظيف وتجفيف سريع",
      "يحافظ على نعومة الفرش",
      "تشغيل سهل بلمسة واحدة",
    ],
    valueNote: "مثالي للاستخدام الشخصي أو كهدية.",
  },
  "rotating-brush-organizer": {
    originalPrice: 239,
    mainIncludes: [
      "دوران 360°",
      "حماية من الغبار",
      "تنظيم أنيق وسهل الوصول",
    ],
    valueNote: "اختيار رائع لإكمال ركن الجمال.",
  },
};

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

function LuxuryBeautyBundleSelector({
  bundles,
  selectedId,
  onSelect,
  pricing,
}: BundleSelectorProps & { pricing: LuxuryPricingCopy }) {
  const sorted = [...bundles].sort((a, b) => a.sort_order - b.sort_order).slice(0, 2);
  const mainBundle = sorted[0];
  const valueBundle = sorted[1];

  if (!mainBundle) return null;

  return (
    <div className="space-y-5" role="group" aria-label="اختاري عرضك">
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => onSelect(mainBundle)}
          aria-pressed={mainBundle.id === selectedId}
          className={cn(
            "group relative w-full overflow-hidden rounded-[2rem] border bg-white text-start",
            "p-6 md:p-7 shadow-[0_14px_44px_rgba(15,23,42,0.07)] transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_22px_64px_rgba(15,23,42,0.10)]",
            mainBundle.id === selectedId
              ? "border-brand-gold/70 ring-2 ring-brand-gold/15"
              : "border-brand-gold/20 hover:border-brand-gold/45",
          )}
        >
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#07152F] px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                الأكثر طلباً
              </span>
              <p className="mt-3 text-sm font-semibold text-brand-muted">
                العرض الرئيسي
              </p>
            </div>

            <div className="text-end">
              <p className="text-sm text-brand-muted line-through tabular-nums">
                {pricing.originalPrice} ر.س
              </p>
              <p className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-[#07152F] tabular-nums">
                {mainBundle.price_sar}
                <span className="me-1 text-base md:text-lg font-bold text-brand-muted">
                  ر.س
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl bg-[#FAF8F6] p-4 md:p-5">
            <p className="text-sm font-bold text-[#07152F]">يشمل:</p>
            <ul className="space-y-2.5">
              {pricing.mainIncludes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm font-medium leading-relaxed text-[#07152F]/80"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <span
              className={cn(
                "h-5 w-5 rounded-full border-2",
                mainBundle.id === selectedId
                  ? "border-brand-gold bg-brand-gold shadow-[inset_0_0_0_4px_white]"
                  : "border-brand-border bg-white",
              )}
              aria-hidden
            />
            <span className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand-gold px-8 text-sm md:text-base font-extrabold text-[#07152F] shadow-[0_10px_26px_rgba(212,175,55,0.25)] transition-colors group-hover:bg-[#C9A227]">
              اطلب الآن
            </span>
          </div>
        </button>

        {valueBundle ? (
          <button
            type="button"
            onClick={() => onSelect(valueBundle)}
            aria-pressed={valueBundle.id === selectedId}
            className={cn(
              "relative w-full rounded-[1.75rem] border bg-white p-5 md:p-6 text-start",
              "shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-all duration-300",
              "hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
              valueBundle.id === selectedId
                ? "border-brand-gold/70 ring-2 ring-brand-gold/10"
                : "border-brand-border hover:border-brand-gold/35",
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/10 px-3.5 py-1 text-xs font-extrabold text-[#8A6A12]">
                  <Gem className="h-3.5 w-3.5" />
                  وفر أكثر
                </span>
                <p className="mt-3 text-lg md:text-xl font-extrabold text-[#07152F]">
                  قطعتان بـ {valueBundle.price_sar} ر.س
                </p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-brand-muted">
                  {pricing.valueNote}
                </p>
              </div>

              <span
                className={cn(
                  "h-5 w-5 shrink-0 rounded-full border-2",
                  valueBundle.id === selectedId
                    ? "border-brand-gold bg-brand-gold shadow-[inset_0_0_0_4px_white]"
                    : "border-brand-border bg-white",
                )}
                aria-hidden
              />
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function BundleSelector({
  bundles,
  selectedId,
  onSelect,
  productSlug,
}: BundleSelectorProps) {
  const luxuryPricing = productSlug ? LUXURY_BEAUTY_PRICING[productSlug] : undefined;

  if (luxuryPricing) {
    return (
      <LuxuryBeautyBundleSelector
        bundles={bundles}
        selectedId={selectedId}
        onSelect={onSelect}
        productSlug={productSlug}
        pricing={luxuryPricing}
      />
    );
  }

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

      <div className="flex flex-col gap-3">
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
                "relative w-full flex items-center justify-between rounded-2xl border-2 p-4 md:p-5 text-start max-md:transition-none md:transition-all md:duration-200",
                isSelected
                  ? "border-brand-bronze bg-brand-bronze/5 md:shadow-md md:shadow-brand-bronze/10"
                  : "border-brand-border bg-white hover:border-brand-bronze/30",
              )}
            >
              {isDefault ? (
                <span className="absolute -top-3 end-4 md:end-5 bg-brand-bronze text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold shadow-md whitespace-nowrap z-10">
                  الأكثر اختياراً
                </span>
              ) : null}
              {isBestValue ? (
                <span className="absolute -top-3 end-4 md:end-5 bg-amber-500 text-white text-[10px] md:text-[11px] px-3 md:px-4 py-1 rounded-full font-bold shadow-md whitespace-nowrap z-10">
                  الأكثر توفيراً
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
                  {bundle.price_sar}{" "}
                  <span className="text-sm font-bold">ر.س</span>
                </p>
                {bundle.compare_at_price_sar ? (
                  <p className="text-xs text-brand-muted line-through tabular-nums">
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
