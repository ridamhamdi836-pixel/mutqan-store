"use client";

import { useState } from "react";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { getProductCardImageSrc } from "@/lib/product-image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const defaultBundle = product.bundles.find((b) => b.is_default) || product.bundles[0];
  const minBundle = [...product.bundles].sort((a, b) => a.price_sar - b.price_sar)[0];

  const reviewCount =
    1050 + (product.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 950);
  const productImageSrc = getProductCardImageSrc(product.slug);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {!imgError ? (
          <StoreImage
            src={productImageSrc}
            alt={product.name_ar}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-xs text-gray-400 px-2 text-center">
            {product.name_ar}
          </div>
        )}

        {defaultBundle?.is_default && (
          <div className="absolute top-3 start-3">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1B4DDB] text-white text-xs font-bold shadow-md">
              الأكثر طلباً
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-xs font-semibold text-gray-500">
            (+{reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-[17px] leading-snug mb-1.5">
          {product.name_ar}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
          {product.short_description_ar}
        </p>

        {/* Price & CTA */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">يبدأ من</p>
            <div className="flex items-baseline gap-2">
              <p className="font-bold text-gray-900 text-xl">
                {minBundle?.price_sar} ر.س
              </p>
              {defaultBundle?.compare_at_price_sar && (
                <p className="text-sm text-gray-400 line-through">
                  {defaultBundle.compare_at_price_sar} ر.س
                </p>
              )}
            </div>
          </div>
          <span className="inline-flex items-center px-4 py-2.5 rounded-xl bg-[#1B4DDB] text-white text-sm font-bold group-hover:bg-[#1640b8] transition-colors">
            اكتشف المنتج
          </span>
        </div>
      </div>
    </Link>
  );
}
