"use client";

import { useState } from "react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES, STORE_IMAGE_FRAME } from "@/lib/image-display";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { getProduct, getFirstOfferBundle } from "@/config/catalog";
import { getProductCardImageSrc } from "@/lib/product-image";

interface CrossSellCardProps {
  productSlug: string;
}

export function CrossSellCard({ productSlug }: CrossSellCardProps) {
  const { addItem, items } = useCart();
  const catalog = getProduct(productSlug);
  const [imgError, setImgError] = useState(false);

  if (!catalog?.crossSell) return null;
  const crossSell = catalog.crossSell;
  const firstOffer = getFirstOfferBundle(catalog);
  const displayPriceSar = firstOffer.price_sar;

  const alreadyInCart = items.some((i) => i.productSlug === productSlug);

  const handleAdd = () => {
    if (alreadyInCart) return;
    addItem({
      productSlug,
      productNameAr: catalog.name_ar,
      bundleId: firstOffer.id,
      bundleLabelAr: firstOffer.label_ar,
      quantity: 1,
      priceSar: displayPriceSar,
      itemType: "cross_sell",
    });
  };

  const productImageSrc = getProductCardImageSrc(productSlug);

  return (
    <div className="rounded-[22px] border border-brand-gold/10 bg-white overflow-hidden shadow-sm">
      <div className={cn("relative aspect-[4/3] bg-brand-surface overflow-hidden", STORE_IMAGE_FRAME.cardMinHeight)}>
        {!imgError ? (
          <StoreImage
            src={productImageSrc}
            alt={catalog.name_ar}
            fill
            fit="contain"
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
          <p className="text-sm font-extrabold text-brand-espresso leading-snug">{catalog.name_ar}</p>
          <p className="text-xs text-brand-muted mt-0.5">{crossSell.shortDesc}</p>
          <p className="text-sm font-black text-brand-gold mt-1">
            {displayPriceSar} ر.س
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={alreadyInCart}
          aria-label={`أضف ${catalog.name_ar} للطلب`}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all",
            alreadyInCart
              ? "bg-emerald-50 text-emerald-600 cursor-default"
              : "bg-brand-espresso text-white hover:bg-brand-espresso/90 shadow-sm shadow-brand-espresso/15",
          )}
        >
          {alreadyInCart ? "✓" : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
