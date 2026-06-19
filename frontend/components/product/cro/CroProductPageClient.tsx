"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Star,
  ShoppingBag,
  Check,
  X,
  Users,
} from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { BundleSelector } from "@/components/product/BundleSelector";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { CroProductMedia } from "@/components/product/cro/CroProductMedia";
import { CroProductValueJustification } from "@/components/product/cro/CroProductValueJustification";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { PRODUCT_COD_FAQS } from "@/lib/product-cod-faqs";
import { getCroProductPage } from "@/config/cro-product-pages";
import { PRODUCTS_CONFIG } from "@/config/products";
import { getWhyItWorksImage } from "@/lib/cro-product-page-images";
import { reviewDateLabel } from "@/lib/product-review-dates";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import type { ProductBundle } from "@/types";
import { getProductCardImageSrc } from "@/lib/product-image";
import { cn } from "@/lib/utils";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { useCart } from "@/providers/cart-provider";

type CroProductPageClientProps = {
  embedMode?: "store" | "upsell-preview";
  product: {
    id: string;
    slug: string;
    name_ar: string;
    short_description_ar: string;
    category_slug: string;
    bundles: ProductBundle[];
  };
};

export function CroProductPageClient({
  product,
  embedMode = "store",
}: CroProductPageClientProps) {
  const isUpsellPreview = embedMode === "upsell-preview";
  const PAGE = getCroProductPage(product.slug);
  const config = PRODUCTS_CONFIG[product.slug];
  const OFFER_HEADING_ID = `${product.slug}-offer-heading`;
  const { addItem, openCheckout } = useCart();
  const defaultBundle =
    product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] =
    useState<ProductBundle>(defaultBundle);
  const [showSticky, setShowSticky] = useState(false);
  const offerRef = useRef<HTMLDivElement>(null);

  const cardImageSrc = getProductCardImageSrc(product.slug);
  const minBundlePrice = Math.min(...product.bundles.map((b) => b.price_sar));
  const firstOfferPrice = useMemo(() => {
    const sorted = [...product.bundles].sort(
      (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99),
    );
    return sorted[0]?.price_sar ?? minBundlePrice;
  }, [product.bundles, minBundlePrice]);

  const reviewStats = useMemo(() => {
    const n = config.reviews.length;
    const avg =
      n > 0
        ? Math.round(
            (config.reviews.reduce((s, r) => s + r.rating, 0) / n) * 10,
          ) / 10
        : 4.9;
    return {
      avg,
      label: `${getProductReviewDisplayCount(product.slug).toLocaleString("ar-SA")} تقييم موثق`,
    };
  }, [config.reviews, product.slug]);

  const allFaqs = useMemo(
    () => [...PRODUCT_COD_FAQS, ...config.faqs],
    [config.faqs],
  );

  useEffect(() => {
    const target = offerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isUpsellPreview) return;
    firePixelEvent({
      eventId: generateEventId("view_content"),
      eventName: "ViewContent",
      value: selectedBundle.price_sar,
      currency: "SAR",
      productSlug: product.slug,
      productName: product.name_ar,
    });
  }, [isUpsellPreview, product.name_ar, product.slug, selectedBundle.price_sar]);

  const scrollToOffers = useCallback(() => {
    const el = document.getElementById(OFFER_HEADING_ID);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [OFFER_HEADING_ID]);

  const handlePlaceOrder = useCallback(() => {
    if (isUpsellPreview) return;
    addItem({
      productSlug: product.slug,
      productNameAr: product.name_ar,
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
      productName: product.name_ar,
      bundleId: selectedBundle.id,
      quantity: selectedBundle.quantity,
    });
    openCheckout();
  }, [addItem, isUpsellPreview, openCheckout, product, selectedBundle]);

  return (
    <div className="bg-brand-background">
      {/* Sticky CTA */}
      {!isUpsellPreview && showSticky ? (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-content mx-auto flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-brand-beige border border-brand-border shrink-0">
                <StoreImage
                  src={cardImageSrc}
                  alt={product.name_ar}
                  fill
                  variant="thumbnail"
                  sizes={STORE_IMAGE_SIZES.tiny}
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-brand-espresso truncate">
                  {product.name_ar}
                </p>
                <p className="text-xs text-brand-muted tabular-nums">
                  ابتداءً من {firstOfferPrice} ر.س
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToOffers}
              className="btn-primary shrink-0 px-4 py-3 text-sm font-bold whitespace-nowrap"
            >
              اختر عرضك الآن
            </button>
          </div>
        </div>
      ) : null}

      {/* 1. Hero — outcome, no price */}
      <section className="page-x pt-3 pb-5 md:pt-5 md:pb-8">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-10 items-center">
            <div className="order-2 md:order-1 space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center" aria-hidden>
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
                <span className="text-xs font-bold text-brand-espresso">
                  {reviewStats.avg} · {reviewStats.label}
                </span>
              </div>

              <h1
                id="product-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-espresso leading-tight scroll-mt-20"
              >
                {PAGE.hero.headline}
              </h1>

              <p className="text-sm md:text-base text-brand-muted font-medium leading-relaxed">
                {PAGE.hero.subheadline}
              </p>

              <ul className="space-y-2">
                {PAGE.hero.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm md:text-base font-bold text-brand-espresso"
                  >
                    <Check className="w-4 h-4 text-brand-trust shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>

              {!isUpsellPreview ? (
                <button
                  type="button"
                  onClick={scrollToOffers}
                  className="btn-primary w-full min-h-[48px] md:min-h-[52px] rounded-2xl text-base font-bold"
                >
                  شوف العروض والأسعار
                </button>
              ) : null}
            </div>

            <div className="order-1 md:order-2">
              <CroProductMedia
                src={config.heroSectionImage}
                alt={config.heroSectionImageAlt}
                aspect={config.heroSectionAspect}
                placeholder="[HERO BEFORE/AFTER PLACEHOLDER]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust badges */}
      <section className="page-x pb-5 md:pb-6">
        <div className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {PAGE.trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="rounded-xl border border-brand-border/70 bg-white px-3 py-3 text-center shadow-sm"
            >
              <p className="text-[11px] sm:text-xs font-bold text-brand-espresso leading-snug">
                {badge.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Before / After — dominant, before price */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto space-y-4 md:space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {PAGE.beforeAfter.title}
            </h2>
            <p className="text-sm text-brand-muted mt-1">{PAGE.beforeAfter.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto">
            <div className="card overflow-hidden border border-brand-border">
              <CroProductMedia
                src={config.beforeSectionImage}
                alt={config.beforeSectionImageAlt}
                aspect={config.beforeSectionAspect}
                placeholder="[BEFORE IMAGE PLACEHOLDER]"
                imageClassName="opacity-90 grayscale-[15%]"
              />
              <div className="p-3 text-center bg-white">
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  قبل
                </span>
                <p className="text-xs font-bold text-brand-muted mt-1.5">
                  {config.beforeLabel}
                </p>
              </div>
            </div>
            <div className="card overflow-hidden border-2 border-brand-trust/40">
              <CroProductMedia
                src={config.afterSectionImage}
                alt={config.afterSectionImageAlt}
                aspect={config.afterSectionAspect}
                placeholder="[AFTER IMAGE PLACEHOLDER]"
              />
              <div className="p-3 text-center bg-brand-surface">
                <span className="text-[10px] font-bold text-white bg-brand-trust px-2 py-0.5 rounded">
                  بعد
                </span>
                <p className="text-sm font-extrabold text-brand-espresso mt-1.5">
                  {config.afterLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Problem */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-4 md:gap-8 items-center">
          <CroProductMedia
            src={config.painSectionImage}
            alt={config.painSectionImageAlt}
            aspect={config.painSectionAspect}
            placeholder="[PROBLEM UNDER-SINK PLACEHOLDER]"
          />
          <div className="space-y-2 text-start">
            <p className="text-xs font-bold text-brand-bronze uppercase tracking-wide">
              المشكلة
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {PAGE.problem.title}
            </h2>
            <p className="text-sm md:text-base text-brand-muted font-medium">
              {PAGE.problem.copy}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Solution */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-4 md:gap-8 items-center">
          <div className="space-y-2 text-start md:order-2">
            <p className="text-xs font-bold text-brand-trust uppercase tracking-wide">
              الحل
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {PAGE.solution.title}
            </h2>
            <p className="text-sm md:text-base text-brand-muted font-medium">
              {PAGE.solution.copy}
            </p>
          </div>
          <div className="md:order-1">
            <CroProductMedia
              src={config.solutionSectionImage}
              alt={config.solutionSectionImageAlt}
              aspect={config.solutionSectionAspect}
              placeholder="[SOLUTION PLACEHOLDER]"
            />
          </div>
        </div>
      </section>

      {/* 6. Pipe compatibility */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto max-w-3xl space-y-3 md:space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
            {PAGE.highlight.title}
          </h2>
          <p className="text-sm text-brand-muted">{PAGE.highlight.copy}</p>
          <CroProductMedia
            src={config.lifestyleSectionImage}
            alt={config.lifestyleSectionImageAlt}
            aspect={config.lifestyleSectionAspect ?? "4/3"}
            placeholder={PAGE.highlight.placeholder}
          />
        </div>
      </section>

      {/* 7. Benefits */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto space-y-4 md:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso text-center">
            {PAGE.benefits.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
            {PAGE.benefits.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-brand-border/60 bg-brand-surface p-4"
              >
                <p className="text-sm md:text-base font-extrabold text-brand-espresso leading-snug">
                  {item.title}
                </p>
                <p className="text-xs md:text-sm text-brand-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why it works */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto space-y-4 md:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso text-center">
            {PAGE.whyItWorks.title}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5 max-w-4xl mx-auto items-start">
            {PAGE.whyItWorks.items.map((item, i) => {
              const proof = getWhyItWorksImage(product.slug, i, config);
              return (
                <div key={item.title} className="space-y-2 min-w-0">
                  <CroProductMedia
                    src={proof.src}
                    alt={proof.alt ?? item.title}
                    aspect={proof.aspect ?? "4/3"}
                    placeholder={item.placeholder}
                  />
                  <p className="text-sm font-extrabold text-brand-espresso">{item.title}</p>
                  <p className="text-xs text-brand-muted">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Features */}
      <section className="cv-section page-x py-5 md:py-8 bg-white">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-espresso text-center mb-4">
            {PAGE.features.title}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2">
            {PAGE.features.items.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 rounded-xl bg-brand-surface border border-brand-border/50 px-3 py-2.5 text-sm font-bold text-brand-espresso"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-trust shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 9a. Dimensions — before pricing, when configured */}
      {PAGE.dimensionsSection && config.dimensionsSectionImage ? (
        <section className="cv-section product-section-pad page-x bg-brand-surface">
          <div className="max-w-content mx-auto max-w-3xl space-y-4 md:space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
                {PAGE.dimensionsSection.title}
              </h2>
              <p className="text-sm text-brand-muted font-medium max-w-xl mx-auto">
                {PAGE.dimensionsSection.subtitle}
              </p>
            </div>
            <CroProductMedia
              src={config.dimensionsSectionImage}
              alt={config.dimensionsSectionImageAlt}
              aspect={config.dimensionsSectionAspect ?? "3/2"}
              placeholder="[DIMENSIONS DIAGRAM PLACEHOLDER]"
            />
            <ul className="grid sm:grid-cols-3 gap-2 md:gap-3">
              {PAGE.dimensionsSection.bullets.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-brand-border/60 bg-white px-3 py-2.5 text-center text-xs sm:text-sm font-bold text-brand-espresso leading-snug"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* 9b. Value justification — before pricing */}
      <CroProductValueJustification section={PAGE.valueJustification} />

      {product.slug === "beauty-vanity-cabinet" ? (
        <section className="cv-section page-x py-3 md:py-5 bg-white">
          <div className="max-w-content mx-auto max-w-xl">
            <div className="relative overflow-hidden rounded-[24px] border border-brand-gold/25 bg-gradient-to-br from-white via-[#FFFCF7] to-brand-beige/50 p-4 shadow-[0_14px_34px_rgba(15,23,42,0.07)]">
              <div className="absolute -top-14 -left-12 h-28 w-28 rounded-full bg-brand-gold/10 blur-3xl" />
              <div className="relative flex items-center gap-3 text-start">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  <Users className="h-6 w-6" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-[11px] font-extrabold text-brand-gold">
                    المنتج الأكثر بداية لعميلات متقن
                  </p>
                  <h2 className="text-base sm:text-lg md:text-xl font-extrabold leading-snug text-brand-espresso">
                    أكثر من 3000 عميلة اختارت خزانة متقن
                  </h2>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed text-brand-muted">
                    طلب آمن مع الدفع عند الاستلام، شحن سريع، وضمان 30 يوم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 10. Offer selector — after value */}
      <section
        ref={offerRef}
        className="cv-section product-section-pad page-x bg-brand-surface border-y border-brand-border/40"
      >
        <div className="max-w-content mx-auto max-w-lg space-y-4">
          <div className="text-center">
            <h2
              id={OFFER_HEADING_ID}
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso scroll-mt-[4.75rem] md:scroll-mt-20"
            >
              {PAGE.offer.title}
            </h2>
            <p className="text-sm text-brand-muted mt-1">{PAGE.offer.subtitle}</p>
          </div>

          <BundleSelector
            bundles={product.bundles}
            selectedId={selectedBundle.id}
            onSelect={setSelectedBundle}
            productSlug={product.slug}
          />

          {!isUpsellPreview ? (
            <>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="btn-primary w-full min-h-[52px] rounded-2xl text-base md:text-lg font-bold shadow-lg shadow-brand-gold/20"
              >
                اطلب الآن · {selectedBundle.price_sar} ر.س
              </button>
              <p className="text-center text-xs text-brand-muted font-medium">
                بدون دفع الآن — نؤكد هاتفياً ثم تدفع عند الاستلام
              </p>
            </>
          ) : null}
        </div>
      </section>

      {/* 11. Reviews — image-first masonry */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto space-y-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {PAGE.reviews.title}
            </h2>
            <p className="text-sm text-brand-muted mt-1">{PAGE.reviews.subtitle}</p>
          </div>
          <div className="columns-2 lg:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {config.reviews.map((review, i) => {
              const dateLabel = review.dateLabel ?? reviewDateLabel(product.slug, i);
              const shouldShowFullReview = product.slug === "beauty-vanity-cabinet";
              return (
                <article
                  key={`${review.name}-${i}`}
                  className="break-inside-avoid card overflow-hidden"
                >
                  {review.photo ? (
                    <CroProductMedia
                      src={review.photo}
                      alt={review.photoAlt ?? review.name}
                      aspect={review.photoAspect ?? "3/4"}
                      placeholder="[CUSTOMER PHOTO PLACEHOLDER]"
                    />
                  ) : null}
                  <div
                    className={cn(
                      "space-y-1",
                      review.photo ? "p-2.5 md:p-3" : "p-3.5 md:p-4",
                    )}
                  >
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={cn(
                            "w-3 h-3",
                            si < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-brand-border",
                          )}
                        />
                      ))}
                    </div>
                    <p
                      className={cn(
                        "text-[11px] md:text-xs text-brand-text leading-relaxed",
                        shouldShowFullReview ? "" : "line-clamp-3",
                      )}
                    >
                      &ldquo;{review.text}&rdquo;
                    </p>
                    <p className="text-[10px] text-brand-muted font-medium">
                      {review.name} · {review.city}
                      {dateLabel ? ` · ${dateLabel}` : ""}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 14. Comparison */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto max-w-2xl">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {PAGE.comparison.title}
            </h2>
            <p className="text-sm text-brand-muted mt-1">{PAGE.comparison.subtitle}</p>
          </div>
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full min-w-[300px] border-collapse text-sm">
              <thead>
                <tr className="border-b-2 border-brand-border">
                  <th className="text-start py-2 px-2 font-bold text-brand-muted w-[44%]">
                    الميزة
                  </th>
                  <th className="py-2 px-2 font-black text-brand-bronze text-center w-[28%]">
                    متقن
                  </th>
                  <th className="py-2 px-2 font-bold text-brand-muted text-center w-[28%]">
                    البدائل
                  </th>
                </tr>
              </thead>
              <tbody>
                {PAGE.comparison.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-brand-border/60"
                  >
                    <td className="py-3 px-2 text-brand-espresso font-medium text-xs sm:text-sm leading-snug">
                      {row.label}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <CompareIcon ok={row.us} variant="us" />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <CompareIcon ok={row.alternative} variant="alt" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 15. FAQ */}
      <section className="cv-section page-x py-6 md:py-8 bg-white">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-4">
            أسئلة قبل الطلب
          </h2>
          <FAQAccordion items={allFaqs} />
        </div>
      </section>

      {/* 16. Order process */}
      <section className="cv-section page-x py-6 md:py-8 bg-brand-surface">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-brand-espresso text-center mb-5">
            {PAGE.orderProcess.title}
          </h2>
          <ol className="grid sm:grid-cols-2 gap-3">
            {PAGE.orderProcess.steps.map((step) => (
              <li
                key={step.n}
                className="flex items-start gap-3 rounded-2xl border border-brand-border/60 bg-white p-4"
              >
                <span className="w-9 h-9 rounded-full bg-brand-bronze text-white font-black flex items-center justify-center shrink-0 text-sm">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-extrabold text-brand-espresso">
                    {step.title}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 17. Final CTA */}
      {!isUpsellPreview ? (
        <section className="cv-section page-x pt-8 md:pt-10 pb-24 md:pb-10 bg-brand-espresso">
          <div className="max-w-content mx-auto max-w-lg text-center space-y-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-snug">
              {PAGE.finalCta.title}
            </h2>
            <p className="text-brand-sand/90 text-sm leading-relaxed">
              {PAGE.finalCta.subtitle}
              <br />
              ابتداءً من {minBundlePrice} ر.س
            </p>
            <button
              type="button"
              onClick={scrollToOffers}
              className="btn-primary w-full min-h-[52px] text-base md:text-lg font-bold flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              اختر عرضك الآن
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function CompareIcon({
  ok,
  variant,
}: {
  ok: boolean;
  variant: "us" | "alt";
}) {
  return (
    <span
      className={cn(
        "inline-flex w-7 h-7 sm:w-8 sm:h-8 rounded-full items-center justify-center mx-auto",
        ok
          ? variant === "us"
            ? "bg-brand-trust/15 text-brand-trust"
            : "bg-brand-trust/10 text-brand-trust"
          : "bg-red-50 text-red-500",
      )}
      aria-label={ok ? "نعم" : "لا"}
    >
      {ok ? (
        <Check className="w-4 h-4" strokeWidth={2.5} />
      ) : (
        <X className="w-4 h-4" strokeWidth={2.5} />
      )}
    </span>
  );
}
