import { CATALOG, getProduct } from "@/config/catalog";
import { THANK_YOU_BESTSELLER_SLUGS } from "@/config/thank-you";
import { PRODUCTS_CONFIG } from "@/config/products";
import { getProductCardImageSrc } from "@/lib/product-image";

export type UpsellProductDetail = {
  slug: string;
  isBestseller: boolean;
  name_ar: string;
  short_description_ar: string;
  image: string;
  hook_ar: string;
  original_price_sar: number;
  upsell_price_sar: number;
  savings_percent: number;
  benefits: string[];
  shortPromise: string;
  reviews: Array<{
    name: string;
    city: string;
    rating: number;
    text: string;
    photo?: string;
    photoAlt?: string;
    photoAspect?: string;
  }>;
};

export function getUpsellProductDetail(slug: string): UpsellProductDetail | null {
  const catalog = getProduct(slug);
  if (!catalog?.upsell) return null;

  const page = PRODUCTS_CONFIG[slug];
  const u = catalog.upsell;

  return {
    slug,
    isBestseller: THANK_YOU_BESTSELLER_SLUGS.has(slug),
    name_ar: catalog.name_ar,
    short_description_ar: catalog.short_description_ar,
    image: getProductCardImageSrc(slug),
    hook_ar: u.hook_ar,
    original_price_sar: u.original_price_sar,
    upsell_price_sar: u.upsell_price_sar,
    savings_percent: Math.round(
      ((u.original_price_sar - u.upsell_price_sar) / u.original_price_sar) * 100,
    ),
    benefits: page?.benefits?.slice(0, 4) ?? [],
    shortPromise: page?.shortPromise ?? catalog.short_description_ar,
    reviews: page?.reviews?.slice(0, 4) ?? [],
  };
}

export function listThankYouUpsellProducts(orderedSlugs: string[]): UpsellProductDetail[] {
  return CATALOG.filter((p) => p.upsell && !orderedSlugs.includes(p.slug))
    .slice(0, 3)
    .map((p) => getUpsellProductDetail(p.slug)!)
    .filter(Boolean);
}

export function hasPostPurchaseUpsell(orderedSlugs: string[]): boolean {
  return listThankYouUpsellProducts(orderedSlugs).length > 0;
}
