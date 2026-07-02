import type { CroProductPageConfig } from "@/types/cro-product-page";
import { resolveProductSlug } from "@/config/catalog";
import {
  powerfulCordlessVacuumCroPage,
  pullOutCabinetDrawerCroPage,
  pureFaucetFilterCroPage,
  smartStackableCabinetCroPage,
  smartTableWarmerCroPage,
  thermalLunchBoxCroPage,
} from "./catalog";
import { sinkOrganizerCroPage } from "./sink-organizer";
import {
  beautyVanityCabinetCroPage,
  ledMakeupBagCroPage,
  makeupBrushCleanerCroPage,
  rotatingBrushOrganizerCroPage,
} from "./beauty-products";
import {
  vitaminCBoosterCroPage,
  ceramideBoosterCroPage,
  pdrnBoosterCroPage,
} from "./skincare-products";

const CRO_PRODUCT_PAGES: Record<string, CroProductPageConfig> = {
  "sink-organizer": sinkOrganizerCroPage,
  "powerful-cordless-vacuum": powerfulCordlessVacuumCroPage,
  "storage": smartStackableCabinetCroPage,
  "pull-out-cabinet-drawer": pullOutCabinetDrawerCroPage,
  "pure-faucet-filter": pureFaucetFilterCroPage,
  "smart-table-warmer": smartTableWarmerCroPage,
  "thermal-lunch-box": thermalLunchBoxCroPage,
  "beauty-vanity-cabinet": beautyVanityCabinetCroPage,
  "led-makeup-bag": ledMakeupBagCroPage,
  "makeup-brush-cleaner": makeupBrushCleanerCroPage,
  "rotating-brush-organizer": rotatingBrushOrganizerCroPage,
  "vitamin-c-booster": vitaminCBoosterCroPage,
  "ceramide-booster": ceramideBoosterCroPage,
  "pdrn-booster": pdrnBoosterCroPage,
};

export function getCroProductPage(slug: string): CroProductPageConfig {
  const resolved = resolveProductSlug(slug);
  const page = CRO_PRODUCT_PAGES[resolved];
  if (!page) {
    throw new Error(`Missing CRO product page config for slug: ${resolved}`);
  }
  return page;
}

export function hasCroProductPage(slug: string): boolean {
  return resolveProductSlug(slug) in CRO_PRODUCT_PAGES;
}
