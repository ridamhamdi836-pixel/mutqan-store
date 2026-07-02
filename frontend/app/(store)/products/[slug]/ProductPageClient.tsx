"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { StoreImage, StoreImageFrame } from "@/components/ui/StoreImage";
import { Star, ShoppingBag } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { BundleSelector } from "@/components/product/BundleSelector";
import { ReviewCard } from "@/components/product/ReviewCard";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { ProductComparisonTable } from "@/components/product/ProductComparisonTable";
import { ProductTrustStrip } from "@/components/product/ProductTrustStrip";
import { ProductCodSteps } from "@/components/product/ProductCodSteps";
import { ProductHeroTrust } from "@/components/product/ProductHeroTrust";
import { ProductOrderCta } from "@/components/product/ProductOrderCta";
import { ProductSpecsSection } from "@/components/product/ProductSpecsSection";
import { ProductCard } from "@/components/commerce/ProductCard";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { PRODUCT_COD_FAQS } from "@/lib/product-cod-faqs";
import { PRODUCT_SPECS } from "@/config/product-specs";
import { reviewDateLabel } from "@/lib/product-review-dates";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import type { ProductBundle } from "@/types";
import { getProduct, toProduct } from "@/config/catalog";
import {
  getProductCardImageSrc,
  getProductImageSrc,
} from "@/lib/product-image";
import { cn } from "@/lib/utils";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { getStorefrontProductNameAr } from "@/lib/storefront-product-names";

function beforeAfterImageClass(muted?: boolean): string {
  return cn(muted && "opacity-90 grayscale-[20%]");
}

function SectionImage({
  src,
  alt,
  aspect,
  className,
  priority,
}: {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <StoreImageFrame
      src={src}
      alt={alt}
      aspect={aspect}
      className={cn(
        "rounded-2xl overflow-hidden shadow-md border border-brand-border",
        className,
      )}
      variant={priority ? "hero" : "default"}
      priority={priority}
      sizes={STORE_IMAGE_SIZES.section}
    />
  );
}

interface ProductPageClientProps {
  embedMode?: "store" | "upsell-preview";
  product: {
    id: string;
    slug: string;
    name_ar: string;
    short_description_ar: string;
    category_slug: string;
    bundles: ProductBundle[];
  };
  config: {
    heroImageAlt: string;
    shortPromise: string;
    heroAngle: string;
    problemStatement: string;
    heroSectionImage?: string;
    heroSectionImageAlt?: string;
    heroSectionAspect?: string;
    painSectionImage?: string;
    painSectionImageAlt?: string;
    painSectionAspect?: string;
    solutionSectionImage?: string;
    solutionSectionImageAlt?: string;
    solutionSectionAspect?: string;
    lifestyleSectionImage?: string;
    lifestyleSectionImageAlt?: string;
    lifestyleSectionAspect?: string;
    afterSectionImage?: string;
    afterSectionImageAlt?: string;
    afterSectionAspect?: string;
    beforeSectionImage?: string;
    beforeSectionImageAlt?: string;
    beforeSectionAspect?: string;
    benefits: string[];
    beforeLabel: string;
    afterLabel: string;
    howToUse: string[];
    crossSellSlugs: string[];
    reviews: Array<{
      name: string;
      city: string;
      rating: number;
      text: string;
      photo?: string;
      photoAlt?: string;
      photoAspect?: string;
    }>;
    faqs: Array<{ question: string; answer: string }>;
  };
}

