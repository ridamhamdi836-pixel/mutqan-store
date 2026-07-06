import type { MarketId } from "@/config/markets";
import { getMarketConfig } from "@/config/markets";
import {
  formatStoreMoney,
  type StoreLocale,
} from "@/lib/storefront-i18n";

/** @deprecated use formatStoreMoney via useStorefront */
export function formatSAR(amount: number): string {
  return `${amount.toLocaleString("ar-SA")} ريال`;
}

/** @deprecated use formatStoreMoney via useStorefront */
export function formatSARCompact(amount: number): string {
  return `${amount} ر.س`;
}

export function formatMoney(
  amount: number,
  market: MarketId = "SA",
  locale: StoreLocale = "ar",
): string {
  return formatStoreMoney(amount, locale, market);
}

export function marketCurrency(market: MarketId): "SAR" | "AED" {
  return getMarketConfig(market).currency;
}
