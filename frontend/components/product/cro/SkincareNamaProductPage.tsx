"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Star,
  Check,
  X,
  ArrowUp,
  FlaskConical,
  Quote,
  Stethoscope,
  Heart,
  Phone,
  Package,
  Banknote,
  MapPin,
  ChevronLeft,
  BadgeCheck,
} from "lucide-react";
import { CroProductMedia } from "@/components/product/cro/CroProductMedia";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { TrustFeaturesStrip } from "@/components/trust/TrustFeaturesStrip";
import { StoreImage } from "@/components/ui/StoreImage";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { PRODUCT_COD_FAQS } from "@/lib/product-cod-faqs";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
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

  return (
    <div className="space-y-2.5" role="group" aria-label="اختر العرض">
      {sorted.map((bundle) => {
        const isSelected = bundle.id === selectedId;
        const isDefault = bundle.is_default;
        const parts = bundle.label_ar.split(" — ");
        const title = parts[0]?.trim() ?? bundle.label_ar;
        const subtitle = parts.slice(1).join(" — ").trim();

        let savings: string | null = null;
        if (bundle.compare_at_price_sar && bundle.compare_at_price_sar > bundle.price_sar) {
          savings = `وفّر ${bundle.compare_at_price_sar - bundle.price_sar} ر.س`;
        } else if (bundle.quantity > 1 && unitPrice * bundle.quantity > bundle.price_sar) {
          savings = `وفّر ${unitPrice * bundle.quantity - bundle.price_sar} ر.س`;
        } else if (bundle.savings_label_ar) {
          savings = bundle.savings_label_ar;
        }

        return (
          <button
            key={bundle.id}
            type="button"
            onClick={() => onSelect(bundle)}
            aria-pressed={isSelected}
            className={cn(
              "relative w-full flex items-center justify-between rounded-xl border-2 p-3.5 md:p-4 text-start transition-colors",
              isSelected
                ? "border-brand-forest bg-white shadow-[0_2px_12px_rgba(26,71,49,0.1)]"
                : "border-brand-border/60 bg-white hover:border-brand-forest/30",
            )}
          >
            {isDefault ? (
              <span className="absolute -top-2.5 end-4 bg-brand-gold text-white text-[10px] px-3 py-0.5 rounded-full font-bold shadow-sm">
                الأكثر اختياراً
              </span>
            ) : null}

            <div className="flex items-center gap-3 flex-1 min-w-0 pt-0.5">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-brand-forest" : "border-brand-muted/40",
                )}
              >
                {isSelected ? <div className="w-2.5 h-2.5 rounded-full bg-brand-forest" /> : null}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm md:text-[15px] text-brand-forest leading-snug">{title}</p>
                {subtitle ? (
                  <p className="text-xs text-brand-muted mt-0.5">{subtitle}</p>
                ) : null}
                {savings ? (
                  <p className="text-xs font-bold text-brand-gold mt-1">{savings}</p>
                ) : null}
              </div>
            </div>

            <div className="text-end shrink-0 ms-2">
              <p className="font-black text-lg md:text-xl text-brand-forest tabular-nums">
                {bundle.price_sar} <span className="text-xs font-bold">ر.س</span>
              </p>
              {bundle.compare_at_price_sar ? (
                <p className="text-[11px] text-brand-muted line-through tabular-nums">
                  {bundle.compare_at_price_sar} ر.س
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
  const [showSticky, setShowSticky] = useState(false);
  const heroOfferRef = useRef<HTMLDivElement>(null);

  const cardImageSrc = productConfig.heroSectionImage ?? "";
  const minPrice = Math.min(...product.bundles.map((b) => b.price_sar));

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

  useEffect(() => {
    const target = heroOfferRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
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

  const scrollToOffers = useCallback(() => {
    heroOfferRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div dir="rtl" lang="ar" className="bg-brand-background pb-24 md:pb-28">
      {/* Sticky CTA — Nama dark green bar */}
      {!isUpsellPreview && showSticky ? (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-brand-forest text-white shadow-[0_-4px_24px_rgba(0,0,0,0.2)]">
          <div className="max-w-content mx-auto flex items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="min-w-0 text-start hidden sm:block">
                <p className="text-xs font-semibold truncate opacity-95">{product.name_ar}</p>
                {selectedBundle.compare_at_price_sar ? (
                  <p className="text-[11px] opacity-75 tabular-nums">
                    بدل {selectedBundle.compare_at_price_sar} ر.س — {selectedBundle.price_sar} ر.س
                  </p>
                ) : (
                  <p className="text-[11px] opacity-75 tabular-nums">من {minPrice} ر.س</p>
                )}
              </div>
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 border border-white/20 shrink-0">
                <StoreImage
                  src={cardImageSrc}
                  alt={product.name_ar}
                  fill
                  variant="thumbnail"
                  sizes={STORE_IMAGE_SIZES.tiny}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToOffers}
              className="flex items-center gap-2 font-bold text-sm md:text-base shrink-0 hover:opacity-90 transition-opacity"
            >
              <ArrowUp className="w-4 h-4 shrink-0" />
              <span>
                {PAGE.stickyCtaVerb} · {selectedBundle.price_sar} ر.س
              </span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 1. Hero */}
      <section className="page-x pt-4 pb-6 md:pt-6 md:pb-10 bg-white">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Image first on mobile */}
            <div className="order-1 md:order-2 space-y-3">
              <CroProductMedia
                src={cardImageSrc}
                alt={productConfig.heroSectionImageAlt ?? product.name_ar}
                aspect="1/1"
                placeholder={product.name_ar}
                priority
                className="rounded-2xl border border-brand-border/30 shadow-[0_8px_32px_rgba(26,71,49,0.08)]"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PAGE.hero.imageBadges.map((badge) => (
                  <div
                    key={badge}
                    className="text-center rounded-lg bg-[#F5F0E8] border border-brand-border/40 py-2.5 px-2"
                  >
                    <p className="text-[11px] md:text-xs font-bold text-brand-forest leading-tight">{badge}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy */}
            <div className="order-2 md:order-1" ref={heroOfferRef}>
              <div className="flex items-center gap-2 mb-3">
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
                <span className="text-xs font-bold text-brand-forest">
                  {reviewStats.avg} · {reviewStats.count.toLocaleString("ar-SA")} تقييم موثق
                </span>
              </div>

              <h1
                id="product-heading"
                className="text-[1.65rem] md:text-[2.25rem] lg:text-[2.5rem] font-extrabold text-brand-forest leading-[1.2] mb-3 scroll-mt-20 text-start"
              >
                {PAGE.hero.headline}
              </h1>

              <p className="text-[15px] md:text-base text-brand-muted leading-[1.85] mb-4">
                {PAGE.hero.subheadline}
              </p>

              {PAGE.hero.urgencyLine ? (
                <p className="text-sm font-bold text-red-600 mb-4">{PAGE.hero.urgencyLine}</p>
              ) : null}

              <NamaBundleCards
                bundles={product.bundles}
                selectedId={selectedBundle.id}
                onSelect={setSelectedBundle}
              />

              {!isUpsellPreview ? (
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full bg-brand-forest text-white font-bold rounded-xl py-4 text-base md:text-lg shadow-[0_4px_20px_rgba(26,71,49,0.3)] hover:bg-[#143d2a] transition-colors"
                  >
                    {PAGE.stickyCtaVerb} — {selectedBundle.price_sar} ر.س
                  </button>
                  <p className="text-center text-xs text-brand-muted font-medium">
                    بدون دفع الآن · تأكيد هاتفي · دفع عند الاستلام
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar — dark green */}
      <section className="bg-brand-forest text-white py-5 md:py-6 page-x">
        <div className="max-w-content mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          {[
            { icon: Banknote, label: "الدفع عند الاستلام" },
            { icon: Package, label: "توصيل 2–5 أيام" },
            { icon: BadgeCheck, label: "ضمان 30 يوم" },
            { icon: FlaskConical, label: "عناية كورية أصلية" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon className="w-5 h-5 text-brand-gold" strokeWidth={1.75} />
              <p className="text-xs md:text-sm font-bold">{label}</p>
            </div>
          ))}
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

            <div className="order-1 md:order-2 relative">
              <CroProductMedia
                src={cardImageSrc}
                alt={product.name_ar}
                aspect="3/4"
                placeholder={product.name_ar}
                className="rounded-2xl"
              />
              <div className="absolute bottom-4 inset-x-4 rounded-xl bg-brand-forest text-white p-4 md:p-5">
                <p className="text-3xl md:text-4xl font-black text-brand-gold tabular-nums mb-1">
                  {PAGE.problemSection.statValue}
                </p>
                <p className="text-sm leading-relaxed opacity-95">{PAGE.problemSection.statText}</p>
                <p className="text-[10px] opacity-60 mt-2">{PAGE.problemSection.statSource}</p>
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
      <section className={cn("page-x py-12 md:py-16", CREAM_SECTION)}>
        <div className="max-w-content mx-auto space-y-12">
          <div className="rounded-2xl bg-[#EDE8DF] border border-brand-border/30 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-forest" />
              <h3 className="font-bold text-brand-forest text-lg">{PAGE.shipping.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {PAGE.shipping.cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1 rounded-full bg-white border border-brand-border/40 px-3 py-1.5 text-xs font-semibold text-brand-forest"
                >
                  <Check className="w-3 h-3 text-brand-forest" />
                  {city}
                </span>
              ))}
              <span className="inline-flex items-center rounded-full bg-brand-forest text-white px-3 py-1.5 text-xs font-bold">
                + كل المناطق
              </span>
            </div>
            <p className="text-xs text-brand-muted">{PAGE.shipping.note}</p>
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

      <TrustFeaturesStrip />
    </div>
  );
}
