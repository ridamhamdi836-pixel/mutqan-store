"use client";

import { ArrowRight } from "lucide-react";
import { ProductPageClient } from "@/app/(store)/products/[slug]/ProductPageClient";
import { SinkOrganizerPageClient } from "@/app/(store)/products/[slug]/SinkOrganizerPageClient";
import { getProduct } from "@/config/catalog";
import { PRODUCTS_CONFIG } from "@/config/products";
import { formatSARCompact } from "@/lib/currency";
import type { UpsellProductDetail } from "@/lib/thank-you-product";
import { cn } from "@/lib/utils";

type UpsellProductPagePreviewProps = {
  product: UpsellProductDetail;
  isSelected: boolean;
  onClose: () => void;
  onAcceptProduct: () => void;
  onDeclineProduct: () => void;
};

export function UpsellProductPagePreview({
  product,
  isSelected,
  onClose,
  onAcceptProduct,
  onDeclineProduct,
}: UpsellProductPagePreviewProps) {
  const catalog = getProduct(product.slug);
  const config = PRODUCTS_CONFIG[product.slug];

  if (!catalog || !config) return null;

  return (
    <div className="space-y-3 pt-1">
      <button
        type="button"
        onClick={onClose}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-espresso hover:text-brand-bronze transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        العودة لقائمة العرض
      </button>

      <p className="text-xs text-brand-muted leading-relaxed">
        تفاصيل المنتج داخل عرضك الخاص — ما زلت في نفس خطوة الطلب قبل التأكيد.
      </p>

      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2">
        <span className="text-xs font-bold text-red-800">سعر العرض الخاص:</span>
        <span className="font-black text-lg text-brand-espresso tabular-nums">
          {formatSARCompact(product.upsell_price_sar)}
        </span>
        <span className="text-sm text-red-500 line-through tabular-nums">
          {product.original_price_sar} ر.س
        </span>
        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
          وفّر {product.savings_percent}%
        </span>
      </div>

      <div
        className="rounded-2xl border-2 border-brand-border/80 bg-brand-background overflow-hidden shadow-inner"
        aria-label={`تفاصيل ${product.name_ar}`}
      >
        <div
          className={cn(
            "max-h-[min(70vh,36rem)] md:max-h-[min(72vh,40rem)] overflow-y-auto overscroll-contain",
            "[&_.max-w-content]:max-w-full",
          )}
        >
          {product.slug === "sink-organizer" ? (
            <SinkOrganizerPageClient
              embedMode="upsell-preview"
              product={{
                id: catalog.id,
                slug: catalog.slug,
                name_ar: catalog.name_ar,
                short_description_ar: catalog.short_description_ar,
                category_slug: catalog.category_slug,
                bundles: catalog.bundles,
              }}
            />
          ) : (
            <ProductPageClient
              embedMode="upsell-preview"
              product={{
                id: catalog.id,
                slug: catalog.slug,
                name_ar: catalog.name_ar,
                short_description_ar: catalog.short_description_ar,
                category_slug: catalog.category_slug,
                bundles: catalog.bundles,
              }}
              config={config}
            />
          )}
        </div>
      </div>

      <p className="text-[11px] text-center text-brand-muted">
        مرّر لأسفل داخل الإطار لقراءة المزيد
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onAcceptProduct}
          className={cn(
            "flex-1 btn-primary min-h-[48px] text-sm font-bold",
            isSelected && "opacity-90",
          )}
        >
          {isSelected ? "مُختار — العودة للقائمة" : "نعم، أريد هذا المنتج"}
        </button>
        <button
          type="button"
          onClick={onDeclineProduct}
          className="flex-1 min-h-[48px] rounded-xl border-2 border-brand-border text-brand-muted font-semibold text-sm hover:bg-brand-beige/60 hover:text-brand-espresso transition-colors"
        >
          لا، لا أريد هذا المنتج
        </button>
      </div>
    </div>
  );
}
