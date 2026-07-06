export type MarketId = "SA" | "AE";

export type MarketConfig = {
  id: MarketId;
  countryCode: "SA" | "AE";
  currency: "SAR" | "AED";
  currencySymbolAr: string;
  currencySymbolEn: string;
  phoneDialCode: string;
  timezone: string;
  sheetsCountry: "KSA" | "UAE";
  countryNameAr: string;
  countryNameEn: string;
  phonePlaceholderAr: string;
  phonePlaceholderEn: string;
  shippingCitiesAr: readonly string[];
  shippingCitiesEn: readonly string[];
  shippingTitleAr: string;
  shippingTitleEn: string;
  shippingNoteAr: string;
  shippingNoteEn: string;
  shippingAllRegionsAr: string;
  shippingAllRegionsEn: string;
  deliveryPartnersAr: readonly string[];
  deliveryPartnersEn: readonly string[];
};

export const DEFAULT_MARKET: MarketId = "SA";

export const MARKETS: Record<MarketId, MarketConfig> = {
  SA: {
    id: "SA",
    countryCode: "SA",
    currency: "SAR",
    currencySymbolAr: "ر.س",
    currencySymbolEn: "SAR",
    phoneDialCode: "966",
    timezone: "Asia/Riyadh",
    sheetsCountry: "KSA",
    countryNameAr: "المملكة العربية السعودية",
    countryNameEn: "Saudi Arabia",
    phonePlaceholderAr: "05XXXXXXXX أو 01XXXXXXX",
    phonePlaceholderEn: "05XXXXXXXX or 01XXXXXXX",
    shippingCitiesAr: [
      "الرياض",
      "جدة",
      "مكة",
      "المدينة",
      "الدمام",
      "الخبر",
      "الطائف",
      "تبوك",
      "أبها",
      "حائل",
      "نجران",
      "جازان",
    ],
    shippingCitiesEn: [
      "Riyadh",
      "Jeddah",
      "Makkah",
      "Madinah",
      "Dammam",
      "Khobar",
      "Taif",
      "Tabuk",
      "Abha",
      "Hail",
      "Najran",
      "Jazan",
    ],
    shippingTitleAr: "نوصل لكل مدن المملكة",
    shippingTitleEn: "We deliver across Saudi Arabia",
    shippingNoteAr:
      "شركاء التوصيل: أرامكس، SMSA، ريدبوكس — 2 إلى 5 أيام عمل داخل المملكة.",
    shippingNoteEn:
      "Delivery partners: Aramex, SMSA, Redbox — 2 to 5 business days within Saudi Arabia.",
    shippingAllRegionsAr: "+ كل المناطق داخل المملكة",
    shippingAllRegionsEn: "+ All regions across Saudi Arabia",
    deliveryPartnersAr: ["أرامكس", "SMSA", "ريدبوكس"],
    deliveryPartnersEn: ["Aramex", "SMSA", "Redbox"],
  },
  AE: {
    id: "AE",
    countryCode: "AE",
    currency: "AED",
    currencySymbolAr: "د.إ",
    currencySymbolEn: "AED",
    phoneDialCode: "971",
    timezone: "Asia/Dubai",
    sheetsCountry: "UAE",
    countryNameAr: "دولة الإمارات العربية المتحدة",
    countryNameEn: "United Arab Emirates",
    phonePlaceholderAr: "05XXXXXXXX",
    phonePlaceholderEn: "05XXXXXXXX",
    shippingCitiesAr: [
      "دبي",
      "أبوظبي",
      "الشارقة",
      "عجمان",
      "أم القيوين",
      "رأس الخيمة",
      "الفجيرة",
      "العين",
    ],
    shippingCitiesEn: [
      "Dubai",
      "Abu Dhabi",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
      "Al Ain",
    ],
    shippingTitleAr: "نوصل لكل إمارات الدولة",
    shippingTitleEn: "We deliver across the UAE",
    shippingNoteAr:
      "شركاء التوصيل: أرامكس، SMSA — 2 إلى 5 أيام عمل داخل الإمارات.",
    shippingNoteEn:
      "Delivery partners: Aramex, SMSA — 2 to 5 business days within the UAE.",
    shippingAllRegionsAr: "+ كل إمارات الدولة",
    shippingAllRegionsEn: "+ All emirates across the UAE",
    deliveryPartnersAr: ["أرامكس", "SMSA"],
    deliveryPartnersEn: ["Aramex", "SMSA"],
  },
};

export function marketFromCountry(code: string | undefined | null): MarketId {
  if (code === "AE") return "AE";
  return "SA";
}

export function getMarketConfig(market: MarketId): MarketConfig {
  return MARKETS[market];
}
