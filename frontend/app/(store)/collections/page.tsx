import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES, withImageVersion } from "@/lib/image-display";
import { getProductReviewDisplayCount } from "@/lib/product-review-count";

export const metadata: Metadata = {
  title: "مجموعات متقن | تنظيم الجمال والعناية",
  description:
    "اكتشفي مجموعات متقن الفاخرة لتنظيم الجمال، العناية بالفرش، وأدوات المكياج المختارة بعناية. الدفع عند الاستلام والتوصيل داخل السعودية.",
};

const BEAUTY_COLLECTIONS = [
  {
    slug: "beauty-organization",
    nameAr: "تنظيم الجمال",
    descriptionAr: "حلول أنيقة للحفاظ على مستحضراتك منظمة وجميلة.",
    image: withImageVersion("/images/products/beauty-vanity-cabinet.png", 3),
    imageAlt: "خزانة الجمال الفاخرة المضادة للغبار",
    badge: "الأكثر طلباً",
    reviewSlug: "beauty-vanity-cabinet",
    productCount: 1,
  },
  {
    slug: "brush-care",
    nameAr: "العناية بالفرش",
    descriptionAr: "منتجات تمنح فرشك نظافة وترتيباً يدومان.",
    image: withImageVersion("/images/products/makeup-brush-cleaner.png", 2),
    imageAlt: "جهاز تنظيف فرش المكياج الذكي",
    badge: "الأكثر طلباً",
    reviewSlug: "makeup-brush-cleaner",
    productCount: 2,
  },
  {
    slug: "makeup-tools",
    nameAr: "أدوات المكياج الفاخرة",
    descriptionAr: "إكسسوارات مختارة بعناية لتجربة أكثر أناقة وراحة.",
    image: withImageVersion("/images/products/rotating-brush-organizer.png", 2),
    imageAlt: "منظم الفرش الدوار الفاخر",
    badge: "الأكثر طلباً",
    reviewSlug: "rotating-brush-organizer",
    productCount: 2,
  },
  {
    slug: "beauty-vanity",
    nameAr: "الجمال والعناية",
    descriptionAr: "مختارات متقن الفاخرة للعناية اليومية وتنظيم مستحضراتك.",
    image: withImageVersion("/images/products/led-makeup-bag.png", 2),
    imageAlt: "حقيبة المكياج الفاخرة بإضاءة LED",
    badge: "الأكثر مبيعاً",
    reviewSlug: "led-makeup-bag",
    productCount: 2,
  },
  {
    slug: "mutqan-sets",
    nameAr: "مجموعات متقن",
    descriptionAr: "مجموعة متكاملة تمنحك روتين جمال أكثر ترتيباً وأناقة.",
    image: withImageVersion("/images/hero/beauty-vanity-hero.png", 2),
    imageAlt: "مجموعة متقن الكاملة للروتين اليومي",
    badge: "الأفضل توفيراً",
    reviewSlug: "beauty-vanity-cabinet",
    productCount: 1,
  },
] as const;

function CollectionCard({
  collection,
}: {
  collection: (typeof BEAUTY_COLLECTIONS)[number];
}) {
  const reviewCount = getProductReviewDisplayCount(collection.reviewSlug);

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block rounded-[1.25rem] bg-white border border-brand-border/60 overflow-hidden shadow-[0_2px_12px_rgba(15,23,42,0.04)] card-lift transition-all duration-300 hover:border-brand-gold/30"
    >
      <div className="relative aspect-square min-h-[260px] sm:min-h-[300px] bg-gradient-to-b from-brand-secondary/40 to-brand-background overflow-hidden">
        <StoreImage
          src={collection.image}
          alt={collection.imageAlt}
          fill
          fit="contain"
          variant="default"
          sizes={STORE_IMAGE_SIZES.card}
          className="p-0 md:group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        <div className="absolute top-4 start-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso text-white text-[11px] font-bold tracking-wide shadow-md">
            {collection.badge}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-7">
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

        <h2 className="font-bold text-brand-espresso text-lg md:text-xl leading-snug mb-2 group-hover:text-brand-gold transition-colors duration-200">
          {collection.nameAr}
        </h2>

        <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed mb-5 line-clamp-2">
          {collection.descriptionAr}
        </p>

        <div className="flex items-end justify-between gap-4 pt-4 border-t border-brand-border/50">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-brand-muted mb-1 font-medium">
              مجموعة مختارة
            </p>
            <p className="font-extrabold text-brand-espresso text-2xl tracking-tight">
              {collection.productCount}
              <span className="text-sm font-bold text-brand-muted"> منتجات</span>
            </p>
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

export default function CollectionsPage() {
  return (
    <div className="bg-brand-background min-h-screen">
      <section className="page-x pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-content mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs md:text-sm font-bold text-brand-espresso shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-gold" />
            مجموعات متقن الفاخرة
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight">
            جمالك يبدأ من ترتيب التفاصيل
          </h1>
          <p className="mt-4 text-sm md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            اكتشفي مجموعات مختارة بعناية لتنظيم مستحضراتك، العناية بفرشك،
            وإضاءة روتينك اليومي بأناقة تشبه براندات الجمال العالمية.
          </p>
        </div>
      </section>

      <section className="page-x pb-14 md:pb-20">
        <div className="max-w-content mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BEAUTY_COLLECTIONS.map((collection) => (
              <CollectionCard key={collection.slug} collection={collection} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
