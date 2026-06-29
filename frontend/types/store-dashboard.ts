import type { CatalogProduct } from "@/config/catalog";
import type { ProductPageConfig } from "@/config/products";
import type { CroProductPageConfig } from "@/types/cro-product-page";

export type StoreThemeSettings = {
  background?: string;
  surface?: string;
  beige?: string;
  espresso?: string;
  gold?: string;
  secondary?: string;
  text?: string;
  muted?: string;
  border?: string;
  trust?: string;
};

export type StoreBrandSettings = {
  nameAr?: string;
  nameEn?: string;
  taglineAr?: string;
  logoSrc?: string;
  logoSrcLight?: string;
  whatsappNumber?: string;
  supportEmail?: string;
};

export type StoreSettingsOverride = {
  brand?: StoreBrandSettings;
  theme?: StoreThemeSettings;
};

export type ProductVisibilitySettings = {
  enabled?: boolean;
  showOnHome?: boolean;
  showInCollections?: boolean;
  showPdp?: boolean;
  sortOrder?: number;
};

export type ProductCopyOverride = {
  nameAr?: string;
  shortDescriptionAr?: string;
  homepageSubtitle?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  problemTitle?: string;
  problemCopy?: string;
  solutionTitle?: string;
  solutionCopy?: string;
  highlightCopy?: string;
  finalCtaTitle?: string;
};

export type ProductMediaOverride = {
  cardImage?: string;
  heroImage?: string;
  heroAspect?: string;
  heroImageAlt?: string;
  painImage?: string;
  painAspect?: string;
  solutionImage?: string;
  solutionAspect?: string;
  lifestyleImage?: string;
  lifestyleAspect?: string;
};

export type ProductOverride = {
  visibility?: ProductVisibilitySettings;
  catalog?: {
    name_ar?: string;
    short_description_ar?: string;
    sku?: string;
    category_slug?: string;
    imageFile?: string;
    storeCardImageFile?: string;
  };
  bundles?: CatalogProduct["bundles"];
  copy?: ProductCopyOverride;
  media?: ProductMediaOverride;
};

export type StorefrontProduct = CatalogProduct & {
  visibility: Required<Omit<ProductVisibilitySettings, "sortOrder">> & {
    sortOrder: number;
  };
  dashboardOverride?: ProductOverride;
};

export type ResolvedProductPage = {
  product: StorefrontProduct;
  config: ProductPageConfig;
  croPage: CroProductPageConfig;
};
