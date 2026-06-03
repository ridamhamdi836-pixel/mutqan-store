"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { Star, ShoppingBag, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/providers/cart-provider";
import { BundleSelector } from "@/components/product/BundleSelector";
import { ReviewCard } from "@/components/product/ReviewCard";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductCodStrip } from "@/components/product/ProductCodStrip";
import { ProductTrustChips } from "@/components/product/ProductTrustChips";
import { ProductStatsRow } from "@/components/product/ProductStatsRow";
import { StoreImage } from "@/components/ui/StoreImage";
import { ProductMediaFrame } from "@/components/product/ProductMediaFrame";
import { ProductSpecsSection } from "@/components/product/ProductSpecsSection";
import { ProductFinalCta } from "@/components/product/ProductFinalCta";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import type { ProductBundle } from "@/types";
import { getProduct, toProduct } from "@/config/catalog";
import { getProductImageSrc, getProductMainImageSrc } from "@/lib/product-image";
import { mergeProductFaqs, DEFAULT_PAIN_HEADLINE } from "@/config/product-page";
import { PRODUCT_SPECS } from "@/config/product-specs";
import { cn } from "@/lib/utils";

const PORTRAIT_HERO_SLUGS = new Set(["smart-stackable-cabinet"]);

function isPortraitAspect(aspect?: string): boolean {
  if (!aspect) return false;
  const [w, h] = aspect.split("/").map(Number);
  return w > 0 && h > 0 && w < h;
}

interface ProductPageClientProps {
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

export function ProductPageClient({ product, config }: ProductPageClientProps) {
  const { addItem, openCart } = useCart();
  const defaultBundle =
    product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);
  const [showSticky, setShowSticky] = useState(false);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  const productImageSrc = getProductImageSrc(product.slug);
  const mainImageSrc = getProductMainImageSrc(product.slug);
  const heroImageSrc = config.heroSectionImage ?? productImageSrc;
  const portraitHero =
    PORTRAIT_HERO_SLUGS.has(product.slug) || !!config.heroSectionImage;

  const reviewCount =
    1050 +
    (product.slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 950);

  const featuredReview =
    config.reviews.find((r) => r.photo) ?? config.reviews[0];
  const otherReviews = config.reviews.filter((r) => r !== featuredReview);
  const faqs = useMemo(() => mergeProductFaqs(config.faqs), [config.faqs]);
  const specs = PRODUCT_SPECS[product.slug];

