"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { PRODUCTS_CONFIG } from "@/config/products";
import { cn } from "@/lib/utils";
import { getProductImageSrc } from "@/lib/product-image";

// Static product data for cross-sells
const PRODUCT_DATA: Record<string, { nameAr: string; shortDesc: string; defaultBundleId: string; defaultBundleLabel: string; priceSar: number }> = {
  "pull-out-cabinet-drawer": {
    nameAr: "درج الخزانة المنزلق",
    shortDesc: "وصول سهل لأعماق الخزانة",
    defaultBundleId: "cross-pull-out-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 349,
  },
  "magic-under-sink-organizer": {
    nameAr: "منظّم المغسلة السحري",
    shortDesc: "ترتيب ذكي تحت المغسلة",
    defaultBundleId: "cross-sink-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 229,
  },
  "smart-stackable-cabinet": {
    nameAr: "الخزانة التراكمية الذكية",
    shortDesc: "مساحة تخزين إضافية وأنيقة",
    defaultBundleId: "cross-cabinet-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 349,
  },
  "pure-faucet-filter": {
    nameAr: "فلتر الصنبور النقي",
    shortDesc: "تجربة ماء يومية أفضل",
    defaultBundleId: "cross-filter-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 199,
  },
  "smart-table-warmer": {
    nameAr: "سخّان المائدة الذكي",
    shortDesc: "طعام دافئ طوال الجلسة",
    defaultBundleId: "cross-warmer-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 249,
  },
  "thermal-lunch-box": {
    nameAr: "حافظة الغداء الحرارية",
    shortDesc: "وجبة دافئة أينما كنت",
    defaultBundleId: "cross-lunch-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 229,
  },
  "powerful-cordless-vacuum": {
    nameAr: "المكنسة اللاسلكية القوية",
    shortDesc: "تنظيف سريع للمنزل والسيارة",
    defaultBundleId: "cross-vacuum-1",
    defaultBundleLabel: "قطعة واحدة",
    priceSar: 229,
  },
};

interface CrossSellCardProps {
  productSlug: string;
}

export function CrossSellCard({ productSlug }: CrossSellCardProps) {
  const { addItem, items } = useCart();
  const product = PRODUCT_DATA[productSlug];
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const alreadyInCart = items.some((i) => i.productSlug === productSlug);

  const handleAdd = () => {
    if (alreadyInCart) return;
    addItem({
      productSlug,
      productNameAr: product.nameAr,
      bundleId: product.defaultBundleId,
      bundleLabelAr: product.defaultBundleLabel,
      quantity: 1,
      priceSar: product.priceSar,
      itemType: "cross_sell",
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-card border border-brand-border bg-brand-background">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0">
        <Image
          src={getProductImageSrc(productSlug)}
          alt={product.nameAr}
          fill
          unoptimized
          className="object-cover"
          onError={() => { if (!imgError) setImgError(true); }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-brand-espresso leading-snug">{product.nameAr}</p>
        <p className="text-xs text-brand-muted">{product.shortDesc}</p>
        <p className="text-xs font-bold text-brand-espresso mt-1">{product.priceSar} ر.س</p>
      </div>

      <button
        onClick={handleAdd}
        disabled={alreadyInCart}
        aria-label={`أضف ${product.nameAr} للطلب`}
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all",
          alreadyInCart
            ? "bg-brand-trust/20 text-brand-trust cursor-default"
            : "bg-brand-espresso text-white hover:bg-brand-bronze"
        )}
      >
        {alreadyInCart ? "✓" : <Plus className="w-4 h-4" />}
      </button>
    </div>
  );
}
