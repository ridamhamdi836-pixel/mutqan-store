import type { SkincareProductSlug } from "@/config/cro-product-pages/skincare-nama-pages";

type FaqItem = { question: string; answer: string };

export const SKINCARE_PRODUCT_FAQS_EN: Record<SkincareProductSlug, FaqItem[]> = {
  "vitamin-c-booster": [
    {
      question: "Is it suitable for sensitive skin?",
      answer: "Yes — the formula is lightweight and suitable for most skin types.",
    },
    {
      question: "When should I use it?",
      answer: "In the morning, before moisturizer and sunscreen.",
    },
    {
      question: "Is it cash on delivery?",
      answer: "Yes — pay only when your order arrives.",
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes — 30-day money-back guarantee.",
    },
  ],
  "ceramide-booster": [
    {
      question: "Is it for dry skin?",
      answer: "Yes — ideal for barrier repair and deep hydration.",
    },
    {
      question: "When should I use it?",
      answer: "In the evening, before your night moisturizer.",
    },
    {
      question: "Is it cash on delivery?",
      answer: "Yes — pay only when your order arrives.",
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes — 30-day money-back guarantee.",
    },
  ],
  "pdrn-booster": [
    {
      question: "What age is it for?",
      answer: "For anyone noticing loss of firmness or fine lines.",
    },
    {
      question: "How often should I use it?",
      answer: "Once or twice daily, depending on your routine.",
    },
    {
      question: "Is it cash on delivery?",
      answer: "Yes — pay only when your order arrives.",
    },
    {
      question: "Is there a guarantee?",
      answer: "Yes — 30-day money-back guarantee.",
    },
  ],
};

export function getSkincareProductFaqs(slug: string, locale: "ar" | "en"): FaqItem[] | null {
  if (locale !== "en") return null;
  if (slug in SKINCARE_PRODUCT_FAQS_EN) {
    return SKINCARE_PRODUCT_FAQS_EN[slug as SkincareProductSlug];
  }
  return null;
}
