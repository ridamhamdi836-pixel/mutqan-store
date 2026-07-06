"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Check,
  Clock,
  Flame,
  PackageCheck,
  Truck,
} from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { useStorefront } from "@/providers/storefront-provider";
import { useCountdown } from "@/lib/use-countdown";
import { getStorefrontProductNameAr } from "@/lib/storefront-product-names";
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
  const [localOrderedSlugs, setLocalOrderedSlugs] = useState(orderedSlugs);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const offerCountdown = useCountdown(UPSELL_OFFER_SECONDS);
  const products = listThankYouUpsellProducts(localOrderedSlugs);

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
      name_ar: getStorefrontProductNameAr(p.slug),
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
      productNameAr: `${getStorefrontProductNameAr(p.slug)} (إضافة لنفس الطلب)`,
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
      <div className="mx-auto max-w-xl space-y-5 pb-36 md:pb-32">
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

          <div className="space-y-3">
            {products.map((product) => (
              <UpsellProductRow
                key={product.slug}
                product={product}
                isSelected={selectedSlugs.has(product.slug)}
                onToggle={() => toggle(product.slug)}
              />
            ))}
          </div>

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
        <div className="mx-auto max-w-xl space-y-2.5">
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
}: {
  product: UpsellProductDetail;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const { formatMoney } = useStorefront();
  const productNameAr = getStorefrontProductNameAr(product.slug);
  const benefitLine = product.benefits.slice(0, 2).join(" · ");

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      aria-label={isSelected ? `إلغاء اختيار ${productNameAr}` : `اختيار ${productNameAr}`}
      className={cn(
        "w-full rounded-2xl border-2 bg-white p-3 text-start shadow-sm transition-all",
        isSelected
          ? "border-brand-gold bg-brand-gold/5 shadow-md shadow-brand-gold/10"
          : "border-brand-border hover:border-brand-gold/45 hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            isSelected
              ? "bg-brand-gold border-brand-gold"
              : "border-brand-muted/40",
          )}
        >
          {isSelected ? <Check className="w-3 h-3 text-white" strokeWidth={3} /> : null}
        </span>

        <div className="relative w-[4.5rem] h-[4.5rem] rounded-xl overflow-hidden bg-brand-surface flex-shrink-0 border border-brand-gold/15">
          <StoreImage
            src={product.image}
            alt={productNameAr}
            width={72}
            height={72}
            sizes={STORE_IMAGE_SIZES.thumbnail}
            className="w-full h-full object-contain p-1"
          />
          {product.isBestseller ? (
            <span className="absolute top-1 start-1 text-[8px] font-bold bg-brand-gold text-white px-1 py-px rounded-full">
              الأكثر مبيعاً
            </span>
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-[13px] md:text-sm text-brand-espresso leading-snug line-clamp-2">
            {productNameAr}
          </p>
          <p className="text-[11px] text-brand-muted leading-snug line-clamp-1 mt-0.5">
            {product.short_description_ar}
          </p>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5">
            <span className="font-black text-base text-brand-espresso tabular-nums">
              {formatMoney(product.upsell_price_sar)}
            </span>
            <span className="text-[11px] text-red-500 line-through tabular-nums">
              {formatMoney(product.original_price_sar)}
            </span>
            <span className="text-[10px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded">
              وفّر {product.savings_percent}%
            </span>
          </div>
          {benefitLine ? (
            <p className="text-[10px] text-brand-forest/80 mt-1 line-clamp-1">{benefitLine}</p>
          ) : null}
        </div>
      </div>
    </button>
  );
}
