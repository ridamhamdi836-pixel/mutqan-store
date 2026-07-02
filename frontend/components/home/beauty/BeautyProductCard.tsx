"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { getProduct, getProductPath } from "@/config/catalog";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type BeautyProductCardProps = {
  product: HomepageBeautyProduct;
  className?: string;
};

const SQUARE_FILL_IMAGE_SLUGS = new Set([
  "vitamin-c-booster",
  "ceramide-booster",
  "pdrn-booster",
]);

export function BeautyProductCard({ product, className }: BeautyProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const catalogProduct = getProduct(product.slug);
  const usesSquareFillImage = SQUARE_FILL_IMAGE_SLUGS.has(product.slug);
  const minPrice =
    product.minPriceSar ??
    (catalogProduct
      ? [...catalogProduct.bundles].sort((a, b) => a.price_sar - b.price_sar)[0]?.price_sar
      : null);

  const reviewCount = getProductReviewDisplayCount(product.slug);
  const cardBg = product.cardBg ?? "#FAF8F5";

  return (
    <Link
      href={getProductPath(product.slug)}
      className={cn(
        "group flex flex-col h-full rounded-2xl bg-white border border-brand-border/30 overflow-hidden",
        "shadow-[0_2px_16px_rgba(47,69,56,0.05)] transition-all duration-300",
        "hover:shadow-[0_12px_40px_rgba(47,69,56,0.1)] hover:-translate-y-0.5",
        className,
      )}
    >
      {/* Image area — إطار ملون رفيع (2mm) حول الصورة */}
      <div className="relative">
        <div
          className={cn(
            "relative border-[2mm] border-solid bg-white",
            usesSquareFillImage ? "aspect-square" : "aspect-[4/5] min-h-[220px]",
          )}
          style={{ borderColor: cardBg }}
        >
          {!imgError ? (
            <StoreImage
              src={product.image}
              alt={product.imageAlt}
              fill
              fit="contain"
              variant="default"
              sizes={STORE_IMAGE_SIZES.card}
              className="p-0 md:group-hover:scale-[1.02] transition-transform duration-500 ease-out"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-brand-gold" />
              </div>
              <p className="text-sm font-semibold text-brand-espresso/70">{product.nameAr}</p>
            </div>
          )}
        </div>

        <div className="absolute top-2.5 end-2.5 z-10">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide text-white shadow-sm"
            style={{ backgroundColor: product.accentColor ?? "#2F4538" }}
          >
            {product.routineLabel ?? product.goalLabel} · متقن
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-extrabold text-brand-forest text-[15px] md:text-[17px] leading-[1.35] mb-1.5 min-h-0 group-hover:text-brand-gold transition-colors">
          {product.nameAr}
        </h3>

        <p className="text-[13px] md:text-sm text-brand-muted leading-[1.7] mb-4 line-clamp-3 flex-1 mt-0">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
            ))}
          </div>
          <span className="text-xs text-brand-muted">
            ({reviewCount.toLocaleString("ar-SA")} تقييم)
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-brand-border/30 mt-auto">
          <div>
            <p className="text-[10px] text-brand-muted font-medium mb-0.5">يبدأ من</p>
            {minPrice != null && (
              <p className="font-extrabold text-brand-forest text-xl tabular-nums">
                {minPrice}{" "}
                <span className="text-sm font-bold text-brand-muted">ر.س</span>
              </p>
            )}
          </div>
          <span
            className="inline-flex items-center justify-center w-11 h-11 rounded-full text-white shadow-md group-hover:scale-105 transition-transform"
            style={{ backgroundColor: product.accentColor ?? "#2F4538" }}
            aria-hidden
          >
            <ArrowLeft className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
