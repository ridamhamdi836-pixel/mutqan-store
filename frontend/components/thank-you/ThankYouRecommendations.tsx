"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Check, Gift, ShoppingBag, Star, Truck } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { CATALOG } from "@/config/catalog";
import { formatSARCompact } from "@/lib/currency";
import { getProductMainImageSrc } from "@/lib/product-image";
import { firePixelEvent, generateEventId } from "@/lib/analytics";

type ThankYouRecommendationsProps = {
  orderNumber: string;
  orderedSlugs: string[];
};

export function ThankYouRecommendations({
  orderNumber,
  orderedSlugs,
}: ThankYouRecommendationsProps) {
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);

  const products = CATALOG.filter(
    (p) => p.upsell && !orderedSlugs.includes(p.slug),
  )
    .slice(0, 3)
    .map((p) => {
      const u = p.upsell!;
      return {
        slug: p.slug,
        name_ar: p.name_ar,
        hook_ar: u.hook_ar,
        image: getProductMainImageSrc(p.slug),
        original_price_sar: u.original_price_sar,
        upsell_price_sar: u.upsell_price_sar,
        savings_percent: Math.round(
          ((u.original_price_sar - u.upsell_price_sar) / u.original_price_sar) *
            100,
        ),
      };
    });

  const toggle = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  if (products.length === 0) {
    return (
      <div className="card p-5 text-center space-y-3">
        <h2 className="font-bold text-brand-espresso">اكتشف المزيد من متقن</h2>
        <p className="text-sm text-brand-muted">
          منتجات تنظيم وعناية بالمنزل — شحن مجاني ودفع عند الاستلام.
        </p>
        <Link href="/collections" className="btn-primary inline-flex px-6 py-3 text-sm">
          تصفّح المتجر
        </Link>
      </div>
    );
  }

  const handleAdd = async () => {
    if (selectedSlugs.size === 0) return;
    setAdding(true);
    const addedItems = products
      .filter((p) => selectedSlugs.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        name_ar: p.name_ar,
        price_sar: p.upsell_price_sar,
      }));

    try {
      await fetch("/api/orders/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber, items: addedItems }),
      });
      firePixelEvent({
        eventId: generateEventId("post_purchase_upsell_accepted"),
        eventName: "post_purchase_upsell_accepted",
        orderNumber,
        value: addedItems.reduce((s, i) => s + i.price_sar, 0),
        currency: "SAR",
      });
    } catch {
      /* silent */
    }
    setDone(true);
    setAdding(false);
  };

  if (done) {
    return (
      <div className="card p-5 text-center bg-green-50 border-green-200">
        <p className="font-bold text-green-800">تمت إضافة المنتجات لطلبك</p>
        <p className="text-sm text-green-700 mt-1">
          سنؤكدها معك في نفس مكالمة التأكيد — شحنة واحدة وتوصيل مجاني.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-5 text-start space-y-4 border-brand-bronze/30">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-bronze bg-brand-bronze/10 px-2.5 py-1 rounded-pill">
          <Gift className="w-3.5 h-3.5" />
          عرض بعد الطلب
        </span>
        <h2 className="font-black text-lg text-brand-espresso">
          أضِف لنفس الشحنة بسعر خاص
        </h2>
        <p className="text-sm text-brand-muted">
          يُدمج مع طلبك الحالي — نؤكده في مكالمة التأكيد، بدون طلب جديد.
        </p>
      </div>

      <div className="space-y-3">
        {products.map((product) => {
          const isSelected = selectedSlugs.has(product.slug);
          return (
            <button
              key={product.slug}
              type="button"
              onClick={() => toggle(product.slug)}
              className={`w-full flex items-start gap-3 rounded-xl border-2 p-3 transition-all text-start ${
                isSelected
                  ? "border-brand-trust bg-brand-trust/5"
                  : "border-brand-border hover:border-brand-bronze/40"
              }`}
            >
              <div
                className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-brand-trust border-brand-trust" : "border-brand-muted/40"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-beige flex-shrink-0">
                <StoreImage
                  src={product.image}
                  alt={product.name_ar}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-brand-espresso">
                  {product.name_ar}
                </p>
                <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                  {product.hook_ar}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-black text-brand-espresso">
                    {formatSARCompact(product.upsell_price_sar)}
                  </span>
                  <span className="text-xs text-red-500 line-through">
                    {product.original_price_sar} ر.س
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    -{product.savings_percent}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={adding || selectedSlugs.size === 0}
        className="w-full btn-primary h-12 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingBag className="w-5 h-5" />
        {adding ? "جارٍ الإضافة..." : "أضف المختار لطلبي"}
      </button>

      <div className="flex items-center justify-center gap-3 text-[10px] text-brand-muted">
        <span className="flex items-center gap-1">
          <Truck className="w-3 h-3" />
          نفس الشحنة
        </span>
        <Link href="/collections" className="hover:text-brand-bronze">
          أو تابع التسوق
        </Link>
      </div>
    </div>
  );
}
