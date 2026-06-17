export const BRAND = {
  nameAr: "متقن",
  nameEn: "Mutqan",
  /** SVG brand assets; UI uses BrandLogo for crisp inline rendering */
  logoSrc: "/images/brand/mutqan-logo-horizontal.svg",
  logoSrcLight: "/images/brand/mutqan-logo-white-navy.svg",
  taglineAr: "تفاصيل أجمل… لأنك تستحقين الأفضل",
  domain: "mutqan.online",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212717783042",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@mutqan.online",
  currency: "SAR",
  country: "SA",
};

export const TRUST_BADGES = [
  { id: "cod", icon: "💳", label: "الدفع عند الاستلام" },
  { id: "confirm", icon: "✅", label: "تأكيد قبل الشحن" },
  { id: "delivery", icon: "🚚", label: "توصيل داخل السعودية" },
  { id: "support", icon: "💬", label: "دعم عبر واتساب" },
];

export const WHATSAPP_URL = (message?: string) => {
  const base = `https://wa.me/${BRAND.whatsappNumber}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
};