export function ProductPageClient({
  product,
  config,
  embedMode = "store",
}: ProductPageClientProps) {
  const isUpsellPreview = embedMode === "upsell-preview";
  const { addItem, openCheckout } = useCart();
  const defaultBundle = product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);
  const [showSticky, setShowSticky] = useState(false);
  const bundleRef = useRef<HTMLDivElement>(null);
  const productImageSrc = getProductImageSrc(product.slug);
  const cardImageSrc = getProductCardImageSrc(product.slug);
  const heroImageSrc = config.heroSectionImage ?? productImageSrc;
  const storefrontProductName = useMemo(
    () => getStorefrontProductNameAr(product.slug),
    [product.slug],
  );
  const minBundlePrice = Math.min(...product.bundles.map((b) => b.price_sar));

  const specs = PRODUCT_SPECS[product.slug] ?? [];
  const allFaqs = useMemo(
    () => [...PRODUCT_COD_FAQS, ...config.faqs],
    [config.faqs],
  );

  const reviewStats = useMemo(() => {
    const n = config.reviews.length;
    const avg =
      n > 0
        ? Math.round(
            (config.reviews.reduce((s, r) => s + r.rating, 0) / n) * 10,
          ) / 10
        : 4.9;
    const displayCount = getProductReviewDisplayCount(product.slug);
    return {
      avg,
      label: `${displayCount.toLocaleString("ar-SA")} تقييم موثق`,
    };
  }, [config.reviews, product.slug]);

  useEffect(() => {
    const target = bundleRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    firePixelEvent({
      eventId: generateEventId("view_content"),
      eventName: "ViewContent",
      value: selectedBundle.price_sar,
      currency: "SAR",
      productSlug: product.slug,
      productName: storefrontProductName,
    });
  }, []);

  const scrollToOffers = useCallback(() => {
    bundleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handlePlaceOrder = useCallback(() => {
    if (isUpsellPreview) return;

    addItem({
      productSlug: product.slug,
      productNameAr: storefrontProductName,
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
      productName: storefrontProductName,
      bundleId: selectedBundle.id,
      quantity: selectedBundle.quantity,
    });

    openCheckout();
  }, [addItem, openCheckout, product, selectedBundle, isUpsellPreview]);

  const relatedProducts = config.crossSellSlugs
    .map((slug) => {
      const p = getProduct(slug);
      return p ? toProduct(p) : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return (
    <div className="bg-brand-background pb-20 md:pb-4">
      {!isUpsellPreview && showSticky ? (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="max-w-content mx-auto flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-brand-beige border border-brand-border shrink-0">
                <StoreImage
                  src={cardImageSrc}
                  alt={storefrontProductName}
                  fill
                  variant="thumbnail"
                  sizes={STORE_IMAGE_SIZES.tiny}
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-brand-espresso truncate">
                  {storefrontProductName}
                </p>
                <p className="text-xs text-brand-muted tabular-nums">
                  ابتداءً من {minBundlePrice} ر.س
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

      {/* ── 1. شراء — كل ما يحتاجه الزائر للقرار ── */}
      <section className="page-x pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-start">
            <StoreImageFrame
              src={heroImageSrc}
              alt={config.heroSectionImageAlt ?? config.heroImageAlt}
              aspect={config.heroSectionAspect}
              className="rounded-2xl overflow-hidden shadow-md"
              variant="hero"
              priority
              sizes={STORE_IMAGE_SIZES.hero}
            />

            <div className="space-y-3 md:space-y-4 lg:sticky lg:top-[4.25rem]">
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
                <span className="text-xs md:text-sm font-bold text-brand-espresso">
                  {reviewStats.avg} · {reviewStats.label}
                </span>
              </div>

              <h1
                id="product-heading"
                className="text-2xl md:text-4xl font-extrabold text-brand-espresso leading-tight scroll-mt-20"
              >
                {product.name_ar}
              </h1>

              <p className="text-sm md:text-base text-brand-muted leading-relaxed font-medium">
                {config.shortPromise}
              </p>

              <ProductHeroTrust />

              <div
                id="bundle-section"
                ref={bundleRef}
                className="scroll-mt-24 md:scroll-mt-28"
              >
                <BundleSelector
                  bundles={product.bundles}
                  selectedId={selectedBundle.id}
                  onSelect={setSelectedBundle}
                />
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="btn-primary w-full min-h-[52px] md:min-h-[56px] rounded-2xl text-base md:text-lg font-bold flex items-center justify-center md:shadow-lg md:shadow-[#1B4DDB]/20"
              >
                اطلب الآن · {selectedBundle.price_sar} ر.س
              </button>
              <p className="text-center text-xs text-brand-muted font-medium">
                بدون دفع الآن — نؤكد هاتفياً ثم تدفع عند الاستلام
              </p>

              {!isUpsellPreview ? <ProductCodSteps /> : null}
            </div>
          </div>
        </div>
      </section>

      <ProductTrustStrip variant="bar" />

      {/* ── 2. القصة: مشكلة → حل → فوائد ── */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-5 md:gap-8 items-center">
          <SectionImage
            src={config.painSectionImage ?? productImageSrc}
            alt={config.painSectionImageAlt ?? "المشكلة اليومية"}
            aspect={config.painSectionAspect}
          />
          <div className="space-y-4 text-start">
            <p className="text-xs font-bold text-brand-bronze uppercase tracking-wide">
              المشكلة
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              هل تعاني من هذا يومياً؟
            </h2>
            <p className="text-base md:text-lg text-brand-muted leading-relaxed">
              {config.problemStatement}
            </p>
          </div>
        </div>
      </section>

      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-5 md:gap-8 items-center">
          <div className="space-y-4 text-start md:order-2">
            <p className="text-xs font-bold text-brand-trust uppercase tracking-wide">
              الحل من متقن
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {config.heroAngle}
            </h2>
            <p className="text-base md:text-lg text-brand-muted leading-relaxed">
              منتج مختار لبيوت الخليج — سهل الاستخدام من أول يوم، بدون تعقيد.
            </p>
          </div>
          <div className="md:order-1">
            <SectionImage
              src={config.solutionSectionImage ?? productImageSrc}
              alt={config.solutionSectionImageAlt ?? "الحل من متقن"}
              aspect={config.solutionSectionAspect}
            />
          </div>
        </div>
      </section>

      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6 md:mb-8">
            لماذا ستحب هذا المنتج؟
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {config.lifestyleSectionImage ? (
              <SectionImage
                src={config.lifestyleSectionImage}
                alt={config.lifestyleSectionImageAlt ?? storefrontProductName}
                aspect={config.lifestyleSectionAspect}
              />
            ) : null}
            <ul
              className={cn(
                "grid gap-3",
                config.lifestyleSectionImage ? "" : "md:col-span-2 sm:grid-cols-2",
              )}
            >
              {config.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-3 rounded-xl border border-brand-border/60 bg-brand-surface p-4"
                >
                  <span className="w-2 h-2 rounded-full bg-brand-trust shrink-0 mt-2" />
                  <span className="text-sm md:text-base font-bold text-brand-espresso leading-snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 3. إثبات بصري + طلب ── */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-3">
              الفرق واضح — قبل وبعد
            </h2>
            <p className="text-sm md:text-base text-brand-muted">
              نتيجة من بيوت سعودية جرّبت المنتج.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-start max-w-4xl mx-auto">
            <div className="card overflow-hidden border border-brand-border">
              <StoreImageFrame
                src={config.beforeSectionImage ?? productImageSrc}
                alt={config.beforeSectionImageAlt ?? config.beforeLabel}
                aspect={config.beforeSectionAspect}
                imageClassName={beforeAfterImageClass(true)}
                sizes={STORE_IMAGE_SIZES.section}
              />
              <div className="p-4 text-center bg-white">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  قبل
                </span>
                <p className="text-sm font-bold text-brand-muted mt-2">{config.beforeLabel}</p>
              </div>
            </div>
            <div className="card overflow-hidden border-2 border-brand-trust/40">
              <StoreImageFrame
                src={config.afterSectionImage ?? productImageSrc}
                alt={config.afterSectionImageAlt ?? config.afterLabel}
                aspect={config.afterSectionAspect}
                imageClassName={beforeAfterImageClass()}
                sizes={STORE_IMAGE_SIZES.section}
              />
              <div className="p-4 text-center bg-brand-surface">
                <span className="text-xs font-bold text-white bg-brand-trust px-2 py-0.5 rounded">
                  بعد
                </span>
                <p className="text-base font-extrabold text-brand-espresso mt-2">
                  {config.afterLabel}
                </p>
              </div>
            </div>
          </div>

          {!isUpsellPreview ? (
            <ProductOrderCta
              onAction={scrollToOffers}
              buttonLabel="اختر عرضك الآن"
              title="شفت الفرق؟ اطلب الآن"
              subtitle={`ابتداءً من ${minBundlePrice} ر.س — اختر العرض ثم أكمل الطلب بالدفع عند الاستلام.`}
            />
          ) : null}
        </div>
      </section>

      <ProductSpecsSection specs={specs} />

      <section className="cv-section page-x py-6 md:py-8 bg-white">
        <div className="max-w-content mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6">
            كيف تستخدمه؟
          </h2>
          <ol className="space-y-3">
            {config.howToUse.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-xl border border-brand-border/60 bg-brand-surface p-4"
              >
                <span className="w-10 h-10 rounded-full bg-brand-bronze text-white font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm md:text-base font-bold text-brand-espresso">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ProductComparisonTable />

      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center">
            آراء من اشتروا المنتج
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-start">
            {config.reviews.map((review, i) => (
              <ReviewCard
                key={`${review.name}-${i}`}
                {...review}
                dateLabel={reviewDateLabel(product.slug, i)}
              />
            ))}
          </div>

          {!isUpsellPreview ? (
            <ProductOrderCta
              onAction={scrollToOffers}
              buttonLabel="اختر عرضك الآن"
              title="انضم لعملاء متقن"
              subtitle={`ابتداءً من ${minBundlePrice} ر.س — اختر العرض المناسب ثم أكمل الطلب.`}
            />
          ) : null}
        </div>
      </section>

      <section className="cv-section py-6 md:py-8 page-x bg-white">
        <div className="max-w-content mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-2">
            أسئلة قبل الطلب
          </h2>
          <p className="text-sm text-brand-muted text-center mb-6">
            إجابات واضحة عن الدفع، الاتصال، والتوصيل — بدون لبس.
          </p>
          <FAQAccordion items={allFaqs} />
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="cv-section page-x py-6 md:py-8 bg-brand-surface border-t border-brand-border/40">
          <div className="max-w-content mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-espresso text-center mb-6">
              قد يعجبك أيضاً
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {!isUpsellPreview ? (
        <section className="cv-section page-x py-8 md:py-10 bg-brand-espresso">
          <div className="max-w-content mx-auto max-w-lg text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
              آخر خطوة — احجز طلبك الآن
            </h2>
            <p className="text-brand-sand/90 text-sm md:text-base leading-relaxed">
              ابتداءً من {minBundlePrice} ر.س
              <br />
              دفع عند الاستلام · تأكيد هاتفي · ضمان 30 يوم
            </p>
            <button
              type="button"
              onClick={scrollToOffers}
              className="btn-primary w-full min-h-[56px] text-lg font-bold flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-6 h-6" />
              اختر عرضك الآن
            </button>
          </div>
        </section>
      ) : null}

      <div className="h-20 md:h-6" aria-hidden />
    </div>
  );
}
