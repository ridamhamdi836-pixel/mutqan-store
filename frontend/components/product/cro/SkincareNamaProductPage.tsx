"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Star,
  Check,
  X,
  ArrowUp,
  Flame,
  Sparkles,
  FlaskConical,
  Quote,
  Stethoscope,
  Heart,
  Phone,
  Package,
  Banknote,
  MapPin,
  ChevronLeft,
  Truck,
} from "lucide-react";
import { CroProductMedia } from "@/components/product/cro/CroProductMedia";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { StoreImage } from "@/components/ui/StoreImage";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { PRODUCT_COD_FAQS } from "@/lib/product-cod-faqs";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
import { getFirstOfferBundleFromBundles } from "@/config/catalog";
import { getStorefrontProductNameAr } from "@/lib/storefront-product-names";
import { getProductMainImageSrc } from "@/lib/product-image";
import { getHomepageProductImageAlt } from "@/lib/storefront-product-image";
import { cn } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import type { ProductBundle } from "@/types";
import type { ProductPageConfig } from "@/config/products";
import type { SkincareNamaPageConfig } from "@/types/skincare-nama-page";

type SkincareNamaProductPageProps = {
  embedMode?: "store" | "upsell-preview";
  product: {
    id: string;
    slug: string;
    name_ar: string;
    short_description_ar: string;
    category_slug: string;
    bundles: ProductBundle[];
  };
  productConfig: ProductPageConfig;
  namaConfig: SkincareNamaPageConfig;
};

const CREAM_SECTION = "bg-[#F5F0E8]";

