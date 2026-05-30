import { CATALOG_BY_SLUG } from "@/config/catalog";

/** Bump when replacing product image (cache bust) */
const IMAGE_VERSION: Record<string, number> = {
  "magic-under-sink-organizer": 5,
  "smart-stackable-cabinet": 1,
};

/**
 * Served via /api/product-image/[slug] so images work in standalone Docker
 * (public/ static files are often missing on Easypanel misconfigured deploys).
 */
export function getProductImageSrc(slug: string): string {
  const version = IMAGE_VERSION[slug];
  const q = version ? `?v=${version}` : "";
  return `/api/product-image/${slug}${q}`;
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
