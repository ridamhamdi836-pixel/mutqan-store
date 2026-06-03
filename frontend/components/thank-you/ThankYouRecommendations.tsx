"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Clock,
  Flame,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { formatSARCompact } from "@/lib/currency";
import { useCountdown } from "@/lib/use-countdown";
import {
  listThankYouUpsellProducts,
  type UpsellProductDetail,
} from "@/lib/thank-you-product";
import {
  appendUpsellToLastOrderSession,
  loadLastOrderSession,
  type LastOrderLineItem,
} from "@/lib/last-order-session";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { UpsellProductPreviewModal } from "@/components/thank-you/UpsellProductPreviewModal";
import { cn } from "@/lib/utils";

const UPSELL_OFFER_SECONDS = 9 * 60 + 59;

type ThankYouRecommendationsProps = {
  orderNumber: string;
  orderedSlugs: string[];
  onOrderUpdated?: (payload: {
    items: LastOrderLineItem[];
    totalSar: number;
    orderedSlugs: string[];
  }) => void;
};

export function ThankYouRecommendations({
  orderNumber,
  orderedSlugs,
  onOrderUpdated,
}: ThankYouRecommendationsProps) {
  const [localOrderedSlugs, setLocalOrderedSlugs] = useState(orderedSlugs);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const offerCountdown = useCountdown(UPSELL_OFFER_SECONDS);

  const products = listThankYouUpsellProducts(localOrderedSlugs);
  const previewProduct =
    previewSlug != null
      ? products.find((p) => p.slug === previewSlug) ?? null
      : null;

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedSlugs.has(p.slug)),
    [products, selectedSlugs],
  );

  const selectedTotal = useMemo(
    () => selectedProducts.reduce((s, p) => s + p.upsell_price_sar, 0),
    [selectedProducts],
  );

  const stickyLabel = useMemo(() => {
    if (selectedProducts.length === 0) return "";
    if (selectedProducts.length === 1) return selectedProducts[0].name_ar;
    return `${selectedProducts.length} منتجات مختارة`;
  }, [selectedProducts]);

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
      <div className="card p-5 md:p-6 text-center space-y-3">
        <h2 className="font-bold text-brand-espresso">اكتشف المزيد من متقن</h2>
        <p className="text-sm text-brand-muted">
          منتجات تنظيم وعناية بالمنزل — شحن مجاني ودفع عند الاستلام.
        </p>
        <Link
          href="/collections"
          className="btn-primary inline-flex px-6 py-3.5 text-sm min-h-[48px] items-center"
        >
          تصفّح المتجر
        </Link>
      </div>
    );
  }

  const handleAdd = async () => {
    if (selectedSlugs.size === 0) return;
    setAdding(true);
    setError("");

    const addedProducts = products.filter((p) => selectedSlugs.has(p.slug));
    const addedItems = addedProducts.map((p) => ({
      slug: p.slug,
      name_ar: p.name_ar,
      price_sar: p.upsell_price_sar,
    }));

    const session = loadLastOrderSession();
    const merge_context =
      session?.customerName && session.phoneE164
        ? {
            customer_name: session.customerName,
            phone_e164: session.phoneE164,
            existing_items: session.items.map((i) => ({
              product_slug: i.productSlug,
              name_ar: i.productNameAr,
              quantity: i.quantity,
            })),
            total_sar: session.totalSar,
          }
        : undefined;

    try {
      const res = await fetch("/api/orders/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_number: orderNumber,
          items: addedItems,
          merge_context,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data?.error?.message_ar ||
            "تعذر دمج الإضافة مع طلبك. جرّب مرة أخرى أو تواصل معنا.",
        );
        setAdding(false);
        return;
      }

      const lineItems: LastOrderLineItem[] = addedProducts.map((p) => ({
        productSlug: p.slug,
        productNameAr: p.name_ar,
        bundleLabelAr: "إضافة لنفس الطلب",
        quantity: 1,
        priceSar: p.upsell_price_sar,
      }));

      const updated = appendUpsellToLastOrderSession(lineItems);
      const nextSlugs = [
        ...localOrderedSlugs,
        ...addedProducts.map((p) => p.slug),
      ];
      setLocalOrderedSlugs(nextSlugs);

      if (updated && onOrderUpdated) {
        onOrderUpdated({
          items: updated.items,
          totalSar: data.total_sar ?? updated.totalSar,
          orderedSlugs: nextSlugs,
        });
      }

      firePixelEvent({
        eventId: generateEventId("post_purchase_upsell_accepted"),
        eventName: "post_purchase_upsell_accepted",
        orderNumber,
        value: addedItems.reduce((s, i) => s + i.price_sar, 0),
        currency: "SAR",
      });

      setDone(true);
    } catch {
      setError("تعذر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.");
    }
    setAdding(false);
  };

  if (done) {
    return (
      <div className="card p-5 md:p-6 text-center bg-green-50 border-green-200">
        <p className="font-bold text-green-800">تمت إضافة المنتجات لطلبك</p>
        <p className="text-sm text-green-700 mt-1">
          دُمجت مع نفس رقم الطلب — سنؤكدها في مكالمة التأكيد، شحنة واحدة.
        </p>
      </div>
    );
  }

  const hasSelection = selectedSlugs.size > 0;

  return (
    <>
      <div
        className={cn(
          "card p-5 md:p-6 text-start space-y-5 border-2 border-brand-bronze/25 shadow-lg",
          hasSelection && "mb-20 md:mb-0",
        )}
      >
        <div className="space-y-3">
          <h2 className="font-black text-xl md:text-2xl text-brand-espresso leading-snug flex items-start gap-2">
            <Flame className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <span>أضف لنفس الشحنة بسعر خاص</span>
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            يُدمج مع طلبك الحالي ويُؤكد في مكالمة التأكيد دون إنشاء طلب جديد.
          </p>

          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 text-red-800">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs md:text-sm font-bold">
                العرض الخاص ينتهي خلال:
              </span>
            </div>
            <span className="text-2xl font-black tabular-nums text-red-600">
              {offerCountdown.isExpired ? "00:00" : offerCountdown.formatted}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <UpsellProductRow
              key={product.slug}
              product={product}
              isSelected={selectedSlugs.has(product.slug)}
              onToggle={() => toggle(product.slug)}
              onOpenPreview={() => setPreviewSlug(product.slug)}
            />
          ))}
        </div>

        {error ? (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        ) : null}

        <button
          type="button"
          onClick={handleAdd}
          disabled={adding || selectedSlugs.size === 0}
          className="w-full btn-primary min-h-[52px] flex items-center justify-center gap-2 disabled:opacity-50 text-base font-bold md:hidden"
        >
          <ShoppingBag className="w-5 h-5" />
          {adding ? "جارٍ الدمج مع طلبك..." : "أضف المختار لطلبي"}
        </button>

        <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs text-brand-muted pt-1">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3" />
            نفس الشحنة · طلب واحد
          </span>
          <Link href="/collections" className="hover:text-brand-bronze font-semibold">
            أو تابع التسوق
          </Link>
        </div>
      </div>

      {hasSelection ? (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-brand-surface border-t border-brand-border shadow-[0_-8px_24px_rgba(0,0,0,0.1)] p-3 md:pb-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="max-w-xl mx-auto flex items-center gap-3">
            <div className="flex-1 min-w-0 text-start">
              <p className="font-bold text-sm text-brand-espresso truncate">
                {stickyLabel}
              </p>
              <p className="text-xs text-brand-muted">
                {formatSARCompact(selectedTotal)} · يُدمج مع طلبك
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              className="btn-primary shrink-0 min-h-[48px] px-5 py-3 text-sm font-bold flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {adding ? "جارٍ..." : "أضف المنتج إلى طلبي"}
            </button>
          </div>
        </div>
      ) : null}

      {previewProduct ? (
        <UpsellProductPreviewModal
          product={previewProduct}
          isSelected={selectedSlugs.has(previewProduct.slug)}
          onClose={() => setPreviewSlug(null)}
          onToggleSelect={() => toggle(previewProduct.slug)}
        />
      ) : null}
    </>
  );
}

