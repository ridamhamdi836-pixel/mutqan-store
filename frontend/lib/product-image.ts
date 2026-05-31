import { CATALOG_BY_SLUG } from "@/config/catalog";
import { PRODUCTS_CONFIG } from "@/config/products";

/** Bump when replacing product image (cache bust) */
const IMAGE_VERSION: Record<string, number> = {
  "magic-under-sink-organizer": 5,
  "magic-under-sink-organizer:main": 2,
  "smart-stackable-cabinet": 3,
  "smart-stackable-cabinet:card": 1,
  "smart-stackable-cabinet:main": 3,
  "pull-out-cabinet-drawer:card": 1,
  "pull-out-cabinet-drawer:main": 1,
  "smart-table-warmer:card": 1,
  "smart-table-warmer:main": 1,
};

type ImageVariant = "card" | "main";

function heroImageFile(slug: string): string | undefined {
  const path = PRODUCTS_CONFIG[slug]?.heroSectionImage;
  if (!path) return undefined;
  const withoutQuery = path.split("?")[0];
  const name = withoutQuery.split("/").pop();
  return name || undefined;
}

function imageQuery(slug: string, variant?: ImageVariant): string {
  const key = variant ? `${slug}:${variant}` : slug;
  const version = IMAGE_VERSION[key] ?? IMAGE_VERSION[slug];
  if (!version) return variant ? `?variant=${variant}` : "";
  return variant ? `?variant=${variant}&v=${version}` : `?v=${version}`;
}

/**
 * Served via /api/product-image/[slug] so images work in standalone Docker
 * (public/ static files are often missing on Easypanel misconfigured deploys).
 */
export function getProductImageSrc(slug: string): string {
  return `/api/product-image/${slug}${imageQuery(slug)}`;
}

/** Cart, checkout, and sticky bar — product page hero when configured */
export function getProductMainImageSrc(slug: string): string {
  if (heroImageFile(slug)) {
    return `/api/product-image/${slug}${imageQuery(slug, "main")}`;
  }
  return getProductImageSrc(slug);
}

/** Store listing cards — may use a different photo than the product page */
export function getProductCardImageSrc(slug: string): string {
  const product = CATALOG_BY_SLUG[slug];
  if (product?.storeCardImageFile) {
    return `/api/product-image/${slug}${imageQuery(slug, "card")}`;
  }
  return getProductImageSrc(slug);
}

export function getProductOgImageUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
  return `${base}${getProductImageSrc(slug)}`;
}

/** Legacy path for static files (rewritten to API) */
export function getLegacyStaticImagePath(slug: string): string {
  const file = CATALOG_BY_SLUG[slug]?.imageFile ?? `${slug}.jpg`;
  return `/images/products/${file}`;
}
