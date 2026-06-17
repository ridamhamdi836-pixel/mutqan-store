"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { getProduct } from "@/config/catalog";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";
import { Star, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type BeautyProductCardProps = {
  product: HomepageBeautyProduct;
  className?: string;
};

const SQUARE_FILL_IMAGE_SLUGS = new Set([
  "beauty-vanity-cabinet",
  "led-makeup-bag",
]);

export function BeautyProductCard({ product, className }: BeautyProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const catalogProduct = getProduct(product.slug);
  const usesSquareFillImage = SQUARE_FILL_IMAGE_SLUGS.has(product.slug);
  const minPrice = catalogProduct
    ? [...catalogProduct.bundles].sort((a, b) => a.price_sar - b.price_sar)[0]?.price_sar
    : null;

  const reviewCount =
    1200 +
    (product.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 800);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group block rounded-[1.25rem] bg-white border border-brand-border/60 overflow-hidden",
        "shadow-[0_2px_12px_rgba(15,23,42,0.04)] card-lift transition-all duration-300",
        "hover:border-brand-gold/30",
        className,
      )}
    >
      <div
        className={cn(
          "relative bg-gradient-to-b from-brand-secondary/40 to-brand-background overflow-hidden",
          usesSquareFillImage
            ? "aspect-square min-h-[260px] sm:min-h-[300px]"
            : "aspect-[4/5] min-h-[220px] sm:min-h-[260px]",
        )}
      >
        {!imgError ? (
          <StoreImage
            src={product.image}
            alt={product.imageAlt}
            fill
            fit="contain"
            variant="default"
            sizes={STORE_IMAGE_SIZES.card}
            className={cn(
              usesSquareFillImage ? "p-0" : "p-6",
              "md:group-hover:scale-[1.03] transition-transform duration-500 ease-out",
            )}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-brand-gold" />
            </div>
            <p className="text-sm font-semibold text-brand-espresso/70 leading-relaxed max-w-[12rem]">
              {product.nameAr}
            </p>
          </div>
        )}

        <div className="absolute top-4 start-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso text-white text-[11px] font-bold tracking-wide shadow-md">
            الأكثر حباً
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            ))}
          </div>
          <span className="text-xs font-medium text-brand-muted">
            (+{reviewCount.toLocaleString("ar-SA")})
          </span>
        </div>

        <h3 className="font-bold text-brand-espresso text-lg md:text-xl leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
          {product.nameAr}
        </h3>

        <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5 line-clamp-2">
          {product.subtitle}
        </p>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-brand-border/50">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-muted mb-1 font-medium">
              يبدأ من
            </p>
            {minPrice != null && (
              <p className="font-extrabold text-brand-espresso text-2xl tracking-tight">
                {minPrice}{" "}
                <span className="text-sm font-bold text-brand-muted">ر.س</span>
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-espresso text-white text-sm font-bold shadow-btn group-hover:bg-[#1a2744] transition-colors">
            <span>اكتشفي</span>
            <ArrowLeft className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
