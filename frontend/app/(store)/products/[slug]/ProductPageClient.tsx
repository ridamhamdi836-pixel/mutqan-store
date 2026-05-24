"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, CheckCircle2, Truck, CreditCard, ShieldCheck, ThumbsUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/providers/cart-provider";
import { BundleSelector } from "@/components/product/BundleSelector";
import { ReviewCard } from "@/components/product/ReviewCard";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { ProductCard } from "@/components/commerce/ProductCard";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import type { ProductBundle } from "@/types";
import { getProductImageSrc } from "@/lib/product-image";

// Minimal cross-sell products data for related section
const CROSS_SELL_PRODUCTS: Record<string, { id: string; slug: string; name_ar: string; name_en: string; short_description_ar: string; category_slug: string; bundles: ProductBundle[] }> = {
  "pull-out-cabinet-drawer": { id: "p3", slug: "pull-out-cabinet-drawer", name_ar: "درج الخزانة المنزلق", name_en: "", short_description_ar: "حل ذكي لتنظيم الخزائن المزدحمة.", category_slug: "home-organization", bundles: [{ id: "d4", label_ar: "4 قطع - الأكثر اختيارًا", quantity: 4, price_sar: 599, compare_at_price_sar: 698, is_default: true, sort_order: 1 }] },
  "magic-under-sink-organizer": { id: "p4", slug: "magic-under-sink-organizer", name_ar: "منظّم المغسلة السحري", name_en: "", short_description_ar: "ترتيب ذكي تحت المغسلة.", category_slug: "home-organization", bundles: [{ id: "s2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 379, compare_at_price_sar: 458, is_default: true, sort_order: 1 }] },
  "pure-faucet-filter": { id: "p5", slug: "pure-faucet-filter", name_ar: "فلتر الصنبور النقي", name_en: "", short_description_ar: "تجربة ماء يومية أفضل.", category_slug: "modern-kitchen", bundles: [{ id: "f2", label_ar: "قطعتين - أفضل قيمة", quantity: 2, price_sar: 249, is_default: true, sort_order: 1 }] },
  "smart-table-warmer": { id: "p6", slug: "smart-table-warmer", name_ar: "سخّان المائدة الذكي", name_en: "", short_description_ar: "طعام دافئ طوال الجلسة.", category_slug: "dining-hosting", bundles: [{ id: "w2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 449, is_default: true, sort_order: 1 }] },
  "thermal-lunch-box": { id: "p7", slug: "thermal-lunch-box", name_ar: "حافظة الغداء الحرارية", name_en: "", short_description_ar: "وجبة دافئة أينما كنت.", category_slug: "dining-hosting", bundles: [{ id: "l2", label_ar: "قطعتين", quantity: 2, price_sar: 329, is_default: true, sort_order: 1 }] },
  "smart-stackable-cabinet": { id: "p2", slug: "smart-stackable-cabinet", name_ar: "الخزانة التراكمية الذكية", name_en: "", short_description_ar: "مساحة تخزين إضافية وأنيقة.", category_slug: "home-organization", bundles: [{ id: "c2", label_ar: "قطعتين", quantity: 2, price_sar: 599, is_default: true, sort_order: 1 }] },
  "powerful-cordless-vacuum": { id: "p1", slug: "powerful-cordless-vacuum", name_ar: "المكنسة اللاسلكية القوية", name_en: "", short_description_ar: "تنظيف سريع للمنزل والسيارة.", category_slug: "cleaning-care", bundles: [{ id: "v2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 399, is_default: true, sort_order: 1 }] },
};

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
    benefits: string[];
    beforeLabel: string;
    afterLabel: string;
    howToUse: string[];
    crossSellSlugs: string[];
    reviews: Array<{ name: string; city: string; rating: number; text: string }>;
    faqs: Array<{ question: string; answer: string }>;
  };
}

export function ProductPageClient({ product, config }: ProductPageClientProps) {
  const { addItem, openCart } = useCart();
  const defaultBundle = product.bundles.find((b) => b.is_default) || product.bundles[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);
  const [imgError, setImgError] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<HTMLDivElement>(null);
  const productImageSrc = getProductImageSrc(product.slug);
  
  // Generate deterministic random review count above 1000 based on product slug
  const reviewCount = 1050 + (product.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 950);

  // Intersection Observer for sticky CTA
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when product image is out of view
        setShowSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  // Fire ViewContent on mount
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
    .map((slug) => CROSS_SELL_PRODUCTS[slug])
    .filter(Boolean);

  return (
    <div className="bg-brand-background pb-20">
      {/* Sticky CTA - scrolls to bundle section */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed bottom-0 inset-x-0 z-40 bg-brand-surface/95 backdrop-blur-md border-t border-brand-border p-3 md:p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="max-w-content mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="hidden md:block relative w-10 h-10 rounded-lg overflow-hidden bg-brand-beige border border-brand-border flex-shrink-0">
                  <Image
                    src={productImageSrc}
                    alt={product.name_ar}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => { if (!imgError) setImgError(true); }}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-espresso">{product.name_ar}</p>
                  <p className="text-xs text-brand-muted">ابتداءً من {selectedBundle.price_sar} ر.س</p>
                </div>
              </div>
              <button
                onClick={() => bundleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                className="btn-primary flex items-center gap-2 px-6 md:px-8 justify-center shadow-lg py-3"
              >
                <span className="font-bold text-sm md:text-base">اختر عرضك الآن</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Hero */}
      <section className="section-pad page-x pb-6">
        <div className="max-w-content mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Image */}
            <div ref={imageRef} className="relative aspect-square rounded-2xl overflow-hidden bg-brand-beige shadow-md">
              <Image
                src={productImageSrc}
                alt={config.heroImageAlt}
                fill
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                onError={() => { if (!imgError) setImgError(true); }}
              />
              {/* Trust overlay on image */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs font-bold text-brand-espresso">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9/5 تقييم العملاء</span>
              </div>
            </div>

            {/* Info */}
            <div className="md:sticky md:top-24 space-y-6">
              {/* Breadcrumb */}
              <nav className="text-xs text-brand-muted flex items-center gap-1.5">
                <Link href="/" className="hover:text-brand-espresso">الرئيسية</Link>
                <span>/</span>
                <Link href="/collections" className="hover:text-brand-espresso">المنتجات</Link>
                <span>/</span>
                <span className="text-brand-espresso font-medium">{product.name_ar}</span>
              </nav>

              {/* Stars & Social Proof */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-medium text-brand-espresso mr-1">(+{reviewCount.toLocaleString()} مراجعة موثقة)</span>
                <span className="hidden sm:inline-block text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">🔥 طلب عالي اليوم</span>
              </div>

              <h1 id="product-heading" className="text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight scroll-mt-24">
                {product.name_ar}
              </h1>

              <p className="text-lg text-brand-muted leading-relaxed font-medium">
                {config.shortPromise}
              </p>

              {/* Enhanced Trust Signals */}
              <div className="bg-brand-surface p-4 rounded-xl border border-brand-bronze/20 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm font-bold text-brand-espresso">
                  <ShieldCheck className="w-5 h-5 text-brand-trust" />
                  ضمان ذهبي 30 يوم - استرجاع بدون أسئلة معقدة
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-brand-espresso">
                  <CheckCircle2 className="w-5 h-5 text-brand-trust" />
                  أكثر من +50,000 عائلة سعودية تثق في متقن
                </div>
              </div>

              {/* Bundle Selector */}
              <div ref={bundleRef} id="bundle-section" className="scroll-mt-24">
                <p className="text-base font-bold text-brand-espresso mb-3">اختر الكمية المناسبة:</p>
                <BundleSelector
                  bundles={product.bundles}
                  selectedId={selectedBundle.id}
                  onSelect={(b) => setSelectedBundle(b)}
                />
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full h-14 md:h-16 rounded-2xl text-base md:text-lg font-bold flex items-center justify-center gap-3 bg-[#1B4DDB] hover:bg-[#1640B5] text-white shadow-lg shadow-[#1B4DDB]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
                >
                  اطلبي الآن · {selectedBundle.price_sar} ر.س
                </button>
                <p className="text-xs text-center text-brand-muted font-medium">
                  الدفع عند الاستلام · بدون دفع أونلاين
                </p>
              </div>

              {/* Payment chips */}
              <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-brand-border/50">
                {[
                  { icon: CreditCard, label: "الدفع عند الاستلام متاح" },
                  { icon: ShieldCheck, label: "تأكيد الطلب قبل الشحن" },
                  { icon: ThumbsUp, label: "ضمان الرضا 100%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-brand-muted font-bold">
                    <item.icon className="w-4 h-4 text-brand-trust" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Authority Bar */}
      <div className="bg-brand-espresso text-brand-surface py-4 my-6">
        <div className="max-w-content mx-auto page-x flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm font-bold text-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>منتجات مختارة لبيوت الخليج</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-bronze"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-trust" />
            <span>ضمان ذهبي للاستبدال والاسترجاع</span>
          </div>
          <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-brand-bronze"></div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-trust" />
            <span>ادفع براحتك عند الاستلام</span>
          </div>
        </div>
      </div>

      {/* Alternating Problem/Solution Feature Sections */}
      <section className="section-pad page-x bg-white overflow-hidden">
        <div className="max-w-content mx-auto space-y-16 md:space-y-24">
          
          {/* Section 1: The Pain Point (Image Left, Text Right) */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-brand-border">
                <Image
                  src={`https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80`}
                  alt="مشكلة الفوضى اليومية"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 order-2 space-y-5 text-right">
              <h2 className="text-3xl font-extrabold text-brand-espresso">
                شعور الفوضى يسرق من راحتك ووقتك؟
              </h2>
              <p className="text-lg text-brand-muted leading-relaxed">
                {config.problemStatement}
              </p>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-4">
                <p className="text-red-800 font-medium text-sm">
                  نعلم أن ضيق الوقت وكثرة المهام في البيت السعودي تجعل الترتيب عبئاً يومياً مزعجاً. لكن ماذا لو كان الحل بسيطاً ولا يحتاج جهداً؟
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: The Solution (Image Right, Text Left) */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-brand-border">
                <Image
                  src={`https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80`}
                  alt="الحل العملي من متقن"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 order-2 md:order-1 space-y-5 text-right">
              <h2 className="text-3xl font-extrabold text-brand-espresso">
                {config.heroAngle}
              </h2>
              <p className="text-lg text-brand-muted leading-relaxed">
                وفرنا لك في متقن هذا المنتج ليكون حلك السحري. لن تعاني بعد اليوم، ستحصلين على الراحة والترتيب الذي يستحقه بيتك.
              </p>
              <ul className="space-y-3 mt-4">
                {config.benefits.slice(0, 3).map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-trust flex-shrink-0 mt-0.5" />
                    <span className="text-base text-brand-espresso font-bold">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: More Benefits (Image Left, Text Right) */}
          {config.benefits.length > 3 && (
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="w-full md:w-1/2 order-1">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-brand-border">
                  <Image
                    src={`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80`}
                    alt="مميزات إضافية"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 order-2 space-y-5 text-right">
                <h2 className="text-3xl font-extrabold text-brand-espresso">
                  مصمم خصيصاً ليناسب نمط حياتك
                </h2>
                <p className="text-lg text-brand-muted leading-relaxed">
                  تفاصيل صغيرة تصنع فرقاً كبيراً في استخدامك اليومي. راعينا أعلى معايير الجودة لتجربة تدوم طويلاً.
                </p>
                <ul className="space-y-3 mt-4">
                  {config.benefits.slice(3).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-brand-trust flex-shrink-0 mt-0.5" />
                      <span className="text-base text-brand-espresso font-bold">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Before/After with emotional touch */}
      <section className="section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-4">الفرق واضح ولا يحتاج تفكير</h2>
            <p className="text-lg text-brand-muted">انتقلي من الإزعاج والفوضى إلى الراحة التامة بخطوة واحدة بسيطة.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card overflow-hidden shadow-md border border-brand-border hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] relative bg-brand-beige">
                <Image
                  src={`https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80`}
                  alt={config.beforeLabel}
                  fill
                  className="object-cover opacity-90 grayscale-[20%]"
                />
              </div>
              <div className="p-5 flex flex-col items-center gap-3 bg-white text-center">
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">قبل الاستخدام</span>
                <p className="text-base font-bold text-brand-muted">{config.beforeLabel}</p>
              </div>
            </div>
            <div className="card overflow-hidden shadow-xl border-2 border-brand-trust/50 hover:shadow-2xl transition-shadow scale-[1.02] md:scale-105 z-10">
              <div className="aspect-[4/3] relative bg-brand-beige">
                <Image
                  src={`https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80`}
                  alt={config.afterLabel}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-brand-trust text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> النتيجة المذهلة
                </div>
              </div>
              <div className="p-5 flex flex-col items-center gap-3 bg-brand-surface text-center">
                <span className="bg-brand-trust text-white px-3 py-1 rounded-full text-xs font-bold">بعد استخدام متقن</span>
                <p className="text-lg font-extrabold text-brand-espresso">{config.afterLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="section-pad page-x">
        <div className="max-w-content mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-4">بساطة الاستخدام هي سرنا</h2>
            <p className="text-lg text-brand-muted">لا حاجة لفنيين أو أدوات معقدة، يمكنك استخدامه بنفسك فور استلامه.</p>
          </div>
          <div className="grid gap-4">
            {config.howToUse.map((step, i) => (
              <div key={i} className="flex items-center gap-5 card p-5 hover:border-brand-bronze transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-bronze text-white font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  {i + 1}
                </div>
                <p className="text-lg text-brand-espresso font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle CTA */}
      <section className="py-16 page-x bg-brand-espresso relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        <div className="max-w-content mx-auto max-w-xl text-center relative z-10">
          <span className="inline-block bg-brand-bronze text-white text-xs font-bold px-3 py-1 rounded-full mb-4">الكمية محدودة جداً</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">اتخذي القرار لبيت أكثر راحة اليوم</h2>
          <p className="text-brand-sand/90 text-lg mb-8">اطلبي الآن، الدفع عند الاستلام والتأكيد خلال ساعات. لا تدعي الفوضى تسرق راحتك بعد الآن.</p>
          <button
            onClick={handleAddToCart}
            className="bg-brand-bronze text-white font-extrabold rounded-pill px-8 py-5 text-xl w-full hover:bg-brand-sand hover:text-brand-espresso transition-all flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
          >
            <ShoppingBag className="w-6 h-6" />
            أضف للسلة - {selectedBundle.price_sar} ر.س
          </button>
          <div className="flex items-center justify-center gap-4 mt-6 text-brand-sand/80 text-sm">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/> ضمان 30 يوم</div>
            <div className="w-1 h-1 bg-brand-sand/50 rounded-full"></div>
            <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4"/> دفع عند الاستلام</div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-pad page-x bg-brand-surface">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-4">انضمي لآلاف العائلات السعيدة</h2>
            <p className="text-lg text-brand-muted">أكثر من +50,000 عميل في السعودية يثقون في متقن يومياً.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {config.reviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* COD Reassurance */}
      <section className="section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-brand-espresso">تسوقي بأمان تام وموثوقية عالية</h2>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 page-x bg-brand-surface">
        <div className="max-w-content mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-brand-espresso mb-4">عندك استفسار؟ إجاباتنا واضحة</h2>
            <p className="text-brand-muted text-lg">كل ما تحتاجين معرفته لطلب مطمئن</p>
          </div>
          <FAQAccordion items={config.faqs} />
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section-pad page-x bg-white border-t border-brand-border/30">
          <div className="max-w-content mx-auto">
            <h2 className="text-3xl font-extrabold text-brand-espresso text-center mb-10">عززي راحة بيتك مع هذه المنتجات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final Sticky Mobile Ghost / Last space */}
      <div className="h-28 md:h-10 bg-white"></div>
    </div>
  );
}
