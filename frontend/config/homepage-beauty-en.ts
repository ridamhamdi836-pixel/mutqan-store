/** Homepage copy & presentation — English locale */
import { withImageVersion, SKINCARE_PRODUCT_IMAGE_VERSION } from "@/lib/image-display";
import { HOMEPAGE_HERO_IMAGE, type HomepageBeautyProduct } from "./homepage-beauty";

export const HOMEPAGE_BEAUTY_EN = {
  tagline: "Premium Korean skincare… for skin you can trust",

  announcement: "✓ Concentrated Korean boosters — thoughtful formulas with clear active ingredients",

  hero: {
    badge: "Premium Korean care • Concentrated formulas",
    headline: "Korean boosters for beauty that starts with your skin",
    subheadline:
      "Three concentrated boosters — targeting glow and dark spots, breakouts and irritation, and wrinkles and fine lines. Vitamin C, Centella, and PDRN at clear doses. Safe for daily use — no complexity, no empty promises.",
    trustPills: [
      { id: "korean", label: "Korean", sub: "Curated formulas" },
      { id: "actives", label: "Actives", sub: "Clear doses" },
      { id: "daily", label: "Daily", sub: "Skin-safe" },
      { id: "guarantee", label: "30 days", sub: "Money-back guarantee" },
    ],
    primaryCta: "Explore Korean boosters",
    guaranteeBadge: "30-day money-back guarantee",
    image: HOMEPAGE_HERO_IMAGE,
    imageAlt: "Mutqan Korean boosters — glow, repair, youth",
    imageBadgeTitle: "Concentrated Korean formulas",
    imageBadgeSub: "Mutqan — trusted care",
  },

  formulations: {
    label: "Our formulas",
    headline: "Three boosters. Three concerns. One clear solution.",
    subtitle:
      "Each booster targets a specific goal — use it alone or build a complete routine. Active ingredients at thoughtful doses, not random blends.",
  },

  bestSellers: {
    products: [
      {
        slug: "vitamin-c-booster",
        nameAr: "Brightening cream designed to even skin tone and fade dark spots",
        subtitle: "Glow · Even tone · Dark spots",
        description:
          "Concentrated ascorbic acid and niacinamide — targets spots and dullness for a more even complexion. A Korean formula for visible radiance within the first two weeks.",
        image: withImageVersion("/images/products/vitamin-c-booster.png", SKINCARE_PRODUCT_IMAGE_VERSION),
        imageAlt: "Brightening cream — Mutqan",
        goalLabel: "Glow",
        routineLabel: "Glow routine",
        accentColor: "#A89420",
        cardBg: "#EDE08A",
        ingredients: [
          "Ascorbic acid (Vitamin C)",
          "Niacinamide",
          "Glycerin",
          "Gardenia extract",
        ],
      },
      {
        slug: "ceramide-booster",
        nameAr: "Smoothing cream designed to calm breakouts and rough skin texture",
        subtitle: "Breakouts · Hydration · Silky skin",
        description:
          "Centella asiatica, ceramide NP, and panthenol — soothe breakouts, hydrate, and soften chicken-skin texture. For sensitive skin that needs relief, not complexity.",
        image: withImageVersion("/images/products/ceramide-booster.png", SKINCARE_PRODUCT_IMAGE_VERSION),
        imageAlt: "Smoothing cream — Mutqan",
        goalLabel: "Repair",
        routineLabel: "Repair routine",
        accentColor: "#5C6670",
        cardBg: "#D4D8DE",
        ingredients: [
          "Centella asiatica",
          "Ceramide NP",
          "Panthenol",
          "Niacinamide",
          "Tea tree",
        ],
      },
      {
        slug: "pdrn-booster",
        nameAr: "Firming cream designed to reduce wrinkles and fine lines",
        subtitle: "Wrinkles · Firmness · Elasticity",
        description:
          "PDRN, adenosine, and peptides — firm the look of skin and soften fine lines. Korean protein youth care in one step — no needles, no hype.",
        image: withImageVersion("/images/products/pdrn-booster.png", SKINCARE_PRODUCT_IMAGE_VERSION),
        imageAlt: "Firming cream — Mutqan",
        goalLabel: "Youth",
        routineLabel: "Youth routine",
        accentColor: "#C25D78",
        cardBg: "#F5B8C8",
        ingredients: [
          "PDRN (salmon DNA)",
          "Peptides",
          "Adenosine",
          "Multi-weight hyaluronic acid",
          "Ceramides",
        ],
      },
    ] satisfies HomepageBeautyProduct[],
  },

  whyMutqan: {
    label: "Why Mutqan",
    headline: "Korean skincare, not a random shop",
    subtitle:
      "We build your trust on four pillars: concentrated formulas, clear active ingredients, a 30-day guarantee, and cash on delivery.",
    cards: [
      {
        id: "formulas",
        title: "Concentrated formulas, not random blends",
        desc: "Every ingredient is chosen for its role — at a clear dose from a known source. No secret promises or vague ingredients.",
      },
      {
        id: "actives",
        title: "Active ingredients at thoughtful doses",
        desc: "Vitamin C, Centella, PDRN, ceramides — each booster targets your skin concern directly.",
      },
      {
        id: "guarantee",
        title: "30-day guarantee — cash on delivery",
        desc: "Not seeing a difference? We'll replace or refund. Pay only when your order arrives — zero risk.",
      },
      {
        id: "korean",
        title: "Curated premium Korean care",
        desc: "A simple, elegant experience — one step, a clear result. What you'd expect from a global skincare brand.",
      },
    ],
  },

  testimonials: {
    label: "Verified reviews",
    headline: "Customers who read the ingredients before ordering",
    subtitle:
      "Mutqan is chosen by people who don't trust every ad. You read the ingredients, checked the doses, then ordered with confidence.",
    items: [
      {
        name: "Noura Al-Qahtani",
        city: "Riyadh",
        age: "29",
        rating: 5,
        text: "I was looking for a cream that gives real glow without irritating my skin. After using the Vitamin C cream with niacinamide, my dark spots gradually faded and my skin looked more even and radiant. What I loved most is the natural glow without any heavy feeling.",
        verified: true,
      },
      {
        name: "Sara Al-Harbi",
        city: "Jeddah",
        age: "34",
        rating: 5,
        text: "Small breakouts and chicken skin on my arms had bothered me for years. After using the Centella and ceramide cream for a while, my skin became noticeably smoother and redness eased a lot. The hydration is excellent with no greasy residue.",
        verified: true,
      },
      {
        name: "Reem Al-Otaibi",
        city: "Khobar",
        age: "41",
        rating: 5,
        text: "I wanted something to improve the look of fine lines and wrinkles without a complicated routine. The PDRN cream with peptides gave my skin fullness and softness, and it felt more elastic with consistent use. Even my makeup sits better now.",
        verified: true,
      },
    ],
  },

  orderSteps: {
    label: "How it works",
    headline: "From order to your door in 3 steps",
    subtitle: "No online payment. No commitment. No risk.",
    steps: [
      {
        title: "Choose your routine",
        desc: "Three boosters for three concerns: glow and spots, breakouts and hydration, or wrinkles and fine lines. Pick one or the full routine.",
      },
      {
        title: "Confirm your order (no payment)",
        desc: "Just your name and phone number. Pay on delivery — our team will contact you to confirm your address.",
      },
      {
        title: "Receive and pay",
        desc: "We deliver to your door within 2–5 days, and you pay in cash or by card at delivery.",
      },
    ],
  },

  faq: {
    label: "FAQ",
    headline: "Questions before you order",
    subtitle: "Everything you need to know before cash on delivery.",
    items: [
      {
        question: "Are the boosters suitable for sensitive skin?",
        answer:
          "Our formulas are lightweight and designed for daily use. The ceramide cream is made for sensitive, breakout-prone skin. Start with one step, then build gradually.",
      },
      {
        question: "Is cash on delivery available in my area?",
        answer:
          "Yes, cash on delivery is available in most major cities. We confirm your address by phone before shipping.",
      },
      {
        question: "When will I see results?",
        answer:
          "Most customers notice smoother, more comfortable skin within two weeks. Glow and wrinkle improvements need 4–8 weeks of consistent use for clearer results.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "After confirmation: 1–2 business days to prepare, then 2–5 days delivery to major cities.",
      },
      {
        question: "What is the return guarantee?",
        answer:
          "30-day guarantee — not seeing a difference? Contact us on WhatsApp for a replacement or full refund.",
      },
      {
        question: "Can I use more than one booster together?",
        answer:
          "Yes. Vitamin C in the morning, ceramide or PDRN in the evening — a simple routine covering glow, repair, and youth.",
      },
    ],
  },

  finalCta: {
    label: "Start your routine",
    headline: "Your skin deserves science, not promises",
    description:
      "Start your Korean routine today. Cash on delivery, fast local shipping, and a 30-day money-back guarantee — a risk-free experience.",
    trustBadges: [
      { icon: "shield" as const, label: "30-day guarantee" },
      { icon: "truck" as const, label: "Fast local shipping" },
      { icon: "card" as const, label: "Cash on delivery" },
      { icon: "leaf" as const, label: "Clear active ingredients" },
    ],
    button: "Explore boosters now",
  },

  trustFooter: [
    {
      id: "shipping",
      title: "Fast local shipping",
      desc: "Delivery in 2 to 5 business days to most areas",
    },
    {
      id: "cod",
      title: "Cash on delivery",
      desc: "Pay when your order arrives at your door",
    },
    {
      id: "guarantee",
      title: "30-day money-back guarantee",
      desc: "Didn't love it? Didn't see a difference? Full refund",
    },
    {
      id: "actives",
      title: "Clear active ingredients",
      desc: "Every ingredient listed with its dose — no secrets",
    },
  ],
} as const;
