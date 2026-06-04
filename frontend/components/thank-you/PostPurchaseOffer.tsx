"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Clock,
  Flame,
  PackageCheck,
  Star,
  Truck,
} from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { formatSARCompact } from "@/lib/currency";
import { useCountdown } from "@/lib/use-countdown";
import {
  listThankYouUpsellProducts,
  type UpsellProductDetail,
} from "@/lib/thank-you-product";
import {
  appendUpsellToLastOrderSession,
  buildOrderMergeContext,
  loadLastOrderSession,
  markUpsellOfferCompleted,
  type LastOrderLineItem,
} from "@/lib/last-order-session";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { UpsellProductPagePreview } from "@/components/thank-you/UpsellProductPagePreview";
import { cn } from "@/lib/utils";

const UPSELL_OFFER_SECONDS = 9 * 60 + 59;

type PostPurchaseOfferProps = {
  orderNumber: string;
  orderedSlugs: string[];
  onFinished: (totalSar: number) => void;
};

export function PostPurchaseOffer({
  orderNumber,
  orderedSlugs,
  onFinished,
}: PostPurchaseOfferProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localOrderedSlugs, setLocalOrderedSlugs] = useState(orderedSlugs);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const previewSlug = searchParams?.get("preview") ?? null;
  const offerCountdown = useCountdown(UPSELL_OFFER_SECONDS);
  const products = listThankYouUpsellProducts(localOrderedSlugs);
  const previewProduct = useMemo(
    () =>
      previewSlug != null
        ? products.find((p) => p.slug === previewSlug) ?? null
        : null,
    [previewSlug, products],
  );

  const setPreviewSlug = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (slug) params.set("preview", slug);
      else params.delete("preview");
      const qs = params.toString();
      router.push(qs ? `/order-offer?${qs}` : "/order-offer", { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_viewed"),
      eventName: "post_purchase_upsell_viewed",
      orderNumber,
    });
  }, [orderNumber]);

  const toggle = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const goToThankYou = useCallback(
    (totalSar?: number) => {
      markUpsellOfferCompleted();
      const session = loadLastOrderSession();
      onFinished(totalSar ?? session?.totalSar ?? 0);
    },
    [onFinished],
  );

  const mergeSelectedItems = async (): Promise<boolean> => {
    if (selectedSlugs.size === 0) return true;

    const addedProducts = products.filter((p) => selectedSlugs.has(p.slug));
    const addedItems = addedProducts.map((p) => ({
      slug: p.slug,
      name_ar: p.name_ar,
      price_sar: p.upsell_price_sar,
    }));

    const session = loadLastOrderSession();
    if (!session?.items?.length) {
      setError("تعذر دمج الإضافة — لم نجد تفاصيل طلبك. تواصل معنا عبر واتساب.");
      return false;
    }

    const merge_context = buildOrderMergeContext(session);

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
          "تعذر دمج الإضافة مع طلبك. جرّب مرة أخرى أو تابع بدون إضافة.",
      );
      return false;
    }

    const lineItems: LastOrderLineItem[] = addedProducts.map((p) => ({
      productSlug: p.slug,
      productNameAr: `${p.name_ar} (إضافة لنفس الطلب)`,
      bundleLabelAr: "إضافة لنفس الطلب",
      quantity: 1,
      priceSar: p.upsell_price_sar,
    }));

    appendUpsellToLastOrderSession(lineItems);
    setLocalOrderedSlugs([
      ...localOrderedSlugs,
      ...addedProducts.map((p) => p.slug),
    ]);

    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_accepted"),
      eventName: "post_purchase_upsell_accepted",
      orderNumber,
      value: addedItems.reduce((s, i) => s + i.price_sar, 0),
      currency: "SAR",
    });

    return true;
  };

  const handleAcceptOffer = async () => {
    if (selectedSlugs.size === 0) {
      setError("اختر منتجاً واحداً على الأقل، أو اضغط «لا أريد العرض» للمتابعة.");
      return;
    }
    setSubmitting(true);
    setError("");
    const ok = await mergeSelectedItems();
    setSubmitting(false);
    if (ok) {
      const session = loadLastOrderSession();
      goToThankYou(session?.totalSar);
    }
  };

  const handleDeclineOffer = () => {
    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_skipped"),
      eventName: "post_purchase_upsell_skipped",
      orderNumber,
    });
    goToThankYou();
  };

  return (
    <>
      <div
        className={cn(
          "mx-auto space-y-5 pb-36 md:pb-32",
          previewProduct ? "max-w-content w-full" : "max-w-xl",
        )}
      >
        <div className="text-center space-y-2 px-1">
          <div className="inline-flex items-center gap-2 text-brand-trust font-bold text-sm bg-brand-trust/10 px-4 py-2 rounded-pill">
            <PackageCheck className="w-4 h-4" />
            تم حجز طلبك — عرض خاص قبل التأكيد
          </div>
          <p className="text-xs md:text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
            فرصة واحدة لإضافة منتجات لنفس الشحنة بسعر مخفّض قبل صفحة التأكيد.
          </p>
        </div>

        <div className="card p-5 md:p-6 text-start space-y-5 border-2 border-brand-bronze/25 shadow-lg">
          <div className="space-y-3">
            <h1 className="font-black text-xl md:text-2xl text-brand-espresso leading-snug flex items-start gap-2">
              <Flame className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>أضف لنفس الشحنة بسعر خاص</span>
            </h1>
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

          {previewProduct ? (
            <UpsellProductPagePreview
              product={previewProduct}
              isSelected={selectedSlugs.has(previewProduct.slug)}
              onClose={() => setPreviewSlug(null)}
              onAcceptProduct={() => {
                if (!selectedSlugs.has(previewProduct.slug)) {
                  toggle(previewProduct.slug);
                }
                setPreviewSlug(null);
              }}
              onDeclineProduct={() => setPreviewSlug(null)}
            />
          ) : (
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
          )}

          {error ? (
            <p className="text-sm text-red-600 font-medium" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-center gap-2 text-[10px] md:text-xs text-brand-muted pt-1">
            <Truck className="w-3 h-3" />
            <span>نفس الشحنة · طلب واحد</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-brand-border shadow-[0_-8px_28px_rgba(0,0,0,0.08)] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div
          className={cn(
            "mx-auto space-y-2.5",
            previewProduct ? "max-w-content w-full" : "max-w-xl",
          )}
        >
          <button
            type="button"
            onClick={handleAcceptOffer}
            disabled={submitting}
            className="w-full btn-primary min-h-[52px] text-base font-bold disabled:opacity-60"
          >
            {submitting
              ? "جارٍ الدمج مع طلبك..."
              : "نعم، أريد الاستفادة من العرض"}
          </button>
          <button
            type="button"
            onClick={handleDeclineOffer}
            disabled={submitting}
            className="w-full min-h-[48px] rounded-xl border-2 border-brand-border text-brand-muted font-semibold text-sm hover:bg-brand-beige/60 hover:text-brand-espresso transition-colors disabled:opacity-60"
          >
            لا، لا أريد العرض — متابعة لصفحة التأكيد
          </button>
        </div>
      </div>

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
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
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
          <div className="relative w-20 aspect-[4/3] md:w-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-brand-border/50">
            <StoreImage
              src={product.image}
              alt={product.name_ar}
              fill
              sizes={STORE_IMAGE_SIZES.thumbnail}
              className="md:group-hover:scale-[1.02] md:transition-transform md:duration-200"
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
            <span className="text-[10px] text-brand-bronze font-bold block">
              اضغط لمعرفة المزيد والمراجعات
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-brand-muted flex-shrink-0 mt-3 rotate-180 opacity-60 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
}
