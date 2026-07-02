"use client";

import { ArrowRight, Check, Package, Star, Truck } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { formatSARCompact } from "@/lib/currency";
import { getStorefrontProductNameAr } from "@/lib/storefront-product-names";
import type { UpsellProductDetail } from "@/lib/thank-you-product";
import { cn } from "@/lib/utils";

type UpsellProductPagePreviewProps = {
  product: UpsellProductDetail;
  isSelected: boolean;
  onClose: () => void;
  onAcceptProduct: () => void;
  onDeclineProduct: () => void;
};

/** Compact upsell detail — no full product page embed (avoids shipping/PDP duplication). */
export function UpsellProductPagePreview({
  product,
  isSelected,
  onClose,
  onAcceptProduct,
  onDeclineProduct,
}: UpsellProductPagePreviewProps) {
  const productNameAr = getStorefrontProductNameAr(product.slug);

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

      <div className="rounded-2xl border border-brand-border/80 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 bg-brand-forest/5 border-b border-brand-forest/10 px-4 py-3">
          <Truck className="w-4 h-4 text-brand-forest shrink-0" />
          <span className="text-sm font-bold text-brand-forest">لنفس الشحنة بسعر خاص</span>
        </div>

        <div className="p-4 md:p-5 space-y-4">
          <div className="flex gap-3 md:gap-4">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-brand-surface shrink-0 border border-brand-gold/15">
              <StoreImage
                src={product.image}
                alt={productNameAr}
                width={112}
                height={112}
                sizes={STORE_IMAGE_SIZES.thumbnail}
                className="w-full h-full object-contain p-1.5"
              />
            </div>
            <div className="min-w-0 space-y-2">
              <h2 className="font-extrabold text-base md:text-lg text-brand-espresso leading-snug">
                {productNameAr}
              </h2>
              <p className="text-xs md:text-sm text-brand-muted leading-relaxed">{product.hook_ar}</p>
              <div className="flex items-center gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3 py-2.5">
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

          {product.benefits.length > 0 ? (
            <ul className="space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-brand-muted">
                  <Check className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" strokeWidth={3} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {product.shortPromise ? (
            <p className="text-xs text-brand-muted leading-relaxed border-t border-brand-border/20 pt-3">
              {product.shortPromise}
            </p>
          ) : null}

          <div className="flex items-center gap-2 rounded-lg bg-[#F5F0E8] px-3 py-2 text-xs font-semibold text-brand-forest">
            <Package className="w-3.5 h-3.5 shrink-0" />
            يُضاف لنفس شحنتك — بدون طلب جديد
          </div>
        </div>
      </div>

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
