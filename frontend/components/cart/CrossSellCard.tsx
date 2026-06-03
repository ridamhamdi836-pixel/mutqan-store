"use client";

import { useState } from "react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { Plus } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { getProduct } from "@/config/catalog";
import { getProductCardImageSrc } from "@/lib/product-image";
import { cn } from "@/lib/utils";

interface CrossSellCardProps {
  productSlug: string;
}

export function CrossSellCard({ productSlug }: CrossSellCardProps) {
  const { addItem, items } = useCart();
  const catalog = getProduct(productSlug);
  const [imgError, setImgError] = useState(false);

  if (!catalog?.crossSell) return null;
  const crossSell = catalog.crossSell;

  const defaultBundle = catalog.bundles.find((b) => b.is_default) || catalog.bundles[0];
  const alreadyInCart = items.some((i) => i.productSlug === productSlug);

  const handleAdd = () => {
    if (alreadyInCart) return;
    addItem({
      productSlug,
      productNameAr: catalog.name_ar,
      bundleId: `cross-${productSlug}-1`,
      bundleLabelAr: defaultBundle.label_ar,
      quantity: 1,
      priceSar: crossSell.singleUnitPriceSar,
      itemType: "cross_sell",
    });
  };

  const productImageSrc = getProductCardImageSrc(productSlug);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {!imgError ? (
          <StoreImage
            src={productImageSrc}
            alt={catalog.name_ar}
            fill
            sizes={STORE_IMAGE_SIZES.card}
            variant="thumbnail"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400 px-2 text-center">
            {catalog.name_ar}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 leading-snug">{catalog.name_ar}</p>
          <p className="text-xs text-gray-500 mt-0.5">{crossSell.shortDesc}</p>
          <p className="text-sm font-bold text-[#1B4DDB] mt-1">
            {crossSell.singleUnitPriceSar} ر.س
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={alreadyInCart}
          aria-label={`أضف ${catalog.name_ar} للطلب`}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all",
            alreadyInCart
              ? "bg-[#10B981]/15 text-[#10B981] cursor-default"
              : "bg-[#1B4DDB] text-white hover:bg-[#1640b8]",
          )}
        >
          {alreadyInCart ? "✓" : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
