"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { StoreImage } from "@/components/ui/StoreImage";
import { Star, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { BundleSelector } from "@/components/product/BundleSelector";
import { ReviewCard } from "@/components/product/ReviewCard";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { ProductComparisonTable } from "@/components/product/ProductComparisonTable";
import { ProductTrustStrip } from "@/components/product/ProductTrustStrip";
import { ProductCard } from "@/components/commerce/ProductCard";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { PRODUCT_PRIMARY_CTA } from "@/lib/product-cta";
import { reviewDateLabel } from "@/lib/product-review-dates";
import type { ProductBundle } from "@/types";
import { getProduct, toProduct } from "@/config/catalog";
import { getProductImageSrc, getProductMainImageSrc } from "@/lib/product-image";
import { cn } from "@/lib/utils";

const PORTRAIT_HERO_SLUGS = new Set(["smart-stackable-cabinet"]);

function isPortraitAspect(aspect?: string): boolean {
  if (!aspect) return false;
  const [w, h] = aspect.split("/").map(Number);
  return w > 0 && h > 0 && w < h;
}

function beforeAfterImageClass(aspect?: string, muted?: boolean): string {
  return cn(
    isPortraitAspect(aspect) ? "object-contain object-center" : "object-cover object-center",
    muted && "opacity-90 grayscale-[20%]",
  );
}

function beforeAfterFrameClass(aspect?: string): string {
  return cn(
    "relative bg-brand-beige w-full",
    isPortraitAspect(aspect) && "mx-auto max-w-[22rem]",
  );
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
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-md border border-brand-border w-full",
        !aspect && "aspect-[4/3] bg-brand-beige",
        className,
      )}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <StoreImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center"
        priority={priority}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}

