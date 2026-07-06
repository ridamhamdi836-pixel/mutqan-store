import type { StoreLocale } from "@/lib/storefront-i18n";
import { HOMEPAGE_BEAUTY } from "./homepage-beauty";
import { HOMEPAGE_BEAUTY_EN } from "./homepage-beauty-en";

export function getHomepageBeauty(locale: StoreLocale) {
  return locale === "en" ? HOMEPAGE_BEAUTY_EN : HOMEPAGE_BEAUTY;
}
