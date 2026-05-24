import { CATALOG_BY_SLUG } from "@/config/catalog";

/** Bump when replacing a product image file (cache bust) */
const IMAGE_VERSION: Record<string, number> = {
  "magic-under-sink-organizer": 4,
};

export function getProductImageSrc(slug: string): string {
  const file = CATALOG_BY_SLUG[slug]?.imageFile ?? `${slug}.jpg`;
  const version = IMAGE_VERSION[slug];
  return version ? `/images/products/${file}?v=${version}` : `/images/products/${file}`;
}

export function getProductOgImageUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
  return `${base}${getProductImageSrc(slug)}`;
}
