"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { StoreImage, StoreImageFrame } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { HOMEPAGE_BEAUTY, HOMEPAGE_HERO_IMAGE } from "@/config/homepage-beauty";
import { getProduct, getProductPath } from "@/config/catalog";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";
import { getStorefrontProductNameAr } from "@/lib/storefront-product-names";
import { useCart } from "@/providers/cart-provider";

type SkincareProductSlug =
  | "vitamin-c-booster"
  | "ceramide-booster"
  | "pdrn-booster";

type SkincareCollection = {
  slug: string;
  nameAr: string;
  descriptionAr: string;
  badge: string;
  productSlugs: SkincareProductSlug[];
  isBundle?: boolean;
};

const PRODUCT_PRESENTATION: Record<
  SkincareProductSlug,
  { nameAr: string; subtitle: string; image: string; imageAlt: string }
> = Object.fromEntries(
  HOMEPAGE_BEAUTY.bestSellers.products.map((p) => [
    p.slug,
    {
      nameAr: p.nameAr,
      subtitle: p.description.split("—")[0]?.trim() ?? p.subtitle,
      image: p.image,
      imageAlt: p.imageAlt,
    },
  ]),
) as Record<
  SkincareProductSlug,
  { nameAr: string; subtitle: string; image: string; imageAlt: string }
>;

const SKINCARE_COLLECTIONS: SkincareCollection[] = [
  {
    slug: "glow",
    nameAr: "الإشراقة",
    descriptionAr: "توهج طبيعي وتوحيد لون البشرة — لثقة تبدأ من أول نظرة.",
    badge: "Glow",
    productSlugs: ["vitamin-c-booster"],
  },
  {
    slug: "repair",
    nameAr: "الإصلاح",
    descriptionAr: "إعادة بناء الحاجز وترطيب عميق — لبشرة هادئة ومريحة.",
    badge: "Repair",
    productSlugs: ["ceramide-booster"],
  },
  {
    slug: "youth",
    nameAr: "الشباب",
    descriptionAr: "مرونة وشد — لبشرة تشعرين أنها أكثر شباباً كل يوم.",
    badge: "Youth",
    productSlugs: ["pdrn-booster"],
  },
  {
    slug: "mutqan-sets",
    nameAr: "مجموعة متقن الكاملة",
    descriptionAr: "روتين متكامل — إشراقة، إصلاح، وشباب في خطوة واحدة لكل هدف.",
    badge: "الأفضل قيمة",
    productSlugs: ["vitamin-c-booster", "ceramide-booster", "pdrn-booster"],
    isBundle: true,
  },
];

function getSkincareCollectionBySlug(slug: string | undefined) {
  return SKINCARE_COLLECTIONS.find((collection) => collection.slug === slug);
}

