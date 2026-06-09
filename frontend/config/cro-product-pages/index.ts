import type { CroProductPageConfig } from "@/types/cro-product-page";
import {
  powerfulCordlessVacuumCroPage,
  pullOutCabinetDrawerCroPage,
  pureFaucetFilterCroPage,
  smartStackableCabinetCroPage,
  smartTableWarmerCroPage,
  thermalLunchBoxCroPage,
} from "./catalog";
import { sinkOrganizerCroPage } from "./sink-organizer";

const CRO_PRODUCT_PAGES: Record<string, CroProductPageConfig> = {
  "sink-organizer": sinkOrganizerCroPage,
  "powerful-cordless-vacuum": powerfulCordlessVacuumCroPage,
  "smart-stackable-cabinet": smartStackableCabinetCroPage,
  "pull-out-cabinet-drawer": pullOutCabinetDrawerCroPage,
  "pure-faucet-filter": pureFaucetFilterCroPage,
  "smart-table-warmer": smartTableWarmerCroPage,
  "thermal-lunch-box": thermalLunchBoxCroPage,
};

export function getCroProductPage(slug: string): CroProductPageConfig {
  const page = CRO_PRODUCT_PAGES[slug];
  if (!page) {
    throw new Error(`Missing CRO product page config for slug: ${slug}`);
  }
  return page;
}

export function hasCroProductPage(slug: string): boolean {
  return slug in CRO_PRODUCT_PAGES;
}
