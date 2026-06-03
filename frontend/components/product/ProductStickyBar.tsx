"use client";

import { ShoppingBag } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { PRODUCT_PRIMARY_CTA } from "@/lib/product-cta";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";

type ProductStickyBarProps = {
  visible: boolean;
  productNameAr: string;
  imageSrc: string;
  onOrder: () => void;
};

export function ProductStickyBar({
  visible,
  productNameAr,
  imageSrc,
  onOrder,
}: ProductStickyBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-content mx-auto flex items-center gap-2.5">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-beige border border-brand-border shrink-0">
          <StoreImage
            src={imageSrc}
            alt={productNameAr}
            width={48}
            height={48}
            variant="thumbnail"
            sizes={STORE_IMAGE_SIZES.tiny}
            fit="cover"
          />
        </div>
        <button
          type="button"
          onClick={onOrder}
          className="btn-primary flex-1 min-h-[48px] md:min-h-[52px] flex items-center justify-center gap-2 text-sm md:text-base font-bold"
        >
          <ShoppingBag className="w-5 h-5 shrink-0" />
          <span className="truncate">{PRODUCT_PRIMARY_CTA}</span>
        </button>
      </div>
    </div>
  );
}
