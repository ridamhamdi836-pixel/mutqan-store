import type { StoreLocale } from "@/lib/storefront-i18n";
import { BRAND } from "@/config/brand";
import { FOOTER_CONTENT } from "./footer";

const FOOTER_CONTENT_EN = {
  description:
    "A premium Korean skincare store — concentrated boosters with clear actives, cash on delivery across your country.",
  trustPills: ["Authentic Korean", "Clear ingredients", "30-day guarantee"] as const,
  products: {
    title: "Boosters",
    links: [
      { label: "Full collection", href: "/collections" },
      { label: "Vitamin C booster", href: "/products/glow" },
      { label: "Centella & ceramide booster", href: "/products/repair" },
      { label: "PDRN & peptides booster", href: "/products/youth" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms" },
      { label: "Shipping & delivery", href: "/shipping" },
      { label: "About Mutqan", href: "/about" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "WhatsApp", href: "whatsapp" as const },
      { label: BRAND.supportEmail, href: `mailto:${BRAND.supportEmail}` },
    ],
    notes: ["Local shipping only", "Cash on delivery"],
  },
  copyright: `© ${new Date().getFullYear()} Mutqan. All rights reserved.`,
} as const;

export function getFooterContent(locale: StoreLocale) {
  return locale === "en" ? FOOTER_CONTENT_EN : FOOTER_CONTENT;
}
