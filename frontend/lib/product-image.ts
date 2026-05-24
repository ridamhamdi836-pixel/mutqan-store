import { CATALOG_BY_SLUG } from "@/config/catalog";

export function getProductImageSrc(slug: string): string {
  const file = CATALOG_BY_SLUG[slug]?.imageFile ?? `${slug}.jpg`;
  return `/images/products/${file}`;
}

export function getProductOgImageUrl(slug: string, siteUrl?: string): string {
  const base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";
  return `${base}${getProductImageSrc(slug)}`;
}
