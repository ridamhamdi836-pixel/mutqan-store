import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES, withImageVersion } from "@/lib/image-display";
import { getProduct } from "@/config/catalog";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";

type BeautyProductSlug =
  | "beauty-vanity-cabinet"
  | "led-makeup-bag"
  | "makeup-brush-cleaner"
  | "rotating-brush-organizer";

type BeautyCollection = {
  slug: string;
  nameAr: string;
  descriptionAr: string;
  badge: string;
  productSlugs: BeautyProductSlug[];
  isBundle?: boolean;
};

const PRODUCT_PRESENTATION: Record<
  BeautyProductSlug,
  { nameAr: string; subtitle: string; image: string; imageAlt: string }
> = {
  "beauty-vanity-cabinet": {
    nameAr: "خزانة الجمال الفاخرة المضادة للغبار",
    subtitle: "تنظيم أنيق يحافظ على مستحضراتك بأفضل صورة.",
    image: withImageVersion("/images/products/beauty-vanity-cabinet.png", 3),
    imageAlt: "خزانة الجمال الفاخرة المضادة للغبار — متقن",
  },
  "led-makeup-bag": {
    nameAr: "حقيبة المكياج الفاخرة بإضاءة LED",
    subtitle: "إضاءة مثالية وأناقة ترافقك أينما كنت.",
    image: withImageVersion("/images/products/led-makeup-bag.png", 2),
    imageAlt: "حقيبة المكياج الفاخرة بإضاءة LED — متقن",
  },
  "makeup-brush-cleaner": {
    nameAr: "جهاز تنظيف فرش المكياج الذكي",
    subtitle: "تنظيف وتجفيف سريع لفرش أكثر نظافة وعناية.",
    image: withImageVersion("/images/products/makeup-brush-cleaner.png", 2),
    imageAlt: "جهاز تنظيف فرش المكياج الذكي — متقن",
  },
  "rotating-brush-organizer": {
    nameAr: "منظم الفرش الدوار الفاخر",
    subtitle: "ترتيب أنيق يحافظ على فرشك بعيداً عن الغبار.",
    image: withImageVersion("/images/products/rotating-brush-organizer.png", 2),
    imageAlt: "منظم الفرش الدوار الفاخر — متقن",
  },
};

const BEAUTY_COLLECTIONS: BeautyCollection[] = [
  {
    slug: "beauty-organization",
    nameAr: "تنظيم الجمال",
    descriptionAr: "حلول أنيقة للحفاظ على مستحضراتك منظمة وجميلة.",
    badge: "الأكثر طلباً",
    productSlugs: ["beauty-vanity-cabinet"],
  },
  {
    slug: "brush-care",
    nameAr: "العناية بالفرش",
    descriptionAr: "منتجات تمنح فرشك نظافة وترتيباً يدومان.",
    badge: "الأكثر طلباً",
    productSlugs: ["makeup-brush-cleaner", "rotating-brush-organizer"],
  },
  {
    slug: "makeup-tools",
    nameAr: "أدوات المكياج الفاخرة",
    descriptionAr: "إكسسوارات مختارة بعناية لتجربة أكثر أناقة وراحة.",
    badge: "الأكثر طلباً",
    productSlugs: ["rotating-brush-organizer", "led-makeup-bag"],
  },
  {
    slug: "beauty-vanity",
    nameAr: "الجمال والعناية",
    descriptionAr: "مختارات متقن الفاخرة للعناية اليومية وتنظيم مستحضراتك.",
    badge: "الأكثر مبيعاً",
    productSlugs: ["led-makeup-bag", "beauty-vanity-cabinet"],
  },
  {
    slug: "mutqan-sets",
    nameAr: "مجموعات متقن",
    descriptionAr: "مجموعة متكاملة تمنحك روتين جمال أكثر ترتيباً وأناقة.",
    badge: "الأفضل توفيراً",
    productSlugs: [
      "beauty-vanity-cabinet",
      "led-makeup-bag",
      "makeup-brush-cleaner",
      "rotating-brush-organizer",
    ],
    isBundle: true,
  },
];

function getBeautyCollectionBySlug(slug: string) {
  return BEAUTY_COLLECTIONS.find((collection) => collection.slug === slug);
}

export async function generateStaticParams() {
  return BEAUTY_COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getBeautyCollectionBySlug(slug);
  if (!collection) return { title: "مجموعة | متقن" };
  return {
    title: `${collection.nameAr} | متقن`,
    description: collection.descriptionAr,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getBeautyCollectionBySlug(slug);
  if (!collection) notFound();

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
              collection.productSlugs.map((productSlug) => (
                <BeautyProductCard key={productSlug} slug={productSlug} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BeautyProductCard({ slug }: { slug: BeautyProductSlug }) {
  const product = PRODUCT_PRESENTATION[slug];
  const catalogProduct = getProduct(slug);
  const minPrice = catalogProduct
    ? [...catalogProduct.bundles].sort((a, b) => a.price_sar - b.price_sar)[0]
        ?.price_sar
    : null;
  const reviewCount = getProductReviewDisplayCount(slug);

  return (
    <Link
      href={`/products/${slug}`}
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
  const reviewCount = getProductReviewDisplayCount("beauty-vanity-cabinet");

  return (
    <Link
      href="/collections/beauty-vanity"
      className="group block rounded-[1.25rem] bg-white border border-brand-border/60 overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)] card-lift transition-all duration-300 hover:border-brand-gold/30 sm:col-span-2 lg:col-span-1"
    >
      <div className="relative aspect-square min-h-[260px] sm:min-h-[300px] bg-gradient-to-b from-brand-secondary/40 to-brand-background overflow-hidden">
        <StoreImage
          src={withImageVersion("/images/hero/beauty-vanity-hero.png", 2)}
          alt="مجموعة متقن الكاملة"
          fill
          fit="contain"
          variant="default"
          sizes={STORE_IMAGE_SIZES.card}
          className="p-0 md:group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        <div className="absolute top-4 start-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso text-white text-[11px] font-bold tracking-wide shadow-md">
            الأفضل توفيراً
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <CardRating reviewCount={reviewCount} />

        <h2 className="font-bold text-brand-espresso text-lg md:text-xl leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
          مجموعة متقن الكاملة
        </h2>

        <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5">
          خزانة الجمال الفاخرة + حقيبة المكياج LED + جهاز تنظيف الفرش الذكي +
          منظم الفرش الدوار الفاخر
        </p>

        <div className="mb-5 inline-flex rounded-full bg-brand-gold/10 px-3.5 py-1.5 text-xs font-extrabold text-[#8A6A12]">
          وفر 227 ريال ✨
        </div>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-brand-border/50">
          <div>
            <p className="text-sm text-brand-muted line-through tabular-nums">
              926 ر.س
            </p>
            <p className="font-extrabold text-brand-espresso text-2xl tracking-tight tabular-nums">
              699 <span className="text-sm font-bold text-brand-muted">ر.س</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-espresso text-white text-sm font-bold shadow-btn group-hover:bg-[#1a2744] transition-colors">
            <span>احصلي على المجموعة كاملة</span>
            <ArrowLeft className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
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