interface ProductPageClientProps {
  /** Full PDP embedded in post-purchase offer — no modal overlay, no duplicate sticky bar */
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
  const { addItem, openCart } = useCart();
  const defaultBundle = product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);
  const [imgError, setImgError] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<HTMLDivElement>(null);
  const productImageSrc = getProductImageSrc(product.slug);
  const mainImageSrc = getProductMainImageSrc(product.slug);
  const heroImageSrc = config.heroSectionImage ?? productImageSrc;
  const portraitHero = PORTRAIT_HERO_SLUGS.has(product.slug) || !!config.heroSectionImage;

  const reviewCount =
    1050 +
    (product.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 950);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    firePixelEvent({
      eventId: generateEventId("view_content"),
      eventName: "ViewContent",
      value: selectedBundle.price_sar,
      currency: "SAR",
      productSlug: product.slug,
      productName: product.name_ar,
    });
  }, []);

  const scrollToOffers = useCallback(() => {
    bundleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleAddToCart = useCallback(() => {
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

    openCart();
  }, [addItem, openCart, product, selectedBundle, isUpsellPreview]);

  const relatedProducts = config.crossSellSlugs
    .map((slug) => {
      const p = getProduct(slug);
      return p ? toProduct(p) : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const savingsVsCompare =
    selectedBundle.compare_at_price_sar &&
    selectedBundle.compare_at_price_sar > selectedBundle.price_sar
      ? selectedBundle.compare_at_price_sar - selectedBundle.price_sar
      : null;

  return (
    <div className="bg-brand-background pb-4">
      {/* Sticky CTA — hidden when embedded in order-offer preview */}
      {!isUpsellPreview ? (
      <div
        aria-hidden={!showSticky}
        className={cn(
          "fixed bottom-0 inset-x-0 z-40 bg-brand-surface border-t border-brand-border p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out",
          showSticky ? "translate-y-0 pointer-events-auto" : "translate-y-full pointer-events-none",
        )}
      >
        <div className="max-w-content mx-auto flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-brand-beige border border-brand-border flex-shrink-0 hidden sm:block">
            <StoreImage
              src={mainImageSrc}
              alt={product.name_ar}
              fill
              sizes="40px"
              className="object-cover"
              onError={() => { if (!imgError) setImgError(true); }}
            />
          </div>
          <button
            type="button"
            onClick={scrollToOffers}
            className="btn-primary flex-1 min-h-[48px] md:min-h-[52px] flex items-center justify-center gap-2 px-4 text-sm md:text-base font-bold"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="truncate">{PRODUCT_PRIMARY_CTA}</span>
          </button>
        </div>
      </div>
      ) : null}

      {/* 1. Hero — above the fold */}
      <section className="page-x pt-2 md:pt-4 pb-4 md:pb-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-start">
            <div
              ref={imageRef}
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-md",
                portraitHero
                  ? cn(
                      "w-full",
                      config.heroSectionImage ? "" : "aspect-[2/3] bg-white",
                    )
                  : "aspect-square max-h-[min(72vh,28rem)] md:max-h-none bg-brand-beige",
              )}
              style={
                config.heroSectionImage
                  ? { aspectRatio: config.heroSectionAspect ?? "3/4" }
                  : undefined
              }
            >
              <StoreImage
                src={heroImageSrc}
                alt={config.heroSectionImageAlt ?? config.heroImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn(
                  config.heroSectionImage || !portraitHero
                    ? "object-cover object-center"
                    : "object-contain p-2 md:p-4",
                )}
                priority
                onError={() => { if (!imgError) setImgError(true); }}
              />
            </div>

            <div className="md:sticky md:top-[4.25rem] space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs md:text-sm font-bold text-brand-espresso">
                  4.9 · (+{reviewCount.toLocaleString()} مراجعة)
                </span>
              </div>

              <h1
                id="product-heading"
                className="text-2xl md:text-4xl font-extrabold text-brand-espresso leading-tight scroll-mt-20"
              >
                {product.name_ar}
              </h1>

              <p className="text-sm md:text-base text-brand-muted leading-relaxed">
                {config.shortPromise}
              </p>

              <div className="flex items-baseline gap-2 flex-wrap py-1">
                <span className="text-2xl md:text-3xl font-black text-brand-espresso tabular-nums">
                  {selectedBundle.price_sar}{" "}
                  <span className="text-base font-bold">ر.س</span>
                </span>
                {selectedBundle.compare_at_price_sar ? (
                  <span className="text-sm text-red-500 line-through tabular-nums">
                    {selectedBundle.compare_at_price_sar} ر.س
                  </span>
                ) : null}
                {savingsVsCompare ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    وفّر {savingsVsCompare} ر.س
                  </span>
                ) : null}
              </div>

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
                onClick={handleAddToCart}
                className="btn-primary w-full min-h-[52px] md:min-h-[56px] rounded-2xl text-base md:text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#1B4DDB]/20"
              >
                <ShoppingBag className="w-5 h-5" />
                {PRODUCT_PRIMARY_CTA}
              </button>

              <ProductTrustStrip variant="hero" />
            </div>
          </div>
        </div>
      </section>

      <ProductTrustStrip variant="bar" />

      {/* 2. Problem */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          <SectionImage
            src={config.painSectionImage ?? productImageSrc}
            alt={config.painSectionImageAlt ?? "المشكلة اليومية"}
            aspect={config.painSectionAspect}
          />
          <div className="space-y-4 text-start">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              هل تعاني من هذه المشكلة يومياً؟
            </h2>
            <p className="text-base md:text-lg text-brand-muted leading-relaxed">
              {config.problemStatement}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Solution */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-4 text-start md:order-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {config.heroAngle}
            </h2>
            <p className="text-base md:text-lg text-brand-muted leading-relaxed">
              منتج متقن صُمم ليحل المشكلة بسرعة — بدون تعقيد أو أدوات إضافية.
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

      {/* 4. Benefits */}
      <section className="cv-section product-section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6 md:mb-8">
            لماذا ستحب هذا المنتج؟
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {config.lifestyleSectionImage ? (
              <SectionImage
                src={config.lifestyleSectionImage}
                alt={config.lifestyleSectionImageAlt ?? product.name_ar}
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
                  className="flex items-start gap-3 card p-4 border-brand-border/60"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-trust flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base font-bold text-brand-espresso leading-snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Before / After */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-3">
              شوف الفرق بنفسك — قبل وبعد
            </h2>
            <p className="text-sm md:text-base text-brand-muted">
              نتيجة حقيقية من بيوت سعودية استخدمت المنتج.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-8 items-start max-w-4xl mx-auto">
            <div className="card overflow-hidden border border-brand-border">
              <div
                className={cn(
                  beforeAfterFrameClass(config.beforeSectionAspect),
                  !config.beforeSectionAspect &&
                    (config.beforeSectionImage ? "aspect-[717/1024]" : "aspect-[4/3]"),
                )}
                style={
                  config.beforeSectionImage && config.beforeSectionAspect
                    ? { aspectRatio: config.beforeSectionAspect }
                    : undefined
                }
              >
                <StoreImage
                  src={config.beforeSectionImage ?? productImageSrc}
                  alt={config.beforeSectionImageAlt ?? config.beforeLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className={beforeAfterImageClass(config.beforeSectionAspect, true)}
                  loading="lazy"
                />
              </div>
              <div className="p-4 text-center bg-white">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                  قبل
                </span>
                <p className="text-sm font-bold text-brand-muted mt-2">{config.beforeLabel}</p>
              </div>
            </div>
            <div className="card overflow-hidden border-2 border-brand-trust/40 shadow-md">
              <div
                className={cn(
                  beforeAfterFrameClass(config.afterSectionAspect),
                  !config.afterSectionAspect &&
                    (config.afterSectionImage ? "aspect-[898/1024]" : "aspect-[4/3]"),
                )}
                style={
                  config.afterSectionImage && config.afterSectionAspect
                    ? { aspectRatio: config.afterSectionAspect }
                    : undefined
                }
              >
                <StoreImage
                  src={config.afterSectionImage ?? productImageSrc}
                  alt={config.afterSectionImageAlt ?? config.afterLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className={beforeAfterImageClass(config.afterSectionAspect)}
                  loading="lazy"
                />
              </div>
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
        </div>
      </section>

      {/* 6. Features — comparison */}
      <ProductComparisonTable />

      {/* 7. How it works */}
      <section className="cv-section page-x py-8 md:py-10 bg-white">
        <div className="max-w-content mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6">
            كيف تستخدمه؟
          </h2>
          <ol className="space-y-3">
            {config.howToUse.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 card p-4 border-brand-border/60"
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

      {/* 8. Reviews */}
      <section className="cv-section product-section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6 md:mb-8">
            آراء عملاء اشتروا المنتج
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
        </div>
      </section>

      {/* Cross-sell — before FAQ */}
      {relatedProducts.length > 0 && (
        <section className="cv-section page-x py-8 md:py-10 bg-white border-y border-brand-border/40">
          <div className="max-w-content mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-espresso text-center mb-6">
              العملاء الذين اشتروا هذا المنتج اشتروا أيضاً
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FAQ */}
      <section className="cv-section py-8 md:py-10 page-x bg-brand-surface">
        <div className="max-w-content mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-6">
            أسئلة شائعة
          </h2>
          <FAQAccordion items={config.faqs} />
        </div>
      </section>

      {/* 10. Final CTA */}
      <section className="cv-section page-x py-10 md:py-14 bg-brand-espresso">
        <div className="max-w-content mx-auto max-w-lg text-center space-y-5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
            جاهز تطلب؟ الدفع عند الاستلام فقط
          </h2>
          <p className="text-brand-sand/90 text-sm md:text-base leading-relaxed">
            نؤكد طلبك هاتفياً قبل الشحن — بدون بطاقة ولا دفع مقدم.
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-primary w-full min-h-[56px] text-lg font-bold flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-6 h-6" />
            {PRODUCT_PRIMARY_CTA}
          </button>
          <p className="text-xs text-brand-sand/80 font-medium">
            ضمان 30 يوم · شحن سريع · تأكيد قبل الشحن · دعم واتساب
          </p>
        </div>
      </section>

      <div className="h-20 md:h-6" aria-hidden />
    </div>
  );
}
