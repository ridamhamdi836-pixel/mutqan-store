import type { Product, ProductBundle } from "@/types";

/** Single source of truth for storefront, upsell, cross-sell, and Google Sheets */
export interface CatalogProduct extends Product {
  name_en: string;
  sku: string;
  imageFile: string;
  /** Optional image for product cards in store listings only */
  storeCardImageFile?: string;
  upsell?: {
    hook_ar: string;
    original_price_sar: number;
    upsell_price_sar: number;
  };
  crossSell?: {
    shortDesc: string;
    singleUnitPriceSar: number;
  };
}

const bundle = (
  id: string,
  label_ar: string,
  quantity: number,
  price_sar: number,
  opts?: Partial<ProductBundle>,
): ProductBundle => ({
  id,
  label_ar,
  quantity,
  price_sar,
  is_default: opts?.is_default ?? false,
  sort_order: opts?.sort_order ?? 1,
  compare_at_price_sar: opts?.compare_at_price_sar,
  savings_label_ar: opts?.savings_label_ar,
});

export const CATALOG: CatalogProduct[] = [
  {
    id: "p1",
    slug: "powerful-cordless-vacuum",
    name_ar: "المكنسة اللاسلكية القوية",
    name_en: "Powerful Cordless Vacuum",
    short_description_ar: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق.",
    category_slug: "cleaning-care",
    sku: "MTQ-VAC-001",
    imageFile: "powerful-cordless-vacuum.jpg",
    storeCardImageFile: "powerful-cordless-vacuum-card.png",
    bundles: [
      bundle("vacuum-1", "قطعة واحدة - للمنزل", 1, 269, { sort_order: 1 }),
      bundle("vacuum-2", "قطعتين - للمنزل والسيارة | الأكثر اختيارًا", 2, 349, {
        is_default: true,
        sort_order: 2,
      }),
      bundle("vacuum-3", "3 قطع", 3, 479, { sort_order: 3 }),
    ],
    upsell: {
      hook_ar: "اللي يرتّب بيته يحتاج ينظفه — هذي تكمّل الصورة",
      original_price_sar: 229,
      upsell_price_sar: 189,
    },
    crossSell: { shortDesc: "تنظيف سريع للمنزل والسيارة", singleUnitPriceSar: 229 },
  },
  {
    id: "p2",
    slug: "smart-stackable-cabinet",
    name_ar: "الخزانة التراكمية الذكية",
    name_en: "Smart Stackable Cabinet",
    short_description_ar: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.",
    category_slug: "home-organization",
    sku: "MTQ-CAB-002",
    imageFile: "smart-stackable-cabinet.png",
    storeCardImageFile: "smart-stackable-cabinet-wall.png",
    bundles: [
      bundle("cabinet-1", "قطعة واحدة - لمساحة واحدة", 1, 349, { sort_order: 1 }),
      bundle("cabinet-2", "قطعتين - لترتيب أوضح ومساحة أكبر | وفر 99 ريال", 2, 599, {
        compare_at_price_sar: 698,
        savings_label_ar: "وفر 99 ريال",
        is_default: true,
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "كل زاوية فاضية في بيتك ممكن تتحول لمساحة تخزين أنيقة",
      original_price_sar: 349,
      upsell_price_sar: 289,
    },
    crossSell: { shortDesc: "مساحة تخزين إضافية وأنيقة", singleUnitPriceSar: 349 },
  },
  {
    id: "p3",
    slug: "pull-out-cabinet-drawer",
    name_ar: "درج الخزانة المنزلق",
    name_en: "Pull-out Cabinet Drawer",
    short_description_ar: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة.",
    category_slug: "home-organization",
    sku: "MTQ-DRW-003",
    imageFile: "pull-out-cabinet-drawer.jpg",
    storeCardImageFile: "pull-out-cabinet-drawer-card.png",
    bundles: [
      bundle("drawer-1", "قطعة واحدة لبداية التنظيم", 1, 269, { sort_order: 1 }),
      bundle("drawer-2", "قطعتين لدرجين في المطبخ", 2, 349, {
        compare_at_price_sar: 538,
        savings_label_ar: "وفر 189 ريال",
        is_default: true,
        sort_order: 2,
      }),
      bundle("drawer-3", "3 قطع لترتيب خزائن إضافية", 3, 479, {
        compare_at_price_sar: 807,
        savings_label_ar: "وفر 328 ريال",
        sort_order: 3,
      }),
      bundle("drawer-4", "4 قطع لأفضل قيمة للبيت", 4, 549, {
        compare_at_price_sar: 1076,
        savings_label_ar: "وفر 527 ريال",
        sort_order: 4,
      }),
    ],
    upsell: {
      hook_ar: "الأشياء اللي في آخر الخزانة أخيرًا بتوصلها بسحبة وحدة",
      original_price_sar: 349,
      upsell_price_sar: 279,
    },
    crossSell: { shortDesc: "وصول سهل لأعماق الخزانة", singleUnitPriceSar: 349 },
  },
  {
    id: "p4",
    slug: "magic-under-sink-organizer",
    name_ar: "منظّم المغسلة السحري",
    name_en: "Magic Under-Sink Organizer",
    short_description_ar: "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا وراحة.",
    category_slug: "home-organization",
    sku: "MTQ-SNK-004",
    imageFile: "magic-under-sink-organizer.png",
    storeCardImageFile: "magic-under-sink-organizer-card.png",
    bundles: [
      bundle("sink-1", "قطعة واحدة - لمساحة واحدة", 1, 279, { sort_order: 1 }),
      bundle("sink-2", "قطعتين - للمطبخ والحمام | الأكثر اختيارًا", 2, 399, {
        compare_at_price_sar: 458,
        savings_label_ar: "وفر 79 ريال",
        is_default: true,
        sort_order: 2,
      }),
      bundle("sink-3", "3 قطع - أفضل قيمة", 3, 499, {
        compare_at_price_sar: 687,
        savings_label_ar: "وفر 188 ريال",
        sort_order: 3,
      }),
    ],
    upsell: {
      hook_ar: "الفوضى تحت المغسلة انتهت — ترتيب ذكي بدقيقتين",
      original_price_sar: 229,
      upsell_price_sar: 189,
    },
    crossSell: { shortDesc: "ترتيب ذكي تحت المغسلة", singleUnitPriceSar: 229 },
  },
  {
    id: "p5",
    slug: "pure-faucet-filter",
    name_ar: "فلتر الصنبور النقي",
    name_en: "Pure Faucet Filter",
    short_description_ar: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري.",
    category_slug: "modern-kitchen",
    sku: "MTQ-FLT-005",
    imageFile: "pure-faucet-filter.jpg",
    storeCardImageFile: "pure-faucet-filter-card.png",
    bundles: [
      bundle("filter-1", "قطعة واحدة - للمطبخ", 1, 199, { sort_order: 1 }),
      bundle("filter-2", "قطعتين - أفضل قيمة | وفر أكثر", 2, 249, {
        compare_at_price_sar: 398,
        savings_label_ar: "وفر 149 ريال",
        is_default: true,
        sort_order: 2,
      }),
      bundle("filter-3", "3 قطع - للبيت بالكامل", 3, 379, {
        compare_at_price_sar: 597,
        savings_label_ar: "وفر 218 ريال",
        sort_order: 3,
      }),
    ],
    upsell: {
      hook_ar: "مطبخك يستاهل مية أنقى — فرق تحسه من أول استخدام",
      original_price_sar: 199,
      upsell_price_sar: 169,
    },
    crossSell: { shortDesc: "تجربة ماء يومية أفضل", singleUnitPriceSar: 199 },
  },
  {
    id: "p6",
    slug: "smart-table-warmer",
    name_ar: "سخّان المائدة الذكي",
    name_en: "Smart Table Warmer",
    short_description_ar: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة.",
    category_slug: "dining-hosting",
    sku: "MTQ-WRM-006",
    imageFile: "smart-table-warmer.jpg",
    storeCardImageFile: "smart-table-warmer-card.png",
    bundles: [
      bundle("warmer-1", "قطعة واحدة - للجلسات اليومية", 1, 249, { sort_order: 1 }),
      bundle("warmer-2", "قطعتين - مثالي للعائلة والضيوف | الأكثر اختيارًا", 2, 449, {
        compare_at_price_sar: 498,
        savings_label_ar: "وفر 49 ريال",
        is_default: true,
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "العزومة تكمل لما الأكل يبقى حار من أولها لآخرها",
      original_price_sar: 249,
      upsell_price_sar: 199,
    },
    crossSell: { shortDesc: "طعام دافئ طوال الجلسة", singleUnitPriceSar: 249 },
  },
  {
    id: "p7",
    slug: "thermal-lunch-box",
    name_ar: "حافظة الغداء الحرارية",
    name_en: "Thermal Lunch Box",
    short_description_ar: "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة.",
    category_slug: "dining-hosting",
    sku: "MTQ-LNB-007",
    imageFile: "thermal-lunch-box.jpg",
    storeCardImageFile: "thermal-lunch-box-card.png",
    bundles: [
      bundle("lunch-1", "قطعة واحدة - للاستخدام اليومي", 1, 229, { sort_order: 1 }),
      bundle("lunch-2", "قطعتين - أفضل قيمة للعائلة | وفر 129 ريال", 2, 329, {
        compare_at_price_sar: 458,
        savings_label_ar: "وفر 129 ريال",
        is_default: true,
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "وجبة دافية في الدوام تغيّر يومك — جرّبها وشوف الفرق",
      original_price_sar: 229,
      upsell_price_sar: 189,
    },
    crossSell: { shortDesc: "وجبة دافئة أينما كنت", singleUnitPriceSar: 229 },
  },
];

export const CATALOG_BY_SLUG: Record<string, CatalogProduct> = Object.fromEntries(
  CATALOG.map((p) => [p.slug, p]),
);

export const PRODUCT_SLUGS = CATALOG.map((p) => p.slug);

export const FEATURED_SLUGS = [
  "pull-out-cabinet-drawer",
  "smart-table-warmer",
  "magic-under-sink-organizer",
  "powerful-cordless-vacuum",
] as const;

export function getProduct(slug: string): CatalogProduct | undefined {
  return CATALOG_BY_SLUG[slug];
}

export function getProductsBySlugs(slugs: string[]): CatalogProduct[] {
  return slugs.map((s) => CATALOG_BY_SLUG[s]).filter(Boolean);
}

export function toProduct(p: CatalogProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name_ar: p.name_ar,
    name_en: p.name_en,
    short_description_ar: p.short_description_ar,
    positioning: p.positioning,
    category_slug: p.category_slug,
    bundles: p.bundles,
  };
}

export function getCatalogSku(slug: string): string {
  return CATALOG_BY_SLUG[slug]?.sku ?? `MTQ-${slug.slice(0, 6).toUpperCase()}`;
}

export function getCatalogNameAr(slug: string): string {
  return CATALOG_BY_SLUG[slug]?.name_ar ?? slug;
}