  const scrollToBuy = useCallback(() => {
    const el = document.getElementById("product-heading");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
    );
    if (buyBoxRef.current) observer.observe(buyBoxRef.current);
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

  const handleAddToCart = () => {
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
  };

  const relatedProducts = config.crossSellSlugs
    .map((slug) => {
      const p = getProduct(slug);
      return p ? toProduct(p) : null;
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const heroImageClass = cn(
    config.heroSectionImage
      ? isPortraitAspect(config.heroSectionAspect)
        ? "object-contain object-center p-2 md:p-4"
        : "object-cover object-center"
      : portraitHero
        ? "object-contain p-3 md:p-5"
        : "object-cover object-center",
  );

  return (
    <div className="bg-brand-background pb-20 md:pb-8">
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border shadow-[0_-8px_30px_rgba(0,0,0,0.08)] p-3 md:pb-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="max-w-content mx-auto flex items-center gap-3">
              <button
                type="button"
                onClick={scrollToBuy}
                className="flex items-center gap-2 min-w-0 flex-1 text-start"
              >
                <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-brand-beige border border-brand-border shrink-0">
                  <StoreImage
                    src={mainImageSrc}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-brand-espresso truncate">
                    {product.name_ar}
                  </p>
                  <p className="text-xs text-brand-muted">
                    من {selectedBundle.price_sar} ر.س · COD
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-primary shrink-0 px-5 py-3 text-sm font-bold shadow-lg"
              >
                اطلب · {selectedBundle.price_sar} ر.س
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1 — Hero + buy box */}
      <section className="page-x pt-4 md:pt-8 pb-8">
        <div className="max-w-content mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="w-full">
              <ProductMediaFrame
                src={heroImageSrc}
                alt={config.heroSectionImageAlt ?? config.heroImageAlt}
                aspect={config.heroSectionAspect ?? (portraitHero ? "4/5" : "1/1")}
                priority
                imageClassName={heroImageClass}
                className={cn(
                  portraitHero && !config.heroSectionAspect && "!aspect-[4/5]",
                )}
              />
            </div>

            <div ref={buyBoxRef} className="lg:sticky lg:top-20 space-y-5">
              <nav className="text-xs text-brand-muted flex flex-wrap items-center gap-1.5">
                <Link href="/" className="hover:text-brand-espresso">
                  الرئيسية
                </Link>
                <span>/</span>
                <Link href="/collections" className="hover:text-brand-espresso">
                  المنتجات
                </Link>
              </nav>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-brand-espresso">
                  {reviewCount.toLocaleString("ar-SA")}+ تقييم
                </span>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-pill">
                  طلبات نشطة اليوم
                </span>
              </div>

              <h1
                id="product-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-espresso leading-tight scroll-mt-20"
              >
                {product.name_ar}
              </h1>

              <p className="text-base md:text-lg text-brand-muted leading-relaxed font-medium">
                {config.shortPromise}
              </p>

              <ProductTrustChips />

              {featuredReview && (
                <ReviewCard {...featuredReview} variant="compact" />
              )}

              <ProductCodStrip />

              <div id="bundle-section" className="scroll-mt-24">
                <BundleSelector
                  bundles={product.bundles}
                  selectedId={selectedBundle.id}
                  onSelect={setSelectedBundle}
                />
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-14 md:h-[60px] rounded-2xl text-base md:text-lg font-extrabold flex items-center justify-center gap-2 bg-[#1B4DDB] hover:bg-[#1640B5] text-white shadow-lg shadow-[#1B4DDB]/20 active:scale-[0.98] transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                اطلب الآن · {selectedBundle.price_sar} ر.س
              </button>
              <p className="text-center text-xs text-brand-muted font-medium">
                بدون دفع أونلاين — نتصل لتأكيد العنوان قبل الشحن
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Trust (full) */}
      <section className="page-x pb-10">
        <div className="max-w-content mx-auto space-y-6">
          <ProductStatsRow />
          <div className="text-center">
            <h2 className="text-xl font-bold text-brand-espresso mb-4">
              تسوقي براحة — COD للسعودية
            </h2>
            <TrustBadges />
          </div>
        </div>
      </section>

      {/* 3 — Pain */}
      <section className="page-x py-10 md:py-14 bg-white">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <ProductMediaFrame
            src={config.painSectionImage ?? productImageSrc}
            alt={config.painSectionImageAlt ?? "المشكلة اليومية"}
            aspect={config.painSectionAspect}
            imageClassName="object-cover"
          />
          <div className="space-y-4 text-start">
            <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-pill">
              المشكلة
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {DEFAULT_PAIN_HEADLINE}
            </h2>
            <p className="text-brand-muted text-base md:text-lg leading-relaxed">
              {config.problemStatement}
            </p>
            <ul className="space-y-2 text-sm font-medium text-brand-espresso">
              <li className="flex gap-2">
                <span className="text-red-500">●</span>
                وقت ضايع كل يوم على فوضى صغيرة
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">●</span>
                حلول معقدة ما تناسب روتين البيت
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">●</span>
                تعب من منتجات وعودها طويلة
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4 — Solution + all benefits */}
      <section className="page-x py-10 md:py-14 bg-brand-beige/40">
        <div className="max-w-content mx-auto grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4 text-start md:order-2">
            <span className="text-xs font-bold text-brand-trust bg-brand-trust/10 px-3 py-1 rounded-pill">
              الحل من متقن
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso">
              {config.heroAngle}
            </h2>
            <p className="text-brand-muted leading-relaxed">
              مصمم لبيت سعودي مشغول — تركيب بسيط ونتيجة تحسّينها من أول استخدام، مو بعد أسابيع.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {config.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 bg-white rounded-xl p-3 border border-brand-border/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-trust shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-brand-espresso">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:order-1">
            <ProductMediaFrame
              src={config.solutionSectionImage ?? productImageSrc}
              alt={config.solutionSectionImageAlt ?? "الحل"}
              aspect={config.solutionSectionAspect}
              imageClassName="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 5 — Before / after */}
      <section className="page-x py-10 md:py-14">
        <div className="max-w-content mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-2">
              الفرق من أول استخدام
            </h2>
            <p className="text-brand-muted">
              مو وعد بعيد — ترتيب وراحة تحسّينها اليوم في بيتك.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="card overflow-hidden">
              <ProductMediaFrame
                src={config.beforeSectionImage ?? productImageSrc}
                alt={config.beforeSectionImageAlt ?? config.beforeLabel}
                aspect={config.beforeSectionAspect ?? "4/5"}
                className="!min-h-[280px] md:!min-h-[340px] !rounded-b-none !border-b-0"
                imageClassName="object-cover opacity-95"
              />
              <div className="p-4 text-center bg-white">
                <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-pill">
                  قبل
                </span>
                <p className="font-bold text-brand-muted mt-2">{config.beforeLabel}</p>
              </div>
            </div>
            <div className="card overflow-hidden border-2 border-brand-trust/40 shadow-lg">
              <div className="relative">
                <ProductMediaFrame
                  src={config.afterSectionImage ?? productImageSrc}
                  alt={config.afterSectionImageAlt ?? config.afterLabel}
                  aspect={config.afterSectionAspect ?? "4/5"}
                  className="!min-h-[280px] md:!min-h-[340px] !rounded-b-none !border-b-0"
                  imageClassName="object-cover"
                />
                <span className="absolute top-3 start-3 bg-brand-trust text-white text-xs font-bold px-3 py-1 rounded-pill">
                  بعد متقن
                </span>
              </div>
              <div className="p-4 text-center bg-brand-surface">
                <p className="font-extrabold text-brand-espresso text-lg">
                  {config.afterLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Specs */}
      {specs && (
        <ProductSpecsSection
          title={specs.title}
          lead={specs.lead}
          items={specs.items}
        />
      )}

      {/* 7 — How to use */}
      <section className="page-x py-10 md:py-12 bg-brand-surface">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-2">
            جاهز من أول يوم
          </h2>
          <p className="text-center text-brand-muted mb-8">
            خطوات بسيطة — بدون فني ولا تعقيد.
          </p>
          <ol className="space-y-3">
            {config.howToUse.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 items-center card p-4 md:p-5"
              >
                <span className="w-10 h-10 rounded-full bg-brand-bronze text-white font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="font-bold text-brand-espresso">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 — Reviews */}
      <section className="page-x py-10 md:py-14 bg-white">
        <div className="max-w-content mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso mb-2">
              عملاء من الرياض وجدة والدمام
            </h2>
            <p className="text-brand-muted">
              تقييمات حقيقية — كثير منهم ردّوا على اتصال التأكيد واستلموا الطلب.
            </p>
          </div>
          {featuredReview?.photo && (
            <ReviewCard {...featuredReview} variant="featured" />
          )}
          <div className="grid md:grid-cols-2 gap-5">
            {otherReviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* 9 — Mid CTA */}
      <ProductFinalCta
        productName={product.name_ar}
        bundles={product.bundles}
        selectedBundle={selectedBundle}
        onSelectBundle={setSelectedBundle}
        onAddToCart={handleAddToCart}
      />

      {/* 10 — FAQ */}
      <section className="page-x py-10 md:py-14 bg-brand-surface">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-espresso text-center mb-8">
            أسئلة قبل الطلب
          </h2>
          <FAQAccordion items={faqs} />
        </div>
      </section>

      {/* 11 — Cross-sell */}
      {relatedProducts.length > 0 && (
        <section className="page-x py-10 border-t border-brand-border/40">
          <div className="max-w-content mx-auto">
            <h2 className="text-xl md:text-2xl font-extrabold text-brand-espresso text-center mb-6">
              يكمل طلبك — نفس الشحنة COD
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
