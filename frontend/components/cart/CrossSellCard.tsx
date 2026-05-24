"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { getProduct } from "@/config/catalog";
import { getProductImageSrc } from "@/lib/product-image";
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

  return (
    <div className="flex items-center gap-3 p-3 rounded-card border border-brand-border bg-brand-background">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0">
        <Image
          src={getProductImageSrc(productSlug)}
          alt={catalog.name_ar}
          fill
          unoptimized
          className="object-cover"
          onError={() => {
            if (!imgError) setImgError(true);
          }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-brand-espresso leading-snug">{catalog.name_ar}</p>
        <p className="text-xs text-brand-muted">{crossSell.shortDesc}</p>
        <p className="text-xs font-bold text-brand-espresso mt-1">
          {crossSell.singleUnitPriceSar} ر.س
        </p>
      </div>

      <button
        onClick={handleAdd}
        disabled={alreadyInCart}
        aria-label={`أضف ${catalog.name_ar} للطلب`}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          alreadyInCart
            ? "bg-brand-trust/20 text-brand-trust cursor-default"
            : "bg-brand-espresso text-white hover:bg-brand-bronze",
        )}
      >
        {alreadyInCart ? "✓" : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
