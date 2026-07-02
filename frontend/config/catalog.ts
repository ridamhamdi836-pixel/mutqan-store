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
    slug: "storage",
    name_ar: "الخزانة التراكمية الذكية",
    name_en: "Smart Stackable Cabinet",
    short_description_ar: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.",
    category_slug: "home-organization",
    sku: "MTQ-CAB-002",
    imageFile: "smart-stackable-cabinet.png",
    storeCardImageFile: "smart-stackable-cabinet-wall.png",
    bundles: [
      bundle("cabinet-1", "خزانة - لمساحة واحدة", 1, 349, { sort_order: 1 }),
      bundle("cabinet-2", "خزانتين - لترتيب أوضح ومساحة أكبر | وفر 99 ريال", 2, 599, {
        compare_at_price_sar: 698,
        savings_label_ar: "وفر 99 ريال",
        is_default: true,
        sort_order: 2,
      }),
      bundle("cabinet-3", "3 خزائن - أفضل قيمة للبيت | وفر 298 ريال", 3, 749, {
        compare_at_price_sar: 1047,
        savings_label_ar: "وفر 298 ريال",
        sort_order: 3,
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
    slug: "sink-organizer",
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
      bundle("lunch-1", "قطعة واحدة - للاستخدام اليومي", 1, 279, { sort_order: 1 }),
      bundle("lunch-2", "قطعتين - أفضل قيمة للعائلة | وفر 129 ريال", 2, 399, {
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
  {
    id: "p8",
    slug: "beauty-vanity-cabinet",
    name_ar: "خزانة الجمال الفاخرة المضادة للغبار",
    name_en: "Dustproof Cosmetic Organizer",
    short_description_ar: "تنظيم أنيق يحافظ على مستحضراتك بأفضل صورة.",
    category_slug: "beauty-vanity",
    sku: "MTQ-BTY-008",
    imageFile: "beauty-vanity-cabinet.png",
    storeCardImageFile: "beauty-vanity-cabinet.png",
    bundles: [
      bundle("beauty-cabinet-1", "العرض الرئيسي - الأكثر طلباً", 1, 229, {
        compare_at_price_sar: 299,
        is_default: true,
        sort_order: 1,
      }),
      bundle("beauty-cabinet-2", "قطعتان - مثالية لك ولشخص تحبينه", 2, 349, {
        compare_at_price_sar: 598,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "أضيفيها لنفس الشحنة لتحصلي على ركن جمال مرتب ومحمي من الغبار",
      original_price_sar: 299,
      upsell_price_sar: 199,
    },
    crossSell: { shortDesc: "تنظيم فاخر لمستحضراتك", singleUnitPriceSar: 229 },
  },
  {
    id: "p9",
    slug: "led-makeup-bag",
    name_ar: "حقيبة المكياج الفاخرة بإضاءة LED",
    name_en: "LED Makeup Bag",
    short_description_ar: "إضاءة مثالية وأناقة ترافقك أينما كنت.",
    category_slug: "beauty-vanity",
    sku: "MTQ-BTY-009",
    imageFile: "led-makeup-bag.png",
    storeCardImageFile: "led-makeup-bag.png",
    bundles: [
      bundle("led-bag-1", "العرض الرئيسي - الأكثر طلباً", 1, 249, {
        compare_at_price_sar: 349,
        is_default: true,
        sort_order: 1,
      }),
      bundle("led-bag-2", "قطعتان - وفري أكثر عند طلب قطعتين", 2, 399, {
        compare_at_price_sar: 698,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "إضافة مثالية لروتينك اليومي والسفر مع إضاءة واضحة أينما كنتِ",
      original_price_sar: 349,
      upsell_price_sar: 219,
    },
    crossSell: { shortDesc: "إضاءة LED فاخرة للمكياج", singleUnitPriceSar: 249 },
  },
  {
    id: "p10",
    slug: "makeup-brush-cleaner",
    name_ar: "جهاز تنظيف فرش المكياج الذكي",
    name_en: "Electric Makeup Brush Cleaner",
    short_description_ar: "تنظيف وتجفيف سريع لفرش أكثر نظافة وعناية.",
    category_slug: "beauty-vanity",
    sku: "MTQ-BTY-010",
    imageFile: "makeup-brush-cleaner.png",
    storeCardImageFile: "makeup-brush-cleaner.png",
    bundles: [
      bundle("brush-cleaner-1", "العرض الرئيسي - الأكثر طلباً", 1, 249, {
        compare_at_price_sar: 329,
        is_default: true,
        sort_order: 1,
      }),
      bundle("brush-cleaner-2", "قطعتان - مثالي للاستخدام الشخصي أو كهدية", 2, 399, {
        compare_at_price_sar: 658,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "حافظي على فرشك نظيفة وناعمة بإضافة صغيرة تحدث فرقاً يومياً",
      original_price_sar: 329,
      upsell_price_sar: 219,
    },
    crossSell: { shortDesc: "تنظيف ذكي لفرش المكياج", singleUnitPriceSar: 249 },
  },
  {
    id: "p11",
    slug: "rotating-brush-organizer",
    name_ar: "منظم الفرش الدوار الفاخر",
    name_en: "Rotating Makeup Brush Organizer",
    short_description_ar: "ترتيب أنيق يحافظ على فرشك بعيداً عن الغبار.",
    category_slug: "beauty-vanity",
    sku: "MTQ-BTY-011",
    imageFile: "rotating-brush-organizer.png",
    storeCardImageFile: "rotating-brush-organizer.png",
    bundles: [
      bundle("brush-org-1", "العرض الرئيسي - الأكثر طلباً", 1, 199, {
        compare_at_price_sar: 239,
        is_default: true,
        sort_order: 1,
      }),
      bundle("brush-org-2", "قطعتان - اختيار رائع لإكمال ركن الجمال", 2, 279, {
        compare_at_price_sar: 478,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "أكملي ترتيب ركن الجمال بمنظم دوار يحمي الفرش ويسهّل الوصول لها",
      original_price_sar: 239,
      upsell_price_sar: 169,
    },
    crossSell: { shortDesc: "ترتيب دوار لفرش المكياج", singleUnitPriceSar: 199 },
  },
  {
    id: "sk1",
    slug: "vitamin-c-booster",
    name_ar: "سيروم فيتامين سي ونياسيناميد ضد البقع والبهتان",
    name_en: "Vitamin C Booster",
    short_description_ar:
      "حمض الأسكوربيك ونياسيناميد — يستهدف البقع والبهتان ويوحّد مظهر البشرة.",
    positioning: "Glow · Brightening · Even Skin Tone",
    category_slug: "korean-skincare",
    sku: "MTQ-SK-VC-001",
    imageFile: "vitamin-c-booster.png",
    storeCardImageFile: "vitamin-c-booster.png",
    bundles: [
      bundle("vitamin-c-1", "العرض الرئيسي — الأكثر طلباً", 1, 189, {
        compare_at_price_sar: 249,
        is_default: true,
        sort_order: 1,
      }),
      bundle("vitamin-c-2", "قطعتان — روتين إشراق أطول", 2, 329, {
        compare_at_price_sar: 498,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "أكملي روتينك بسيروم يعيد للبشرة راحتها وتوازنها",
      original_price_sar: 249,
      upsell_price_sar: 169,
    },
    crossSell: { shortDesc: "إشراقة وتوحيد لون البشرة", singleUnitPriceSar: 189 },
  },
  {
    id: "sk2",
    slug: "ceramide-booster",
    name_ar: "سيروم السنتيلا والسيراميد ضد الحبوب وجلد الدجاجة",
    name_en: "Ceramide Booster",
    short_description_ar:
      "سنتيلا آسيوية وسيراميد NP — يهدئان الحبوب ويرطّبان البشرة ويخففان جلد الدجاجة.",
    positioning: "Repair · Barrier · Hydration",
    category_slug: "korean-skincare",
    sku: "MTQ-SK-CE-002",
    imageFile: "ceramide-booster.png",
    storeCardImageFile: "ceramide-booster.png",
    bundles: [
      bundle("ceramide-1", "العرض الرئيسي — الأكثر طلباً", 1, 199, {
        compare_at_price_sar: 269,
        is_default: true,
        sort_order: 1,
      }),
      bundle("ceramide-2", "قطعتان — عناية أطول للبشرة الحساسة", 2, 349, {
        compare_at_price_sar: 538,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "خطوة صغيرة تمنح بشرتك إشراقة أكثر وضوحاً",
      original_price_sar: 269,
      upsell_price_sar: 179,
    },
    crossSell: { shortDesc: "إصلاح وترطيب للبشرة الحساسة", singleUnitPriceSar: 199 },
  },
  {
    id: "sk3",
    slug: "pdrn-booster",
    name_ar: "سيروم PDRN والببتيدات ضد التجاعيد والخطوط الدقيقة",
    name_en: "PDRN Booster",
    short_description_ar:
      "PDRN وأدينوزين وببتيدات — يشدّان البشرة ويقللان مظهر الخطوط الدقيقة.",
    positioning: "Youth · Firmness · Elasticity",
    category_slug: "korean-skincare",
    sku: "MTQ-SK-PD-003",
    imageFile: "pdrn-booster.png",
    storeCardImageFile: "pdrn-booster.png",
    bundles: [
      bundle("pdrn-1", "العرض الرئيسي — الأكثر طلباً", 1, 229, {
        compare_at_price_sar: 299,
        is_default: true,
        sort_order: 1,
      }),
      bundle("pdrn-2", "قطعتان — عناية شباب أطول", 2, 399, {
        compare_at_price_sar: 598,
        savings_label_ar: "وفر أكثر",
        sort_order: 2,
      }),
    ],
    upsell: {
      hook_ar: "أضيفي خطوة إشراق تكمل عناية شباب بشرتك",
      original_price_sar: 299,
      upsell_price_sar: 199,
    },
    crossSell: { shortDesc: "شد ومرونة للبشرة الناضجة", singleUnitPriceSar: 229 },
  },
];

export const CATALOG_BY_SLUG: Record<string, CatalogProduct> = Object.fromEntries(
  CATALOG.map((p) => [p.slug, p]),
);

export const PRODUCT_SLUGS = CATALOG.map((p) => p.slug);

/** Short storefront URLs stay separate from internal slugs used by orders/config. */
export const PRODUCT_SHORT_SLUGS: Record<string, string> = {
  "powerful-cordless-vacuum": "vacuum",
  storage: "storage",
  "pull-out-cabinet-drawer": "drawer",
  "sink-organizer": "sink",
  "pure-faucet-filter": "filter",
  "smart-table-warmer": "warmer",
  "thermal-lunch-box": "lunch",
  "beauty-vanity-cabinet": "vanity",
  "led-makeup-bag": "led",
  "makeup-brush-cleaner": "cleaner",
  "rotating-brush-organizer": "brush",
  "vitamin-c-booster": "glow",
  "ceramide-booster": "repair",
  "pdrn-booster": "youth",
};

export const PRODUCT_PAGE_SLUGS = Object.values(PRODUCT_SHORT_SLUGS);

/** Legacy/short URLs → canonical slug */
const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  vacuum: "powerful-cordless-vacuum",
  drawer: "pull-out-cabinet-drawer",
  sink: "sink-organizer",
  filter: "pure-faucet-filter",
  warmer: "smart-table-warmer",
  lunch: "thermal-lunch-box",
  vanity: "beauty-vanity-cabinet",
  led: "led-makeup-bag",
  cleaner: "makeup-brush-cleaner",
  brush: "rotating-brush-organizer",
  glow: "vitamin-c-booster",
  repair: "ceramide-booster",
  youth: "pdrn-booster",
  "smart-stackable-cabinet": "storage",
  "magic-under-sink-organizer": "sink-organizer",
};

export function resolveProductSlug(slug: string): string {
  return PRODUCT_SLUG_ALIASES[slug] ?? slug;
}

export function getProductPageSlug(slug: string): string {
  const resolved = resolveProductSlug(slug);
  return PRODUCT_SHORT_SLUGS[resolved] ?? resolved;
}

export function getProductPath(slug: string): string {
  return `/products/${getProductPageSlug(slug)}`;
}

/** Active storefront products — legacy makeup/home products remain in CATALOG for orders/admin only */
export const STOREFRONT_VISIBLE_SLUGS = [
  "vitamin-c-booster",
  "ceramide-booster",
  "pdrn-booster",
] as const;

export const FEATURED_SLUGS = STOREFRONT_VISIBLE_SLUGS;

export function isStorefrontVisibleSlug(slug: string): boolean {
  const resolved = resolveProductSlug(slug);
  return (STOREFRONT_VISIBLE_SLUGS as readonly string[]).includes(resolved);
}

export function getProduct(slug: string): CatalogProduct | undefined {
  return CATALOG_BY_SLUG[resolveProductSlug(slug)];
}

/** First bundle by sort_order — same «العرض الأول» shown on the product page. */
export function getFirstOfferBundle(product: CatalogProduct): ProductBundle {
  return [...product.bundles].sort(
    (a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99),
  )[0];
}

export function getProductsBySlugs(slugs: string[]): CatalogProduct[] {
  return slugs.map((s) => CATALOG_BY_SLUG[resolveProductSlug(s)]).filter(Boolean);
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
  const resolved = resolveProductSlug(slug);
  return CATALOG_BY_SLUG[resolved]?.sku ?? `MTQ-${resolved.slice(0, 6).toUpperCase()}`;
}

export function getCatalogNameAr(slug: string): string {
  const resolved = resolveProductSlug(slug);
  return CATALOG_BY_SLUG[resolved]?.name_ar ?? resolved;
}