function NamaBundleCards({
  bundles,
  selectedId,
  onSelect,
}: {
  bundles: ProductBundle[];
  selectedId: string;
  onSelect: (b: ProductBundle) => void;
}) {
  const sorted = [...bundles].sort((a, b) => a.sort_order - b.sort_order);
  const unitPrice = sorted.find((b) => b.quantity === 1)?.price_sar ?? sorted[0].price_sar;

  let bestValueBundle: ProductBundle | null = null;
  let bestValueSavings = 0;
  for (const bundle of sorted) {
    if (bundle.is_default) continue;
    const full = unitPrice * bundle.quantity;
    const savings =
      bundle.compare_at_price_sar && bundle.compare_at_price_sar > bundle.price_sar
        ? bundle.compare_at_price_sar - bundle.price_sar
        : bundle.quantity > 1 && full > bundle.price_sar
          ? full - bundle.price_sar
          : 0;
    if (savings > bestValueSavings) {
      bestValueSavings = savings;
      bestValueBundle = bundle;
    }
  }

  return (
    <div className="space-y-4" role="group" aria-label="اختر العرض">
      <div className="flex items-center justify-between gap-3">
        <p className="font-extrabold text-base md:text-lg text-brand-forest">اختاري العرض:</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-forest/10 text-brand-forest text-[10px] md:text-xs font-bold px-3 py-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          نتيجة من العبوة الأولى
        </span>
      </div>

      {sorted.map((bundle) => {
        const isSelected = bundle.id === selectedId;
        const isDefault = bundle.is_default;
        const isBestValue = bestValueBundle?.id === bundle.id;
        const parts = bundle.label_ar.split(" — ");
        const mainTitle = parts[0]?.trim() ?? bundle.label_ar;
        const benefitPart = parts.slice(1).join(" — ").trim();
        const displayTitle =
          benefitPart && bundle.quantity > 1 ? `${mainTitle} • ${benefitPart}` : mainTitle;

        let savings: string | null = null;
        if (bundle.compare_at_price_sar && bundle.compare_at_price_sar > bundle.price_sar) {
          savings = `وفّري ${bundle.compare_at_price_sar - bundle.price_sar} ريال`;
        } else if (bundle.quantity > 1 && unitPrice * bundle.quantity > bundle.price_sar) {
          savings = `وفّري ${unitPrice * bundle.quantity - bundle.price_sar} ريال`;
        } else if (bundle.savings_label_ar) {
          savings = bundle.savings_label_ar;
        }

        const detailLine =
          bundle.quantity === 1
            ? "30 يوم · عبوة كاملة"
            : bundle.quantity === 2
              ? "60 يوم · شهر النتيجة + شهر التثبيت"
              : "90 يوم · نتيجة + تثبيت + هدية";

        const hasTopBadge = isDefault || (isBestValue && !isDefault);

        return (
          <button
            key={bundle.id}
            type="button"
            onClick={() => onSelect(bundle)}
            aria-pressed={isSelected}
            className={cn(
              "relative w-full flex items-center justify-between gap-4 rounded-2xl p-4 md:p-5 text-start transition-all",
              hasTopBadge && "mt-2",
              isSelected
                ? "border-[2.5px] border-brand-forest bg-[#F4F8F5] shadow-[0_2px_12px_rgba(26,71,49,0.08)]"
                : "border border-[#DDD5C8] bg-white hover:border-brand-forest/20",
            )}
          >
            {isDefault ? (
              <span className="absolute -top-3 end-4 bg-brand-gold text-white text-[10px] md:text-[11px] px-4 py-1 rounded-full font-bold shadow-sm whitespace-nowrap z-10">
                الأكثر اختياراً
              </span>
            ) : null}
            {isBestValue && !isDefault ? (
              <span className="absolute -top-3 end-4 bg-[#E8D5B5] text-brand-forest text-[10px] md:text-[11px] px-4 py-1 rounded-full font-bold whitespace-nowrap z-10">
                الأكثر توفيراً
              </span>
            ) : null}

            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div
                className={cn(
                  "w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected
                    ? "border-brand-forest bg-brand-forest"
                    : "border-[#C5BDB0] bg-white",
                )}
              >
                {isSelected ? <div className="w-2 h-2 rounded-full bg-white" /> : null}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-[15px] md:text-base text-brand-forest leading-snug">
                  {displayTitle}
                </p>
                <p className="text-xs text-brand-muted mt-1 leading-snug">{detailLine}</p>
              </div>
            </div>

            <div className="text-start shrink-0 min-w-[72px]">
              <p className="font-black text-xl md:text-[1.35rem] text-brand-forest tabular-nums leading-none">
                {bundle.price_sar} <span className="text-sm font-bold">ر.س</span>
              </p>
              {savings ? (
                <p className="text-[11px] md:text-xs font-bold text-emerald-700 mt-2 tabular-nums">
                  {savings}
                </p>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function SkincareNamaProductPage({
  product,
  productConfig,
  namaConfig,
  embedMode = "store",
}: SkincareNamaProductPageProps) {
  const isUpsellPreview = embedMode === "upsell-preview";
  const PAGE = namaConfig;
  const { addItem, openCheckout } = useCart();
  const defaultBundle = product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);
  const offersRef = useRef<HTMLDivElement>(null);

  const cardImageSrc = getProductMainImageSrc(product.slug);
  const minPrice = Math.min(...product.bundles.map((b) => b.price_sar));

  const heroImageSrc =
    product.slug === "vitamin-c-booster"
      ? (productConfig.heroSectionImage ?? cardImageSrc)
      : cardImageSrc;
  const heroImageAlt =
    product.slug === "vitamin-c-booster"
      ? (productConfig.heroSectionImageAlt ??
          getHomepageProductImageAlt(product.slug) ??
          product.name_ar)
      : (getHomepageProductImageAlt(product.slug) ??
          productConfig.heroSectionImageAlt ??
          product.name_ar);

  const reviewStats = useMemo(() => {
    const n = productConfig.reviews.length;
    const avg =
      n > 0
        ? Math.round((productConfig.reviews.reduce((s, r) => s + r.rating, 0) / n) * 10) / 10
        : 4.9;
    return {
      avg,
      count: getProductReviewDisplayCount(product.slug),
    };
  }, [productConfig.reviews, product.slug]);

  const allFaqs = useMemo(
    () => [...PRODUCT_COD_FAQS, ...productConfig.faqs],
    [productConfig.faqs],
  );

  const crossSellProducts = useMemo(() => {
    const slugs = productConfig.crossSellSlugs ?? [];
    return HOMEPAGE_BEAUTY.bestSellers.products.filter((p) => slugs.includes(p.slug));
  }, [productConfig.crossSellSlugs]);

  const firstOfferBundle = useMemo(
    () => getFirstOfferBundleFromBundles(product.bundles),
    [product.bundles],
  );

  const stickyProductName = useMemo(
    () => getStorefrontProductNameAr(product.slug),
    [product.slug],
  );

  const scrollToOffers = useCallback(() => {
    offersRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  useEffect(() => {
    if (isUpsellPreview) return;
    firePixelEvent({
      eventId: generateEventId("view_content"),
      eventName: "ViewContent",
      value: selectedBundle.price_sar,
      currency: "SAR",
      productSlug: product.slug,
      productName: stickyProductName,
    });
  }, [isUpsellPreview, stickyProductName, product.slug, selectedBundle.price_sar]);

  const handlePlaceOrder = useCallback(() => {
    if (isUpsellPreview) return;
    addItem({
      productSlug: product.slug,
      productNameAr: stickyProductName,
      bundleId: selectedBundle.id,
      bundleLabelAr: selectedBundle.label_ar,
      quantity: 1,
      priceSar: selectedBundle.price_sar,
      itemType: "main",
    });
    trackStoreEvent({ event_type: "add_to_cart", product_slug: product.slug });
    firePixelEvent({
      eventId: generateEventId("add_to_cart"),
      eventName: "AddToCart",
      value: selectedBundle.price_sar,
      currency: "SAR",
      productSlug: product.slug,
      productName: stickyProductName,
      bundleId: selectedBundle.id,
      quantity: selectedBundle.quantity,
    });
    openCheckout();
  }, [addItem, isUpsellPreview, openCheckout, product.slug, selectedBundle, stickyProductName]);

  return (
    <div dir="rtl" lang="ar" className="bg-[#F9F8F3] pb-20 md:pb-32">
      {/* Sticky CTA — Nama white bar + green button + image above */}
      {!isUpsellPreview ? (
        <div className="fixed bottom-0 inset-x-0 z-50 isolate bg-white border-t border-brand-border/25 shadow-[0_-6px_28px_rgba(26,71,49,0.1)]">
          {/* Mobile — full-width CTA, no floating image (avoids GPU compositor glitches) */}
          <div className="md:hidden px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={scrollToOffers}
              className="w-full flex items-center justify-center gap-2 bg-brand-forest text-white font-bold text-sm rounded-full py-3.5 shadow-[0_4px_16px_rgba(26,71,49,0.28)] active:bg-[#143d2a]"
            >
              <span className="truncate">
                {PAGE.stickyCtaVerb} · {firstOfferBundle.price_sar} ر.س
              </span>
              <ArrowUp className="w-4 h-4 shrink-0" />
            </button>
            <p className="text-center text-[10px] text-brand-muted tabular-nums mt-1.5">
              {firstOfferBundle.compare_at_price_sar
                ? `بدل ${firstOfferBundle.compare_at_price_sar} ر.س — ${firstOfferBundle.price_sar} ر.س · دفع عند الاستلام`
                : `من ${firstOfferBundle.price_sar} ر.س · دفع عند الاستلام`}
            </p>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex max-w-content mx-auto items-end justify-between gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={scrollToOffers}
              className="flex items-end gap-2.5 min-w-0 flex-1 text-start cursor-pointer"
            >
              <div className="relative -mt-10 w-14 h-14 rounded-xl overflow-hidden bg-white border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] shrink-0">
                <StoreImage
                  src={cardImageSrc}
                  alt={stickyProductName}
                  width={56}
                  height={56}
                  variant="thumbnail"
                  sizes={STORE_IMAGE_SIZES.tiny}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div className="min-w-0 pb-1">
                <p className="font-bold text-sm text-brand-espresso line-clamp-2 leading-snug">
                  {stickyProductName}
                </p>
                {firstOfferBundle.compare_at_price_sar ? (
                  <p className="text-[11px] text-brand-muted tabular-nums mt-0.5">
                    بدل {firstOfferBundle.compare_at_price_sar} ر.س — {firstOfferBundle.price_sar} ر.س
                  </p>
                ) : (
                  <p className="text-[11px] text-brand-muted tabular-nums mt-0.5">
                    من {firstOfferBundle.price_sar} ر.س · دفع عند الاستلام
                  </p>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={scrollToOffers}
              className="flex items-center justify-center gap-2 bg-brand-forest text-white font-bold text-base rounded-full px-7 py-4 shrink-0 shadow-[0_4px_16px_rgba(26,71,49,0.28)] hover:bg-[#143d2a] transition-colors mb-0.5"
            >
              <span className="whitespace-nowrap">
                {PAGE.stickyCtaVerb} · {firstOfferBundle.price_sar} ر.س
              </span>
              <ArrowUp className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      ) : null}

      {/* 1. Hero — Nama purchase block */}
      <section className="page-x pt-4 pb-6 md:pt-8 md:pb-10">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Image first on mobile */}
            <div className="order-1 md:order-2">
              <CroProductMedia
                src={heroImageSrc}
                alt={heroImageAlt}
                placeholder={product.name_ar}
                priority
                className="rounded-2xl border border-white/80 shadow-[0_8px_32px_rgba(26,71,49,0.08)] bg-white"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
                {PAGE.hero.quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center rounded-2xl bg-white border border-brand-border/20 py-3 px-2 shadow-[0_2px_8px_rgba(26,71,49,0.04)]"
                  >
                    <p className="text-base md:text-lg font-extrabold text-brand-forest leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[10px] md:text-[11px] text-brand-muted mt-1.5 font-medium leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy + offers */}
            <div className="order-2 md:order-1">
              <h1
                id="product-heading"
                className="text-[1.7rem] md:text-[2.35rem] lg:text-[2.55rem] font-extrabold text-brand-forest leading-[1.22] mb-4 scroll-mt-20 text-start tracking-tight"
              >
                {PAGE.hero.headline}
              </h1>

              <p className="text-[15px] md:text-base text-brand-muted leading-[1.9] mb-4 text-start">
                {PAGE.hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
                <div className="flex" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.round(reviewStats.avg)
                          ? "text-amber-400 fill-amber-400"
                          : "text-brand-border fill-brand-border",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-brand-muted">
                  {reviewStats.avg} ({reviewStats.count.toLocaleString("ar-SA")} تقييم · موثّق)
                </span>
                <span className="text-xs text-brand-muted hidden sm:inline">·</span>
                <span className="text-xs font-bold text-brand-forest">
                  من {minPrice} ر.س / عبوة
                </span>
              </div>

              {PAGE.hero.urgencyLine ? (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-1.5 mb-5">
                  <Flame className="w-3.5 h-3.5 shrink-0" />
                  <span>{PAGE.hero.urgencyLine}</span>
                </div>
              ) : null}

              <div id="product-offers" ref={offersRef} className="scroll-mt-24">
                <NamaBundleCards
                  bundles={product.bundles}
                  selectedId={selectedBundle.id}
                  onSelect={setSelectedBundle}
                />
              </div>

              {!isUpsellPreview ? (
                <div className="mt-5 space-y-2.5">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full bg-brand-forest text-white font-extrabold rounded-2xl py-4 md:py-[1.125rem] text-base md:text-lg shadow-[0_6px_24px_rgba(26,71,49,0.32)] hover:bg-[#143d2a] transition-colors"
                  >
                    {PAGE.stickyCtaVerb} · {selectedBundle.price_sar} ر.س
                  </button>
                  <p className="text-center text-xs text-brand-muted font-semibold">
                    الدفع عند الاستلام — بدون دفع أونلاين
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem / Solution pairs */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="order-2 md:order-1">
              <p className="text-xs font-bold text-brand-gold tracking-widest uppercase mb-2">
                {PAGE.problemSection.eyebrow}
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3 leading-tight">
                {PAGE.problemSection.title}
              </h2>
              <p className="text-sm md:text-base text-brand-muted mb-8 leading-relaxed">
                {PAGE.problemSection.subtitle}
              </p>

              <div className="space-y-1">
                {PAGE.problemPairs.map((pair, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-3 rounded-xl border border-brand-border/50 bg-white p-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <X className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      <p className="text-sm font-semibold text-brand-espresso leading-relaxed">{pair.problem}</p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-brand-forest/8 border border-brand-forest/15 p-4 mt-1">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-forest text-white">
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      <p className="text-sm text-brand-forest leading-relaxed font-medium">{pair.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <CroProductMedia
                src={productConfig.painSectionImage ?? cardImageSrc}
                alt={productConfig.painSectionImageAlt ?? product.name_ar}
                aspect={productConfig.painSectionImage ? undefined : "3/4"}
                placeholder={product.name_ar}
                className="rounded-t-2xl rounded-b-none border border-b-0 border-brand-border/20"
              />
              <div className="rounded-b-2xl bg-brand-forest text-white p-5 md:p-6 border border-t-0 border-brand-forest">
                <p className="text-3xl md:text-4xl font-black text-brand-gold tabular-nums mb-2 text-start">
                  {PAGE.problemSection.statValue}
                </p>
                <p className="text-sm leading-[1.85] opacity-95 text-start">{PAGE.problemSection.statText}</p>
                <p className="text-[10px] opacity-60 mt-3 text-start">{PAGE.problemSection.statSource}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ingredients */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            <div className="order-1 md:order-2">
              <CroProductMedia
                src={cardImageSrc}
                alt={product.name_ar}
                aspect="1/1"
                placeholder={product.name_ar}
                className="rounded-2xl border-[2mm] border-white shadow-lg"
              />
              <div className="mt-4 rounded-2xl bg-white border border-brand-border/40 p-5">
                <p className="font-bold text-brand-forest mb-3 text-sm">ما لن تجديه في تركيبتك</p>
                <div className="grid grid-cols-2 gap-2">
                  {PAGE.ingredients.freeFrom.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-lg bg-[#F5F0E8] px-3 py-2 text-xs font-medium text-brand-muted"
                    >
                      <X className="w-3 h-3 text-brand-muted/60 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3 leading-tight">
                {PAGE.ingredients.title}
              </h2>
              <p className="text-sm md:text-base text-brand-muted mb-8 leading-relaxed">
                {PAGE.ingredients.subtitle}
              </p>

              <div className="space-y-4">
                {PAGE.ingredients.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white border border-brand-border/30 p-5 shadow-[0_2px_12px_rgba(26,71,49,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-bold text-brand-forest text-base">{item.title}</h3>
                        <span className="inline-block mt-1 text-[11px] font-bold bg-brand-forest/10 text-brand-forest px-2.5 py-0.5 rounded-full">
                          {item.dose}
                        </span>
                      </div>
                      <FlaskConical className="w-5 h-5 text-brand-forest shrink-0" />
                    </div>
                    <p className="text-sm text-brand-muted leading-relaxed mb-3">{item.desc}</p>
                    <div className="flex items-start gap-2 rounded-lg bg-[#F5F0E8] p-3">
                      <Check className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                      <p className="text-xs font-semibold text-brand-forest">{item.highlight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Authority / Trust */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
            {PAGE.authority.title}
          </h2>
          <p className="text-sm md:text-base text-brand-muted max-w-2xl mx-auto">{PAGE.authority.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PAGE.authority.trustPills.map((pill) => (
              <div
                key={pill}
                className="rounded-xl bg-white border border-brand-border/40 py-4 px-3 text-center"
              >
                <p className="font-extrabold text-brand-forest text-sm md:text-base">{pill}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-6 items-stretch">
          <div className="grid grid-cols-2 gap-3">
            {PAGE.authority.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/80 border border-brand-border/30 p-4 text-center"
              >
                <p className="text-xl md:text-2xl font-black text-brand-forest tabular-nums">{stat.value}</p>
                <p className="text-xs text-brand-muted mt-1 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-brand-forest text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <Quote className="absolute top-4 end-4 w-16 h-16 text-white/10" />
            <p className="text-sm md:text-base leading-[1.9] relative z-10 mb-6">{PAGE.authority.expertQuote}</p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-brand-gold" />
              </div>
              <p className="text-xs font-semibold opacity-90">{PAGE.authority.expertTitle}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Timeline */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-forest/10 text-brand-forest text-xs font-bold px-4 py-1.5 mb-4">
            <Heart className="w-3.5 h-3.5" />
            {PAGE.timeline.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
            {PAGE.timeline.title}
          </h2>
          <p className="text-sm text-brand-muted">{PAGE.timeline.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto grid md:grid-cols-3 gap-4 md:gap-6 relative">
          <div className="hidden md:block absolute top-8 inset-x-[16%] h-px bg-brand-border/60" aria-hidden />
          {PAGE.timeline.steps.map((step) => (
            <div
              key={step.period}
              className="relative rounded-2xl bg-white border border-brand-border/30 p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-brand-forest text-white font-black flex items-center justify-center mb-4 mx-auto md:mx-0">
                {step.period}
              </div>
              <h3 className="font-bold text-brand-forest mb-2 text-center md:text-start">{step.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed text-center md:text-start">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-content mx-auto mt-6 rounded-xl bg-white border border-brand-border/30 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-forest flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <p className="text-sm font-semibold text-brand-forest">{PAGE.timeline.footerNote}</p>
        </div>
      </section>

      {/* 6. Long reviews */}
      <section className="page-x py-12 md:py-16 bg-white">
        <div className="max-w-content mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-3">
            {PAGE.longReviews.title}
          </h2>
          <p className="text-sm text-brand-muted">{PAGE.longReviews.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto grid md:grid-cols-3 gap-5">
          {PAGE.longReviews.items.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl bg-[#F5F0E8] border border-brand-border/30 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-brand-forest/20" />
                <div className="flex" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < review.rating ? "text-amber-400 fill-amber-400" : "text-brand-border",
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-brand-espresso leading-[1.85] flex-1 mb-5">{review.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-brand-border/30">
                <div className="w-9 h-9 rounded-full bg-brand-forest text-white font-bold flex items-center justify-center text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-espresso">{review.name}</p>
                  <p className="text-xs text-brand-muted">
                    {review.age} · {review.city}
                  </p>
                </div>
                <span className="ms-auto text-[10px] font-bold text-brand-forest bg-brand-forest/10 px-2 py-1 rounded-full">
                  مشتري مؤكد
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Comparison */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
            {PAGE.comparison.title}
          </h2>
          <p className="text-sm text-brand-muted max-w-2xl mx-auto">{PAGE.comparison.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {PAGE.comparison.alternatives.map((alt) => (
            <div
              key={alt.title}
              className="rounded-2xl bg-white border border-red-100 p-5 shadow-sm"
            >
              <h3 className="font-bold text-red-600 text-sm mb-1">{alt.title}</h3>
              <p className="text-xs text-red-400 font-semibold mb-3">{alt.priceRange}</p>
              <ul className="space-y-2">
                {alt.cons.map((con) => (
                  <li key={con} className="flex items-start gap-2 text-xs text-brand-muted">
                    <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-content mx-auto rounded-2xl bg-brand-forest text-white p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {PAGE.comparison.mutqanBar.map((item, i) => (
              <div key={item} className="flex items-center gap-2 text-sm font-semibold">
                {i > 0 ? <span className="hidden md:inline text-white/30">|</span> : null}
                <Check className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Guarantee */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto">
          <div className="rounded-3xl bg-[#EDE8DF] border border-brand-border/30 p-8 md:p-12 text-center shadow-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-forest text-white text-xs font-bold px-4 py-1.5 mb-5">
              <Heart className="w-3.5 h-3.5" />
              {PAGE.guarantee.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-4">
              {PAGE.guarantee.title}
            </h2>
            <p className="text-sm md:text-base text-brand-muted max-w-xl mx-auto mb-8 leading-relaxed">
              {PAGE.guarantee.copy}
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {PAGE.guarantee.steps.map((step, i) => {
                const icons = [Phone, Package, Banknote];
                const Icon = icons[i] ?? Phone;
                return (
                  <div key={step.title} className="rounded-xl bg-white p-5 text-start flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-forest text-sm">{step.title}</p>
                      <p className="text-xs text-brand-muted mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Routine */}
      <section className="page-x py-12 md:py-16 bg-white">
        <div className="max-w-content mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
            {PAGE.routine.title}
          </h2>
          <p className="text-sm text-brand-muted">{PAGE.routine.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PAGE.routine.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-[#F5F0E8] border border-brand-border/30 p-5 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-brand-forest mx-auto mb-3 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-brand-forest text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-content mx-auto bg-brand-forest text-white rounded-2xl py-6 px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {PAGE.usageStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-black text-brand-gold tabular-nums">{stat.value}</p>
                <p className="text-xs mt-1 opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Order steps */}
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
            {PAGE.orderSteps.title}
          </h2>
          <p className="text-sm text-brand-muted">{PAGE.orderSteps.subtitle}</p>
        </div>

        <div className="max-w-content mx-auto grid md:grid-cols-3 gap-5">
          {PAGE.orderSteps.steps.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl bg-white border border-brand-border/30 p-6 relative"
            >
              <span className="absolute top-4 end-4 w-8 h-8 rounded-full bg-brand-forest text-white font-black text-sm flex items-center justify-center">
                {step.n}
              </span>
              <h3 className="font-bold text-brand-forest mb-2 pe-10">{step.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Shipping + FAQ */}
      <section className={cn("page-x py-8 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto space-y-8 md:space-y-12">
          <div className="hidden md:block rounded-2xl md:rounded-3xl border border-brand-forest/10 bg-white shadow-[0_4px_24px_rgba(26,71,49,0.06)]">
            <div className="bg-brand-forest px-8 py-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-brand-gold" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-xl leading-tight">
                    {PAGE.shipping.title}
                  </h3>
                  <p className="text-white/75 text-sm mt-1">
                    توصيل سريع لباب بيتك — بدون دفع مقدّم
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-gold/20 border border-brand-gold/30 px-4 py-2 shrink-0">
                <Truck className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-sm font-bold text-white tabular-nums">2–5 أيام عمل</span>
              </div>
            </div>

            <div className="p-8 bg-white">
              <p className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-4">
                مدن نخدمها حالياً
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {PAGE.shipping.cities.map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-2 rounded-xl bg-[#F5F0E8] border border-brand-border/20 px-3 py-2.5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-forest/10">
                      <Check className="w-3 h-3 text-brand-forest" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-semibold text-brand-forest">{city}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-forest text-white px-5 py-2.5 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  + كل المناطق داخل المملكة
                </span>
              </div>
            </div>

            <div className="border-t border-brand-border/20 bg-[#FAF8F5] px-8 py-5 space-y-3">
              {PAGE.shipping.upsellNote ? (
                <div className="flex items-center gap-2 rounded-xl bg-brand-forest/5 border border-brand-forest/15 px-4 py-3">
                  <Package className="w-4 h-4 text-brand-forest shrink-0" />
                  <p className="text-sm font-bold text-brand-forest">{PAGE.shipping.upsellNote}</p>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-brand-muted leading-relaxed">{PAGE.shipping.note}</p>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {["أرامكس", "SMSA", "ريدبوكس"].map((partner) => (
                    <span
                      key={partner}
                      className="inline-flex items-center rounded-lg bg-white border border-brand-border/30 px-3 py-1.5 text-[11px] font-bold text-brand-forest"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest text-center mb-8">
              {PAGE.faqTitle}
            </h2>
            <FAQAccordion items={allFaqs} />
          </div>
        </div>
      </section>

      {/* 12. Cross-sell */}
      {crossSellProducts.length > 0 ? (
        <section className="page-x py-12 md:py-16 bg-white">
          <div className="max-w-content mx-auto text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-forest mb-3">
              {PAGE.crossSellTitle}
            </h2>
            <p className="text-sm text-brand-muted">{PAGE.crossSellSubtitle}</p>
          </div>
          <div className="max-w-content mx-auto grid sm:grid-cols-2 gap-6">
            {crossSellProducts.map((p) => (
              <BeautyProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      {!isUpsellPreview ? (
        <section className={cn("page-x py-10 md:py-12", CREAM_SECTION)}>
          <div className="max-w-content mx-auto text-center">
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="inline-flex items-center justify-center gap-2 bg-brand-forest text-white font-bold rounded-xl px-10 py-4 text-base md:text-lg shadow-[0_4px_20px_rgba(26,71,49,0.3)] hover:bg-[#143d2a] transition-colors"
            >
              {PAGE.stickyCtaVerb} — {selectedBundle.price_sar} ر.س
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-xs text-brand-muted mt-3">دفع عند الاستلام · ضمان 30 يوم</p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
