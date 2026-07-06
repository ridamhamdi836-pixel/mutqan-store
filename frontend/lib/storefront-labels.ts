import type { ProductBundle } from "@/types";
import { getCatalogNameAr, getProduct } from "@/config/catalog";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
import { getHomepageBeauty } from "@/config/homepage-beauty-i18n";
import type { StoreLocale } from "@/lib/storefront-i18n";

export function getBundleLabel(bundle: ProductBundle, locale: StoreLocale): string {
  if (locale === "en" && bundle.label_en) return bundle.label_en;
  return bundle.label_ar;
}

export function getStorefrontProductName(slug: string, locale: StoreLocale): string {
  const homepage = getHomepageBeauty(locale);
  const fromHomepage = homepage.bestSellers.products.find((p) => p.slug === slug);
  if (fromHomepage?.nameAr) return fromHomepage.nameAr;
  const catalog = getProduct(slug);
  if (locale === "en" && catalog?.name_en) return catalog.name_en;
  return getCatalogNameAr(slug);
}

/** @deprecated use getStorefrontProductName(slug, locale) */
export function getStorefrontProductNameAr(slug: string): string {
  const fromHomepage = HOMEPAGE_BEAUTY.bestSellers.products.find((p) => p.slug === slug);
  return fromHomepage?.nameAr ?? getCatalogNameAr(slug);
}
