"use client";

import { useEffect, useCallback } from "react";
import { X, Star, CheckCircle2, ShoppingBag } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { ReviewCard } from "@/components/product/ReviewCard";
import { formatSARCompact } from "@/lib/currency";
import type { UpsellProductDetail } from "@/lib/thank-you-product";

type UpsellProductPreviewModalProps = {
  product: UpsellProductDetail;
  isSelected: boolean;
  onClose: () => void;
  onToggleSelect: () => void;
};

export function UpsellProductPreviewModal({
  product,
  isSelected,
  onClose,
  onToggleSelect,
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
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
        className="relative z-10 w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-brand-border/60 shrink-0">
          <h2
            id="upsell-preview-title"
            className="font-black text-base text-brand-espresso line-clamp-1"
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

        <div className="overflow-y-auto overscroll-contain flex-1 px-4 py-4 space-y-5">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-brand-beige">
            <StoreImage
              src={product.image}
              alt={product.name_ar}
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover"
            />
          </div>

          <p className="text-sm font-bold text-brand-bronze leading-relaxed">
            {product.hook_ar}
          </p>
          <p className="text-sm text-brand-muted leading-relaxed">
            {product.shortPromise}
          </p>

          {product.benefits.length > 0 ? (
            <ul className="space-y-2">
              {product.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-brand-espresso"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-trust shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-xl text-brand-espresso">
              {formatSARCompact(product.upsell_price_sar)}
            </span>
            <span className="text-sm text-red-500 line-through">
              {product.original_price_sar} ر.س
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              -{product.savings_percent}%
            </span>
            <span className="text-xs text-brand-muted w-full">
              يُضاف لنفس طلبك — شحنة واحدة
            </span>
          </div>

          {product.reviews.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h3 className="font-bold text-sm text-brand-espresso">
                  تجارب عملاء طلبوا هذا المنتج
                </h3>
              </div>
              <div className="space-y-4">
                {product.reviews.map((review, i) => (
                  <ReviewCard key={`${review.name}-${i}`} {...review} />
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 p-4 border-t border-brand-border/60 bg-brand-surface space-y-2">
          <button
            type="button"
            onClick={() => {
              if (!isSelected) onToggleSelect();
              onClose();
            }}
            className="w-full btn-primary h-12 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            {isSelected ? "مُختار — أغلق" : "اختر وأضفه لطلبي"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm text-brand-muted hover:text-brand-espresso py-1"
          >
            العودة للقائمة
          </button>
        </div>
      </div>
    </div>
  );
}