function UpsellProductRow({
  product,
  isSelected,
  onToggle,
  onOpenPreview,
}: {
  product: UpsellProductDetail;
  isSelected: boolean;
  onToggle: () => void;
  onOpenPreview: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-3 md:p-4 transition-colors",
        isSelected
          ? "border-brand-trust bg-brand-trust/5 shadow-sm"
          : "border-brand-border hover:border-brand-bronze/30",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isSelected}
          aria-label={isSelected ? "إلغاء الاختيار" : "اختيار المنتج"}
          className={cn(
            "mt-2 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            isSelected
              ? "bg-brand-trust border-brand-trust"
              : "border-brand-muted/40 hover:border-brand-bronze",
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        <button
          type="button"
          onClick={onOpenPreview}
          className="flex flex-1 items-start gap-3 min-w-0 text-start group"
        >
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0 border border-brand-border/50">
            <StoreImage
              src={product.image}
              alt={product.name_ar}
              fill
              sizes="96px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
            />
            {product.isBestseller ? (
              <span className="absolute top-1 start-1 text-[9px] font-bold bg-brand-bronze text-white px-1.5 py-0.5 rounded shadow-sm">
                الأكثر مبيعاً
              </span>
            ) : null}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="font-bold text-sm md:text-base text-brand-espresso group-hover:text-brand-bronze transition-colors leading-snug">
              {product.name_ar}
            </p>
            <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">
              {product.hook_ar}
            </p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-amber-400 fill-amber-400"
                />
              ))}
              <span className="text-[10px] text-brand-muted mr-1.5">
                (+1,000)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="font-black text-lg text-brand-espresso">
                {formatSARCompact(product.upsell_price_sar)}
              </span>
              <span className="text-sm text-red-500 line-through">
                {product.original_price_sar} ر.س
              </span>
              <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">
                وفّر {product.savings_percent}%
              </span>
            </div>
            <span className="text-[10px] text-brand-bronze font-bold">
              اضغط للتفاصيل والمراجعات
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-brand-muted flex-shrink-0 mt-3 rotate-180 opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
