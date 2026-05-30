"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";
import type { ProductBundle } from "@/types";

interface BundleSelectorProps {
  bundles: ProductBundle[];
  selectedId: string;
  onSelect: (bundle: ProductBundle) => void;
}

export function BundleSelector({ bundles, selectedId, onSelect }: BundleSelectorProps) {
  const sorted = [...bundles].sort((a, b) => a.sort_order - b.sort_order);
  const lastBundle = sorted[sorted.length - 1];

  return (
    <div className="space-y-4" role="group" aria-label="اختر العرض">
      {/* Urgency bar */}
      <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-amber-700">
        <Clock className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-bold">آخر 48 ساعة على عرض الشحن المجاني هذا الأسبوع</span>
      </div>

      {/* Heading */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-base text-gray-900">اختر العرض:</p>
        {sorted.length > 1 && (
          <span className="text-xs font-bold text-[#1B4DDB] bg-[#1B4DDB]/10 px-3 py-1 rounded-full">
            نتيجة من أول قطعة
          </span>
        )}
      </div>

      {/* Bundles */}
      <div className="flex flex-col gap-3">
        {sorted.map((bundle) => {
          const isSelected = bundle.id === selectedId;
          const isDefault = bundle.is_default;
          const isLast = bundle.id === lastBundle?.id && sorted.length > 2;

          const parts = bundle.label_ar.split(' - ');
          const title = parts[0].trim();
          let subtitle = parts.length > 1 ? parts.slice(1).join(' - ').trim() : "";
          subtitle = subtitle.replace(/\|?\s*الأكثر اختيارًا(\s*للمطبخ|\s*للعائلة والضيوف)?/g, '').trim();

          const fullLabel = subtitle ? `${title} · ${subtitle}` : title;

          return (
            <button
              key={bundle.id}
              type="button"
              onClick={() => onSelect(bundle)}
              aria-pressed={isSelected}
              className={cn(
                "relative w-full flex items-center justify-between rounded-2xl border-2 p-4 md:p-5 transition-all duration-200 text-start",
                isSelected
                  ? "border-[#1B4DDB] bg-[#1B4DDB]/5 shadow-md shadow-[#1B4DDB]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              {/* Badges */}
              {isDefault && (
                <span className="absolute -top-3 right-5 bg-[#1B4DDB] text-white text-[11px] px-4 py-1 rounded-full font-bold whitespace-nowrap shadow-md">
                  الأكثر اختياراً
                </span>
              )}
              {isLast && !isDefault && (
                <span className="absolute -top-3 right-5 bg-amber-500 text-white text-[11px] px-4 py-1 rounded-full font-bold whitespace-nowrap shadow-md">
                  الأكثر توفيراً
                </span>
              )}

              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Radio */}
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  isSelected ? "border-[#1B4DDB]" : "border-gray-300"
                )}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-[#1B4DDB]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-bold text-sm leading-snug",
                    isSelected ? "text-gray-900" : "text-gray-800"
                  )}>
                    {fullLabel}
                  </p>
                  {bundle.savings_label_ar && (
                    <p className="text-xs text-[#1B4DDB] font-bold mt-1">
                      وفّر {bundle.savings_label_ar.replace('وفر ', '').replace('وفّري ', '').replace('وفّر ', '')}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-end flex-shrink-0 ms-3">
                <p className={cn(
                  "font-black text-xl",
                  isSelected ? "text-gray-900" : "text-gray-800"
                )}>
                  {bundle.price_sar} <span className="text-sm font-bold">ر.س</span>
                </p>
                {bundle.compare_at_price_sar && (
                  <p className="text-xs text-gray-400 line-through">
                    {bundle.compare_at_price_sar} ر.س
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
