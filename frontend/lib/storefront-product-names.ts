import { getCatalogNameAr, resolveProductSlug } from "@/config/catalog";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";

/** Customer-facing Arabic product name — matches homepage cards when available. */
export function getStorefrontProductNameAr(slug: string): string {
  const resolved = resolveProductSlug(slug);
  const fromHomepage = HOMEPAGE_BEAUTY.bestSellers.products.find((p) => p.slug === resolved);
  return fromHomepage?.nameAr ?? getCatalogNameAr(slug);
}
