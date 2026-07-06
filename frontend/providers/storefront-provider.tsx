"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_MARKET,
  type MarketId,
  marketFromCountry,
} from "@/config/markets";
import {
  formatStoreMoney,
  shippingCities,
  shippingNote,
  shippingTitle,
  shippingAllRegions,
  deliveryPartners,
  tUi,
  type StoreLocale,
  type UiKey,
} from "@/lib/storefront-i18n";
import { getMarketConfig } from "@/config/markets";

const MARKET_COOKIE = "mutqan_market";
const LOCALE_COOKIE = "mutqan_locale";

type StorefrontContextValue = {
  market: MarketId;
  locale: StoreLocale;
  setLocale: (locale: StoreLocale) => void;
  toggleLocale: () => void;
  t: (key: UiKey) => string;
  formatMoney: (amount: number) => string;
  shippingCities: string[];
  shippingTitle: string;
  shippingNote: string;
  shippingAllRegions: string;
  deliveryPartners: string[];
  phonePlaceholder: string;
  dir: "rtl" | "ltr";
  ready: boolean;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<MarketId>(DEFAULT_MARKET);
  const [locale, setLocaleState] = useState<StoreLocale>("ar");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedLocale = readCookie(LOCALE_COOKIE);
    if (savedLocale === "en" || savedLocale === "ar") {
      setLocaleState(savedLocale);
    }

    const savedMarket = readCookie(MARKET_COOKIE);
    if (savedMarket === "SA" || savedMarket === "AE") {
      setMarket(savedMarket);
      setReady(true);
      return;
    }

    fetch("/api/market")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { market?: MarketId; country?: string } | null) => {
        const detected = data?.market ?? marketFromCountry(data?.country);
        setMarket(detected);
        writeCookie(MARKET_COOKIE, detected);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale === "en" ? "en" : "ar";
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
  }, [locale, ready]);

  const setLocale = useCallback((next: StoreLocale) => {
    setLocaleState(next);
    writeCookie(LOCALE_COOKIE, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const value = useMemo<StorefrontContextValue>(
    () => ({
      market,
      locale,
      setLocale,
      toggleLocale,
      t: (key) => tUi(key, locale, market),
      formatMoney: (amount) => formatStoreMoney(amount, locale, market),
      shippingCities: shippingCities(locale, market),
      shippingTitle: shippingTitle(locale, market),
      shippingNote: shippingNote(locale, market),
      shippingAllRegions: shippingAllRegions(locale, market),
      deliveryPartners: deliveryPartners(locale, market),
      phonePlaceholder:
        locale === "en"
          ? getMarketConfig(market).phonePlaceholderEn
          : getMarketConfig(market).phonePlaceholderAr,
      dir: locale === "en" ? "ltr" : "rtl",
      ready,
    }),
    [locale, market, ready, setLocale, toggleLocale],
  );

  return (
    <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>
  );
}

export function useStorefront(): StorefrontContextValue {
  const ctx = useContext(StorefrontContext);
  if (!ctx) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return ctx;
}
