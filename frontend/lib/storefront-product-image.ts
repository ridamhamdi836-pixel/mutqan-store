import { resolveProductSlug } from "@/config/catalog";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";

/** Homepage card image — single source of truth for storefront product photos. */
export function getHomepageProductImageSrc(slug: string): string | undefined {
  const resolved = resolveProductSlug(slug);
  return HOMEPAGE_BEAUTY.bestSellers.products.find((p) => p.slug === resolved)?.image;
}

export function getHomepageProductImageAlt(slug: string): string | undefined {
  const resolved = resolveProductSlug(slug);
  return HOMEPAGE_BEAUTY.bestSellers.products.find((p) => p.slug === resolved)?.imageAlt;
}