export default function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const collection = getSkincareCollectionBySlug(slug);
  const [visibleSlugs, setVisibleSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/store-products")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.visibleCollectionSlugs)) {
          setVisibleSlugs(data.visibleCollectionSlugs);
        }
      })
      .catch(() => undefined);
  }, []);

  if (!collection) {
    return null;
  }

  const visibleProductSlugs = collection.productSlugs.filter(
    (productSlug) => !visibleSlugs || visibleSlugs.includes(productSlug),
  );

  return (
    <div className="bg-brand-background min-h-screen">
      <section className="page-x pt-8 pb-6 md:pt-12 md:pb-10">
        <div className="max-w-content mx-auto">
          <nav className="text-sm text-brand-muted mb-8">
            <Link href="/" className="hover:text-brand-espresso">
              الرئيسية
            </Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-brand-espresso">
              المجموعات
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-espresso font-medium">{collection.nameAr}</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs md:text-sm font-bold text-brand-espresso shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-gold" />
              {collection.badge}
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight">
              {collection.nameAr}
            </h1>
            <p className="mt-4 text-sm md:text-lg text-brand-muted leading-relaxed">
              {collection.descriptionAr}
            </p>
          </div>
        </div>
      </section>

      <section className="page-x pb-14 md:pb-20">
        <div className="max-w-content mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.isBundle ? (
              <CompleteBundleCard />
            ) : (
              visibleProductSlugs.map((productSlug) => (
                <SkincareProductCard key={productSlug} slug={productSlug} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SkincareProductCard({ slug }: { slug: SkincareProductSlug }) {
  const product = PRODUCT_PRESENTATION[slug];
  const catalogProduct = getProduct(slug);
  const minPrice = catalogProduct
    ? [...catalogProduct.bundles].sort((a, b) => a.price_sar - b.price_sar)[0]
        ?.price_sar
    : null;
  const reviewCount = getProductReviewDisplayCount(slug);

  return (
    <Link
      href={getProductPath(slug)}
      className="group block rounded-[1.25rem] bg-white border border-brand-border/60 overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)] card-lift transition-all duration-300 hover:border-brand-gold/30"
    >
      <div className="relative aspect-square min-h-[260px] sm:min-h-[300px] bg-gradient-to-b from-brand-secondary/40 to-brand-background overflow-hidden">
        <StoreImage
          src={product.image}
          alt={product.imageAlt}
          fill
          fit="contain"
          variant="default"
          sizes={STORE_IMAGE_SIZES.card}
          className="p-0 md:group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        <div className="absolute top-4 start-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso text-white text-[11px] font-bold tracking-wide shadow-md">
            الأكثر طلباً
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <CardRating reviewCount={reviewCount} />

        <h2 className="font-bold text-brand-espresso text-lg md:text-xl leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
          {product.nameAr}
        </h2>

        <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5 line-clamp-2">
          {product.subtitle}
        </p>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-brand-border/50">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-muted mb-1 font-medium">
              يبدأ من
            </p>
            {minPrice != null ? (
              <p className="font-extrabold text-brand-espresso text-2xl tracking-tight">
                {minPrice}{" "}
                <span className="text-sm font-bold text-brand-muted">ر.س</span>
              </p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-espresso text-white text-sm font-bold shadow-btn group-hover:bg-[#1a2744] transition-colors">
            <span>اكتشفي المنتج</span>
            <ArrowLeft className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CompleteBundleCard() {
  const reviewCount = getProductReviewDisplayCount("vitamin-c-booster");
  const { clearCart, addItem, openCheckout } = useCart();

  const handleOrderBundle = () => {
    clearCart();
    [
      {
        productSlug: "vitamin-c-booster",
        productNameAr: getStorefrontProductNameAr("vitamin-c-booster"),
        priceSar: 169,
      },
      {
        productSlug: "ceramide-booster",
        productNameAr: getStorefrontProductNameAr("ceramide-booster"),
        priceSar: 169,
      },
      {
        productSlug: "pdrn-booster",
        productNameAr: getStorefrontProductNameAr("pdrn-booster"),
        priceSar: 169,
      },
    ].forEach((item) =>
      addItem({
        ...item,
        bundleId: `mutqan-skincare-set-${item.productSlug}`,
        bundleLabelAr: "مجموعة متقن الكاملة",
        quantity: 1,
        itemType: "main",
      }),
    );
    openCheckout();
  };

  return (
    <article
      className="group block rounded-[1.75rem] bg-white border border-brand-border/60 overflow-hidden shadow-[0_4px_28px_rgba(30,36,48,0.05)] card-lift transition-all duration-300 hover:border-brand-gold/30 sm:col-span-2 lg:col-span-1"
    >
      <div className="relative overflow-hidden bg-brand-background">
        <StoreImageFrame
          src={HOMEPAGE_HERO_IMAGE}
          alt="مجموعة متقن الكاملة للعناية"
          sizes={STORE_IMAGE_SIZES.card}
          className="bg-brand-background"
          imageClassName="w-full h-auto max-w-full block transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        <div className="absolute top-4 start-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso text-white text-[11px] font-bold tracking-wide shadow-md">
            الأفضل قيمة
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <CardRating reviewCount={reviewCount} />

        <h2 className="font-bold text-brand-espresso text-lg md:text-xl leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
          مجموعة متقن الكاملة
        </h2>

        <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5">
          سيروم فيتامين سي + سيروم السنتيلا والسيراميد + سيروم PDRN — روتين متكامل للإشراقة والإصلاح والشباب
        </p>

        <div className="mb-5 inline-flex rounded-full bg-brand-gold/10 px-3.5 py-1.5 text-xs font-extrabold text-brand-gold">
          وفر 118 ريال
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-brand-border/50">
          <div>
            <p className="text-sm text-brand-muted line-through tabular-nums">
              617 ر.س
            </p>
            <p className="font-extrabold text-brand-espresso text-2xl tracking-tight tabular-nums">
              499 <span className="text-sm font-bold text-brand-muted">ر.س</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleOrderBundle}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-espresso text-white text-sm font-bold shadow-btn group-hover:bg-brand-gold transition-colors"
          >
            <span>احصلي على المجموعة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function CardRating({ reviewCount }: { reviewCount: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5 text-brand-gold fill-brand-gold"
          />
        ))}
      </div>
      <span className="text-xs font-medium text-brand-muted">
        (+{reviewCount.toLocaleString("ar-SA")})
      </span>
    </div>
  );
}
