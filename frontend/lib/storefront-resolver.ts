import {
  CATALOG,
  CATALOG_BY_SLUG,
  FEATURED_SLUGS,
  resolveProductSlug,
  type CatalogProduct,
} from "@/config/catalog";
import {
  HOMEPAGE_BEAUTY,
  type HomepageBeautyProduct,
} from "@/config/homepage-beauty";
import { PRODUCTS_CONFIG, type ProductPageConfig } from "@/config/products";
import { getCroProductPage, hasCroProductPage } from "@/config/cro-product-pages";
import { readProductOverrides, readStoreSettings } from "@/lib/store-dashboard-db";
import type {
  ProductOverride,
  ProductVisibilitySettings,
  ResolvedProductPage,
  StorefrontProduct,
  StoreSettingsOverride,
} from "@/types/store-dashboard";
import type { CroProductPageConfig } from "@/types/cro-product-page";

const DEFAULT_VISIBILITY = {
  enabled: true,
  showOnHome: true,
  showInCollections: true,
  showPdp: true,
  sortOrder: 100,
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function withProductOverrides(
  base: CatalogProduct,
  override?: ProductOverride,
): StorefrontProduct {
  const visibility = {
    ...DEFAULT_VISIBILITY,
    ...(override?.visibility ?? {}),
  };
  const catalog = override?.catalog ?? {};

  return {
    ...base,
    name_ar: catalog.name_ar ?? override?.copy?.nameAr ?? base.name_ar,
    short_description_ar:
      catalog.short_description_ar ??
      override?.copy?.shortDescriptionAr ??
      base.short_description_ar,
    sku: catalog.sku ?? base.sku,
    category_slug: catalog.category_slug ?? base.category_slug,
    imageFile: catalog.imageFile ?? base.imageFile,
    storeCardImageFile: catalog.storeCardImageFile ?? base.storeCardImageFile,
    bundles: override?.bundles?.length ? override.bundles : base.bundles,
    visibility,
    dashboardOverride: override,
  };
}

function productFromOverride(slug: string, override: ProductOverride): StorefrontProduct | null {
  const catalog = override.catalog;
  const bundles = override.bundles;
  if (!catalog?.name_ar || !catalog.short_description_ar || !bundles?.length) return null;

  return withProductOverrides(
    {
      id: `dashboard-${slug}`,
      slug,
      name_ar: catalog.name_ar,
      name_en: slug,
      short_description_ar: catalog.short_description_ar,
      positioning: catalog.short_description_ar,
      category_slug: catalog.category_slug ?? "beauty",
      sku: catalog.sku ?? `MTQ-${slug.slice(0, 8).toUpperCase()}`,
      imageFile: catalog.imageFile ?? `${slug}.png`,
      storeCardImageFile: catalog.storeCardImageFile,
      bundles,
    },
    override,
  );
}

function mergeProducts(overrides: Record<string, ProductOverride>): StorefrontProduct[] {
  const products = CATALOG.map((product, index) => {
    const override = overrides[product.slug];
    const resolved = withProductOverrides(product, override);
    resolved.visibility.sortOrder = override?.visibility?.sortOrder ?? index + 1;
    return resolved;
  });

  for (const [slug, override] of Object.entries(overrides)) {
    if (CATALOG_BY_SLUG[slug]) continue;
    const product = productFromOverride(slug, override);
    if (product) products.push(product);
  }

  return products.sort((a, b) => a.visibility.sortOrder - b.visibility.sortOrder);
}

function imageFromProduct(product: StorefrontProduct): string {
  const media = product.dashboardOverride?.media;
  if (media?.cardImage) return media.cardImage;
  const file = product.storeCardImageFile ?? product.imageFile;
  if (file.startsWith("/")) return file;
  return `/images/products/${file}`;
}

function mergeHomepageProduct(product: StorefrontProduct): HomepageBeautyProduct {
  const staticCard = HOMEPAGE_BEAUTY.bestSellers.products.find(
    (item) => item.slug === product.slug,
  );
  const media = product.dashboardOverride?.media;

  return {
    slug: product.slug,
    nameAr: product.name_ar,
    subtitle:
      product.dashboardOverride?.copy?.homepageSubtitle ??
      product.short_description_ar,
    image: media?.cardImage ?? staticCard?.image ?? imageFromProduct(product),
    imageAlt: staticCard?.imageAlt ?? product.name_ar,
    minPriceSar: [...product.bundles].sort((a, b) => a.price_sar - b.price_sar)[0]?.price_sar,
  };
}

function defaultProductConfig(product: StorefrontProduct): ProductPageConfig {
  const image = imageFromProduct(product);
  return {
    heroImageAlt: product.name_ar,
    shortPromise: product.short_description_ar,
    heroAngle: product.short_description_ar,
    problemStatement: "روتينك يستحق منتجاً عملياً وأنيقاً يجعل التفاصيل اليومية أسهل.",
    heroSectionImage: image,
    heroSectionImageAlt: product.name_ar,
    benefits: [
      "تصميم عملي يناسب الاستخدام اليومي",
      "مظهر أنيق يرفع فخامة ركن الجمال",
      "اختيار مناسب كهدية راقية",
    ],
    beforeLabel: "قبل متقن",
    afterLabel: "بعد متقن",
    howToUse: ["اختاري العرض المناسب", "أدخلي بياناتك", "استلمي وادفعي عند الاستلام"],
    crossSellSlugs: FEATURED_SLUGS.filter((slug) => slug !== product.slug).slice(0, 2),
    reviews: [],
    faqs: [
      {
        question: "هل الدفع عند الاستلام متاح؟",
        answer: "نعم، الدفع عند الاستلام متاح لجميع مناطق المملكة.",
      },
    ],
    seoTitle: `${product.name_ar} | متقن`,
    seoDescription: product.short_description_ar,
  };
}

function resolveProductConfig(product: StorefrontProduct): ProductPageConfig {
  const base =
    PRODUCTS_CONFIG[product.slug] ??
    PRODUCTS_CONFIG[resolveProductSlug(product.slug)] ??
    defaultProductConfig(product);
  const config = clone(base);
  const copy = product.dashboardOverride?.copy;
  const media = product.dashboardOverride?.media;

  config.shortPromise = copy?.shortDescriptionAr ?? config.shortPromise;
  config.heroAngle = copy?.heroSubheadline ?? config.heroAngle;
  config.problemStatement = copy?.problemCopy ?? config.problemStatement;
  config.heroSectionImage = media?.heroImage ?? config.heroSectionImage;
  config.heroSectionAspect = media?.heroAspect ?? config.heroSectionAspect;
  config.heroSectionImageAlt = media?.heroImageAlt ?? config.heroSectionImageAlt;
  config.painSectionImage = media?.painImage ?? config.painSectionImage;
  config.painSectionAspect = media?.painAspect ?? config.painSectionAspect;
  config.solutionSectionImage = media?.solutionImage ?? config.solutionSectionImage;
  config.solutionSectionAspect = media?.solutionAspect ?? config.solutionSectionAspect;
  config.lifestyleSectionImage = media?.lifestyleImage ?? config.lifestyleSectionImage;
  config.lifestyleSectionAspect = media?.lifestyleAspect ?? config.lifestyleSectionAspect;
  config.seoTitle = copy?.nameAr ? `${copy.nameAr} | متقن` : config.seoTitle;
  config.seoDescription = copy?.shortDescriptionAr ?? config.seoDescription;
  return config;
}

function defaultCroPage(product: StorefrontProduct): CroProductPageConfig {
  const page = clone(getCroProductPage("beauty-vanity-cabinet"));
  page.hero.headline = product.name_ar;
  page.hero.subheadline = product.short_description_ar;
  page.problem.title = "المشكلة ليست في روتينك… بل في التفاصيل غير المرتبة";
  page.problem.copy = "عندما تكون الأدوات مشتتة، يصبح الروتين اليومي أقل راحة وأقل أناقة.";
  page.solution.title = "متقن يعيد للتفاصيل مكانها";
  page.solution.copy = product.short_description_ar;
  page.finalCta.title = `اجعلي ${product.name_ar} جزءاً من روتينك اليوم`;
  return page;
}

function resolveCroPage(product: StorefrontProduct): CroProductPageConfig {
  const base = hasCroProductPage(product.slug)
    ? getCroProductPage(product.slug)
    : defaultCroPage(product);
  const page = clone(base);
  const copy = product.dashboardOverride?.copy;

  page.hero.headline = copy?.heroHeadline ?? copy?.nameAr ?? page.hero.headline;
  page.hero.subheadline = copy?.heroSubheadline ?? page.hero.subheadline;
  page.problem.title = copy?.problemTitle ?? page.problem.title;
  page.problem.copy = copy?.problemCopy ?? page.problem.copy;
  page.solution.title = copy?.solutionTitle ?? page.solution.title;
  page.solution.copy = copy?.solutionCopy ?? page.solution.copy;
  page.highlight.copy = copy?.highlightCopy ?? page.highlight.copy;
  page.finalCta.title = copy?.finalCtaTitle ?? page.finalCta.title;
  return page;
}

export async function getResolvedStoreSettings(): Promise<StoreSettingsOverride> {
  try {
    return await readStoreSettings();
  } catch (error) {
    console.error("[StorefrontResolver] Failed to read settings:", error);
    return {};
  }
}

export async function getResolvedProducts(): Promise<StorefrontProduct[]> {
  try {
    return mergeProducts(await readProductOverrides());
  } catch (error) {
    console.error("[StorefrontResolver] Failed to read product overrides:", error);
    return mergeProducts({});
  }
}

export async function getResolvedProduct(slug: string): Promise<StorefrontProduct | null> {
  const resolved = resolveProductSlug(slug);
  const products = await getResolvedProducts();
  return products.find((product) => product.slug === resolved || product.slug === slug) ?? null;
}

export async function getResolvedHomepageProducts(): Promise<HomepageBeautyProduct[]> {
  const products = await getResolvedProducts();
  return products
    .filter(
      (product) =>
        product.visibility.enabled &&
        product.visibility.showOnHome &&
        product.visibility.showPdp,
    )
    .map(mergeHomepageProduct);
}

export async function getResolvedProductPage(
  slug: string,
  options: { includeHidden?: boolean } = {},
): Promise<ResolvedProductPage | null> {
  const product = await getResolvedProduct(slug);
  if (
    !product ||
    (!options.includeHidden && (!product.visibility.enabled || !product.visibility.showPdp))
  ) {
    return null;
  }

  return {
    product,
    config: resolveProductConfig(product),
    croPage: resolveCroPage(product),
  };
}
