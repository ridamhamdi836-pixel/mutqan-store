"use client";

import { useEffect, useCallback } from "react";
import { X, Star, CheckCircle2 } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { ReviewCard } from "@/components/product/ReviewCard";
import { formatSARCompact } from "@/lib/currency";
import type { UpsellProductDetail } from "@/lib/thank-you-product";

type UpsellProductPreviewModalProps = {
  product: UpsellProductDetail;
  isSelected: boolean;
  onClose: () => void;
  onAcceptProduct: () => void;
  onDeclineProduct: () => void;
};

/** Compact centered dialog — does not fill the full screen */
export function UpsellProductPreviewModal({
  product,
  isSelected,
  onClose,
  onAcceptProduct,
  onDeclineProduct,
}: UpsellProductPreviewModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [handleEscape]);

  const previewReviews = product.reviews.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <button
        type="button"
        className="drawer-backdrop"
        aria-label="إغلاق"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upsell-preview-title"
        className="relative z-10 w-full max-w-md max-h-[min(82vh,36rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-brand-border/80"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-brand-border/60 shrink-0 bg-brand-surface">
          <h2
            id="upsell-preview-title"
            className="font-black text-sm md:text-base text-brand-espresso line-clamp-1"
          >
            {product.name_ar}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-beige text-brand-muted"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 px-4 py-3 space-y-4">
          <div className="relative aspect-[4/3] max-h-44 rounded-xl overflow-hidden bg-gray-50">
            <StoreImage
              src={product.image}
              alt={product.name_ar}
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>

          <p className="text-sm font-bold text-brand-bronze leading-relaxed">
            {product.hook_ar}
          </p>
          <p className="text-xs md:text-sm text-brand-muted leading-relaxed line-clamp-3">
            {product.shortPromise}
          </p>

          {product.benefits.length > 0 ? (
            <ul className="space-y-1.5">
              {product.benefits.slice(0, 3).map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-xs md:text-sm text-brand-espresso"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-trust shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex items-center gap-2 flex-wrap rounded-xl bg-brand-beige/50 p-3">
            <span className="font-black text-lg text-brand-espresso">
              {formatSARCompact(product.upsell_price_sar)}
            </span>
            <span className="text-sm text-red-500 line-through">
              {product.original_price_sar} ر.س
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              وفّر {product.savings_percent}%
            </span>
          </div>

          {previewReviews.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-espresso">
                  تجارب عملاء
                </span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {previewReviews.map((review, i) => (
                  <ReviewCard key={`${review.name}-${i}`} {...review} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 p-4 border-t border-brand-border/60 bg-brand-surface space-y-2">
          <button
            type="button"
            onClick={onAcceptProduct}
            className="w-full btn-primary min-h-[48px] flex items-center justify-center gap-2 text-sm font-bold"
          >
            {isSelected ? "مُختار — إغلاق" : "نعم، أريد هذا المنتج"}
          </button>
          <button
            type="button"
            onClick={onDeclineProduct}
            className="w-full btn-secondary min-h-[44px] text-sm font-semibold"
          >
            لا، لا أريد هذا المنتج
          </button>
        </div>
      </div>
    </div>
  );
}
