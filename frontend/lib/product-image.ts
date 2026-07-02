import { CATALOG_BY_SLUG, resolveProductSlug } from "@/config/catalog";
import { getHomepageProductImageSrc } from "@/lib/storefront-product-image";

/** Bump when replacing product image (cache bust) */
const IMAGE_VERSION: Record<string, number> = {
  "sink-organizer": 5,
  "sink-organizer:main": 3,
  "sink-organizer:card": 1,
  "powerful-cordless-vacuum:main": 1,
  "powerful-cordless-vacuum:card": 1,
  storage: 3,
  "storage:card": 1,
  "storage:main": 3,
  "pull-out-cabinet-drawer:card": 1,
  "pull-out-cabinet-drawer:main": 1,
  "smart-table-warmer:card": 1,
  "smart-table-warmer:main": 1,
  "pure-faucet-filter:main": 1,
  "pure-faucet-filter:card": 1,
  "thermal-lunch-box:main": 5,
  "thermal-lunch-box:card": 1,
};

type ImageVariant = "card" | "main";

function imageQuery(slug: string, variant?: ImageVariant): string {
  const key = variant ? `${slug}:${variant}` : slug;
  const version = IMAGE_VERSION[key] ?? IMAGE_VERSION[slug];
  if (!version) return variant ? `?variant=${variant}` : "";
  return variant ? `?variant=${variant}&v=${version}` : `?v=${version}`;
}

function staticProductImage(filename: string): string {
  return `/images/products/${filename}`;
}

/** Prefer homepage product card image everywhere in the storefront. */
export function getProductImageSrc(slug: string): string {
  const fromHomepage = getHomepageProductImageSrc(slug);
  if (fromHomepage) return fromHomepage;

  const resolved = resolveProductSlug(slug);
  const product = CATALOG_BY_SLUG[resolved];
  if (product?.imageFile) {
    return staticProductImage(product.imageFile);
  }
  return `/api/product-image/${resolved}${imageQuery(resolved)}`;
}

/** Cart, checkout, sticky bar, thank-you — same image as homepage cards */
export function getProductMainImageSrc(slug: string): string {
  return getProductImageSrc(slug);
}

/** Store listing cards — same homepage image when available */
export function getProductCardImageSrc(slug: string): string {
  return getProductImageSrc(slug);
}

export function getProductOgImageUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
  return `${base}${getProductImageSrc(slug)}`;
}

/** Legacy path for static files (rewritten to API) */
export function getLegacyStaticImagePath(slug: string): string {
  const resolved = resolveProductSlug(slug);
  const file = CATALOG_BY_SLUG[resolved]?.imageFile ?? `${resolved}.jpg`;
  return `/images/products/${file}`;
}
