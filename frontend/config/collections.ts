import { withImageVersion } from "@/lib/image-display";

export const COLLECTIONS = [
  {
    slug: "beauty-organization",
    nameAr: "تنظيم الجمال",
    descriptionAr: "حلول أنيقة للحفاظ على مستحضراتك منظمة وجميلة.",
    image: withImageVersion("/images/products/beauty-vanity-cabinet.png", 3),
    imageAlt: "خزانة الجمال الفاخرة المضادة للغبار",
    badge: "الأكثر طلباً",
    heroProductSlug: "beauty-vanity-cabinet",
    productSlugs: ["beauty-vanity-cabinet", "rotating-brush-organizer"],
  },
  {
    slug: "brush-care",
    nameAr: "العناية بالفرش",
    descriptionAr: "منتجات تمنح فرشك نظافة وترتيباً يدومان.",
    image: withImageVersion("/images/products/makeup-brush-cleaner.png", 2),
    imageAlt: "جهاز تنظيف فرش المكياج الذكي",
    badge: "الأكثر طلباً",
    heroProductSlug: "makeup-brush-cleaner",
    productSlugs: ["makeup-brush-cleaner", "rotating-brush-organizer"],
  },
  {
    slug: "makeup-tools",
    nameAr: "أدوات المكياج الفاخرة",
    descriptionAr: "إكسسوارات مختارة بعناية لتجربة أكثر أناقة وراحة.",
    image: withImageVersion("/images/products/rotating-brush-organizer.png", 2),
    imageAlt: "منظم الفرش الدوار الفاخر",
    badge: "الأكثر طلباً",
    heroProductSlug: "rotating-brush-organizer",
    productSlugs: ["led-makeup-bag", "rotating-brush-organizer"],
  },
  {
    slug: "mutqan-sets",
    nameAr: "مجموعات متقن",
    descriptionAr: "مجموعة متكاملة تمنحك روتين جمال أكثر ترتيباً وأناقة.",
    image: withImageVersion("/images/hero/beauty-vanity-hero.png", 2),
    imageAlt: "مجموعة متقن الفاخرة للروتين اليومي",
    badge: "الأفضل توفيراً",
    heroProductSlug: "beauty-vanity-cabinet",
    productSlugs: [
      "beauty-vanity-cabinet",
      "led-makeup-bag",
      "makeup-brush-cleaner",
      "rotating-brush-organizer",
    ],
  },
  {
    slug: "beauty-vanity",
    nameAr: "الجمال والعناية",
    descriptionAr: "مختارات متقن الفاخرة للعناية اليومية وتنظيم مستحضراتك.",
    image: withImageVersion("/images/products/led-makeup-bag.png", 2),
    imageAlt: "حقيبة المكياج الفاخرة بإضاءة LED",
    badge: "الأكثر مبيعاً",
    heroProductSlug: "led-makeup-bag",
    productSlugs: [
      "beauty-vanity-cabinet",
      "led-makeup-bag",
      "makeup-brush-cleaner",
      "rotating-brush-organizer",
    ],
  },
];

export const getCollectionBySlug = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);
