import type { StoreLocale } from "@/lib/storefront-i18n";
import { ABOUT_BEAUTY } from "./about-beauty";

export const ABOUT_BEAUTY_EN = {
  hero: {
    badge: "Premium Korean skincare",
    titleLine1: "Mutqan Beauty",
    titleLine2: "Korean care focused on what your skin needs",
    subtitle:
      "Mutqan is not a random store. We offer concentrated Korean boosters — thoughtful formulas with clear active ingredients, targeting glow, repair, and youth in one daily step.",
  },
  story: {
    label: "Our story",
    title: "Born from a gap that needed closing",
    paragraphs: [
      "We saw a clear gap in skincare: between unreliable social-media products and expensive European routines that don't suit our climate or lifestyle.",
      "Women buying dozens of products without knowing what they put on their skin — or when they'd see a difference.",
      "Mutqan came to close that gap: three Korean boosters, three specific concerns, one simple routine. Glow, repair, youth — without complexity or empty promises.",
    ],
    quote:
      "«If you can read the ingredients and understand their role, you deserve a brand that writes them honestly»",
  },
  pillars: {
    label: "Four pillars",
    title: "Four pillars we never compromise on",
    subtitle: "If one is missing, we don't launch the product. Ever.",
    items: [
      {
        id: "korean",
        title: "Concentrated Korean formulas",
        desc: "Each booster is chosen for its role — vitamin C for glow, centella for repair, PDRN for youth. No random blends.",
      },
      {
        id: "actives",
        title: "Clear active ingredients",
        desc: "Every ingredient listed with its role and dose. Niacinamide, ceramides, peptides — no vague promises.",
      },
      {
        id: "simple",
        title: "Three goals — no overwhelm",
        desc: "One routine per concern. Use one booster or build a full routine — without ten steps.",
      },
      {
        id: "experience",
        title: "A comfortable local experience",
        desc: "Cash on delivery, support in your language, fast local shipping, and a 30-day guarantee — risk-free.",
      },
    ],
  },
  promise: {
    label: "Our promise",
    title: "The Mutqan promise to every customer",
    items: [
      "Every ingredient listed with its role — no secrets.",
      "Every booster targets one clear skin goal.",
      "Every formula inspired by thoughtful Korean care — no hype.",
      "Every order is cash on delivery — because we trust you.",
      "Every customer has 30 days for a full refund.",
      "Every batch meets clear quality standards before shipping.",
    ],
  },
  finalCta: {
    title: "Ready to try a simple Korean routine?",
    buttonLabel: "Explore Korean boosters",
    buttonHref: "/collections",
  },
  trust: [
    {
      id: "shipping",
      title: "Fast local shipping",
      desc: "2 to 5 business days to all regions",
    },
    {
      id: "cod",
      title: "Cash on delivery",
      desc: "Pay only when your order arrives at your door",
    },
    {
      id: "guarantee",
      title: "30-day money-back guarantee",
      desc: "Didn't love it? Didn't see results? Full refund",
    },
    {
      id: "actives",
      title: "Clear active ingredients",
      desc: "Every ingredient listed with its dose — no secrets",
    },
  ],
} as const;

export function getAboutBeauty(locale: StoreLocale) {
  return locale === "en" ? ABOUT_BEAUTY_EN : ABOUT_BEAUTY;
}
