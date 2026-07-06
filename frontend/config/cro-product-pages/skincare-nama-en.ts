import type { SkincareNamaPageConfig } from "@/types/skincare-nama-page";
import type { SkincareProductSlug } from "./skincare-nama-pages";

const SHARED_SHIPPING_EN = {
  title: "We deliver across the country",
  cities: [
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
  note: "Delivery partners: Aramex, SMSA, Redbox — 2 to 5 business days nationwide.",
  upsellNote:
    "After ordering, you can add items to the same shipment at a special price before final confirmation.",
};

const SHARED_ORDER_STEPS_EN = {
  title: "How your order arrives — simply",
  subtitle:
    "No online payment, no commitment, no surprises. You choose, we deliver.",
  steps: [
    {
      n: 1,
      title: "Choose your offer now",
      desc: "One or two units — no upfront payment. Tap and fill in your details only.",
    },
    {
      n: 2,
      title: "We call to confirm",
      desc: "Our team verifies your address and quantity before shipping — no pressure, no surprises.",
    },
    {
      n: 3,
      title: "Receive and pay at the door",
      desc: "Delivery in 2–5 days. Pay cash or by card only when your order arrives.",
    },
  ],
};

const SHARED_GUARANTEE_STEPS_EN = [
  { title: "Contact us", desc: "WhatsApp or phone — we reply during business hours." },
  { title: "Return the product", desc: "Even if opened and partially used — no hassle." },
  { title: "Full refund", desc: "Refund or exchange within 30 days — no awkward questions." },
];

const vitaminCNamaPageEn: SkincareNamaPageConfig = {
  hero: {
    headline: "Dark spots and dullness are hiding your natural glow",
    subheadline:
      "It is not a lack of creams. Skin loses its radiance when cell turnover slows and pigmentation builds beneath the surface. Vitamin C & Niacinamide Booster — a concentrated cream that targets the cause from within, not just the surface.",
    urgencyLine: "Last 48 hours for free shipping this week",
    imageBadges: ["Booster cream", "30-day guarantee", "Light layer", "Cash on delivery"],
    quickStats: [
      { value: "30", label: "days per jar" },
      { value: "Korean", label: "original formula" },
      { value: "30", label: "day guarantee" },
      { value: "COD", label: "pay on delivery" },
    ],
  },
  problemSection: {
    eyebrow: "Does this sound familiar?",
    title: "Problems you know — solutions from within",
    subtitle: "We ease the symptoms and target the cause — one ingredient for each concern.",
    statValue: "78%",
    statText:
      "of women in the Gulf notice dullness or dark spots before age 30 — due to sun, dryness, and lack of targeted care.",
    statSource: "Clinical studies in cosmetic dermatology",
  },
  problemPairs: [
    {
      problem: "My skin looks dull despite every cream — the mirror does not reflect the glow I want",
      solution:
        "Vitamin C supports radiance from within and gradually evens skin tone — a glow you notice within the first two weeks.",
    },
    {
      problem: "Dark spots will not fade — every new product disappoints me",
      solution:
        "Niacinamide at a clear, effective dose helps reduce the look of spots and improve skin texture — without irritation.",
    },
    {
      problem: "I am afraid to try new creams — my skin is sensitive and reacts quickly",
      solution:
        "A lightweight, fast-absorbing cream — designed for daily use with your moisturizer and sunscreen.",
    },
    {
      problem: "My routine is too complicated — I do not have time for ten steps every morning",
      solution:
        "One step: a thin layer in the morning. Simple, effective, and fits your existing routine.",
    },
  ],
  ingredients: {
    title: "The secret is concentration, not a long list",
    subtitle:
      "Every ingredient at a studied dose — no random blends, no hidden promises. A concentrated Korean formula for real radiance.",
    items: [
      {
        title: "Ascorbic Acid (Vitamin C)",
        dose: "Concentrated",
        desc: "A powerful antioxidant that supports skin radiance and evens tone — results start from within.",
        highlight: "Noticeable glow within two weeks with consistent use",
      },
      {
        title: "Niacinamide",
        dose: "Active",
        desc: "Helps reduce the appearance of dark spots and improve skin texture — gentle on sensitive skin.",
        highlight: "Clearer, smoother skin week by week",
      },
      {
        title: "Soothing extracts",
        dose: "Balanced",
        desc: "For a comfortable experience without heaviness — a light texture that layers with the rest of your routine.",
        highlight: "Instant comfort — no excess oil",
      },
    ],
    freeFrom: [
      "No strong fragrances",
      "No harsh alcohol",
      "Paraben-free",
      "Not tested on animals",
      "Lightweight formula",
      "Suitable for daily use",
    ],
  },
  authority: {
    title: "A studied formula, not empty promises",
    subtitle:
      "Active ingredients at clear doses, backed by Korean skincare research, chosen for real results.",
    trustPills: ["Korean skincare", "GMP", "Transparent ingredients", "30-day guarantee"],
    stats: [
      { value: "+800", label: "happy customers" },
      { value: "+40", label: "studies supporting ingredients" },
      { value: "30 days", label: "full refund guarantee" },
      { value: "4.9★", label: "average customer rating" },
    ],
    expertQuote:
      "Vitamin C with niacinamide is one of the most studied combinations for evening tone and boosting radiance. Dose and stability matter more than ingredient count — and that is what Mutqan delivers.",
    expertTitle: "Korean Skincare Specialist — Mutqan",
  },
  timeline: {
    badge: "Results from the first jar",
    title: "What to expect in your first 30 days",
    subtitle: "Your skin changes week by week — your face shows it before you say it.",
    steps: [
      {
        period: "1",
        title: "First 7 days",
        desc: "A natural glow and fresh feel. Pores start to look smaller and skin feels more alive from the first use.",
      },
      {
        period: "2",
        title: "Week two",
        desc: "Dark spots begin to fade. Skin tone looks clearer and more even — even without heavy makeup.",
      },
      {
        period: "3",
        title: "End of first jar",
        desc: "A visible before-and-after difference. Even, radiant skin — the second jar locks in results and saves more.",
      },
    ],
    footerNote:
      "The second jar saves more and locks in your glow — do not stop at the first result.",
  },
  longReviews: {
    title: "What Mutqan customers say",
    subtitle: "Real experiences from verified purchases — unfiltered and genuine.",
    items: [
      {
        name: "Noura Al-Qahtani",
        age: "29",
        city: "Riyadh",
        rating: 5,
        text: "I had tried every brightening cream with no luck. My skin was dull and spots would not budge. I read about Vitamin C and niacinamide in Mutqan Booster and tried it without high expectations. By week two I felt a difference — natural glow and fading spots. It is now a fixed part of my morning routine before sunscreen.",
      },
      {
        name: "Reem Al-Harbi",
        age: "32",
        city: "Jeddah",
        rating: 5,
        text: "My skin is sensitive and every new cream makes me red. This booster is light — no heaviness, no irritation. I use it in the morning with my usual moisturizer and the results were gradual but clear. Tone is more even and skin is smoother. Best part: one thin layer and done.",
      },
      {
        name: "Dana Al-Otaibi",
        age: "36",
        city: "Dammam",
        rating: 5,
        text: "I used to cover spots with concealer every day. After a month of regular use, spots are much lighter — even my husband noticed before I told him. I ordered a second jar because the bundle saves more and I do not want to go back to dull skin.",
      },
    ],
  },
  comparison: {
    title: "Compare — and decide for yourself",
    subtitle:
      "Every alternative you have tried, why it fell short, and how Mutqan works differently.",
    alternatives: [
      {
        title: "Random brightening creams",
        priceRange: "80–250 SAR",
        cons: [
          "Low active ingredient concentration",
          "Surface results that fade quickly",
          "Some irritate sensitive skin",
        ],
      },
      {
        title: "One-day glow masks",
        priceRange: "30–120 SAR",
        cons: [
          "Radiance for one day only",
          "Does not address spot causes",
          "Impractical for daily use",
        ],
      },
      {
        title: "Cheap boosters with weak doses",
        priceRange: "50–150 SAR",
        cons: [
          "Unstable Vitamin C that oxidizes",
          "Insufficient dose for real results",
          "Vague ingredients on the label",
        ],
      },
      {
        title: "Skipping sunscreen",
        priceRange: "—",
        cons: [
          "Spots return stronger than before",
          "Sun cancels any skincare progress",
          "Aging accelerates",
        ],
      },
    ],
    mutqanBar: [
      "Vitamin C & Niacinamide Booster",
      "From 169 SAR",
      "Thin layer each morning",
      "Works from within the skin",
      "Korean booster cream",
      "30-day guarantee",
    ],
  },
  guarantee: {
    badge: "Zero risk",
    title: "30 days — or your money back. No questions.",
    copy: "Try the booster for at least two weeks. If you see no difference — contact us. Full refund or product exchange. You lose nothing.",
    steps: SHARED_GUARANTEE_STEPS_EN,
  },
  routine: {
    title: "The simplest radiance routine you will try",
    subtitle: "30 seconds in the morning — thin layer — moisturizer and sunscreen",
    items: [
      {
        title: "One thin layer every morning",
        desc: "After cleansing, before moisturizer. Massage gently until fully absorbed.",
      },
      {
        title: "30 seconds only",
        desc: "No ten-step routine needed. One concentrated step is enough.",
      },
      {
        title: "Finish with sunscreen",
        desc: "Sunscreen protects your glow and prevents spots from returning.",
      },
      {
        title: "Stay consistent for 30 days",
        desc: "Results build week by week — patience pays off.",
      },
    ],
  },
  usageStats: [
    { value: "30", label: "days per jar" },
    { value: "1", label: "thin layer daily" },
    { value: "30", label: "seconds each morning" },
    { value: "AM", label: "time of use" },
  ],
  orderSteps: SHARED_ORDER_STEPS_EN,
  shipping: SHARED_SHIPPING_EN,
  faqTitle: "Before you order — everything you need to know",
  crossSellTitle: "More from Mutqan",
  crossSellSubtitle: "A targeted formula for every concern — choose what fits your skin",
  stickyCtaVerb: "Start your radiance routine now",
};

const ceramideNamaPageEn: SkincareNamaPageConfig = {
  hero: {
    headline: "Breakouts and rough texture are stealing your confidence every time you look in the mirror",
    subheadline:
      "It is not a lack of cleanser. Sensitive skin loses balance when the moisture barrier weakens. Centella & Ceramide Booster — a concentrated cream that calms inflammation and repairs your barrier from within.",
    urgencyLine: "Last 48 hours for free shipping this week",
    imageBadges: ["Booster cream", "30-day guarantee", "For sensitive skin", "Cash on delivery"],
    quickStats: [
      { value: "30", label: "days per jar" },
      { value: "Centella", label: "instant calming" },
      { value: "30", label: "day guarantee" },
      { value: "COD", label: "pay on delivery" },
    ],
  },
  problemSection: {
    eyebrow: "Does this sound familiar?",
    title: "Problems you know — solutions from within",
    subtitle: "We calm symptoms and fix the cause — one ingredient for each concern.",
    statValue: "65%",
    statText:
      "of women with sensitive skin experience dryness and keratosis pilaris despite moisturizers — because the moisture barrier is weak.",
    statSource: "Research in dermatology and the skin barrier",
  },
  problemPairs: [
    {
      problem: "Small bumps that never go away — every new cleanser makes redness worse",
      solution:
        "Centella asiatica calms skin and reduces the look of redness — more comfort from the first week.",
    },
    {
      problem: "Chicken skin on my arms and cheeks has bothered me for years",
      solution:
        "Ceramide NP rebuilds the moisture barrier — smoother texture and less visible bumps with consistent use.",
    },
    {
      problem: "My moisturizers feel heavy and do not fix the problem",
      solution:
        "A lightweight, fast-absorbing formula — deep hydration without greasiness or clogged pores.",
    },
    {
      problem: "My skin reacts to every new product",
      solution:
        "A soothing formula designed for sensitive skin — one evening step is all you need.",
    },
  ],
  ingredients: {
    title: "The secret is concentration, not a long list",
    subtitle:
      "Centella and ceramide at studied doses — to repair the barrier, not just mask symptoms.",
    items: [
      {
        title: "Centella Asiatica",
        dose: "Concentrated",
        desc: "A classic Korean ingredient that calms skin and helps reduce the look of redness and inflammation.",
        highlight: "Noticeable comfort from the first days of use",
      },
      {
        title: "Ceramide NP",
        dose: "Active",
        desc: "Rebuilds the moisture barrier — the foundation of true hydration and protection from dryness.",
        highlight: "Lasting hydration — without heaviness",
      },
      {
        title: "Hydrating extracts",
        dose: "Balanced",
        desc: "Support skin softness and improve texture — especially on rough areas.",
        highlight: "Smoother skin — even on arms",
      },
    ],
    freeFrom: [
      "No strong fragrances",
      "No harsh alcohol",
      "Paraben-free",
      "Not tested on animals",
      "For sensitive skin",
      "Lightweight texture",
    ],
  },
  authority: {
    title: "A studied formula, not empty promises",
    subtitle: "Active ingredients at clear doses — to repair the barrier, not just cover symptoms.",
    trustPills: ["Korean skincare", "GMP", "For sensitive skin", "30-day guarantee"],
    stats: [
      { value: "+750", label: "happy customers" },
      { value: "+35", label: "studies supporting ingredients" },
      { value: "30 days", label: "full refund guarantee" },
      { value: "4.9★", label: "average customer rating" },
    ],
    expertQuote:
      "A weakened moisture barrier is the root cause of most sensitive skin issues. Centella with ceramide is one of the most proven combinations for restoring balance — and that is the foundation of Mutqan Booster.",
    expertTitle: "Korean Skincare Specialist — Mutqan",
  },
  timeline: {
    badge: "Results from the first jar",
    title: "What to expect in your first 30 days",
    subtitle: "Your skin calms week by week — comfort shows before words do.",
    steps: [
      {
        period: "1",
        title: "First 7 days",
        desc: "A feeling of comfort and hydration. Redness starts to ease and skin feels less sensitive to touch.",
      },
      {
        period: "2",
        title: "Week two",
        desc: "Small bumps become less visible. Texture is smoother and dryness eases — especially in the evening.",
      },
      {
        period: "3",
        title: "End of first jar",
        desc: "Chicken skin is much lighter. A stronger barrier and lasting hydration — the second jar locks in results.",
      },
    ],
    footerNote:
      "The second jar saves more and locks in barrier repair — do not stop at the first sign of comfort.",
  },
  longReviews: {
    title: "What Mutqan customers say",
    subtitle: "Real experiences from verified purchases — sensitive skin like yours.",
    items: [
      {
        name: "Sara Al-Shehri",
        age: "34",
        city: "Khobar",
        rating: 5,
        text: "Chicken skin on my arms embarrassed me every summer. I tried scrubs and moisturizers with no results. Centella & Ceramide Booster was the first product where I felt a real difference — skin is smoother and redness is down. I use it in the evening before my night cream and it is now a fixed step.",
      },
      {
        name: "Hind Al-Otaibi",
        age: "28",
        city: "Riyadh",
        rating: 5,
        text: "My skin is very sensitive — any cream turns me red. This booster is light and never feels heavy. Small bumps on my cheeks started calming by week two. I love that the hydration feels real, not just surface-level.",
      },
      {
        name: "Mashaal Al-Zahrani",
        age: "31",
        city: "Abha",
        rating: 5,
        text: "I avoided new products for fear of reactions. Mutqan convinced me with a 30-day guarantee so I tried it. Now my skin is more comfortable than ever — and makeup sits better because skin is hydrated from within.",
      },
    ],
  },
  comparison: {
    title: "Compare — and decide for yourself",
    subtitle:
      "Every alternative you tried, why it was not enough, and how Mutqan repairs the barrier differently.",
    alternatives: [
      {
        title: "Harsh cleansers for oily skin",
        priceRange: "40–120 SAR",
        cons: [
          "Strips the moisture barrier",
          "Skin produces more oil afterward",
          "Redness increases over time",
        ],
      },
      {
        title: "Heavy moisturizer only",
        priceRange: "80–300 SAR",
        cons: [
          "Moisturizes the surface, not the barrier",
          "Feels heavy and clogs pores",
          "Does not address the root cause",
        ],
      },
      {
        title: "Spot treatment creams",
        priceRange: "50–180 SAR",
        cons: [
          "Dries surrounding skin",
          "Bumps return after stopping",
          "Does not repair a weak barrier",
        ],
      },
      {
        title: "Random internet DIY mixes",
        priceRange: "—",
        cons: [
          "Incompatible ingredients",
          "Risk of irritation and dryness",
          "No guarantee or returns",
        ],
      },
    ],
    mutqanBar: [
      "Centella & Ceramide Booster",
      "From 169 SAR",
      "Thin layer each evening",
      "Repairs barrier from within",
      "Korean booster cream",
      "30-day guarantee",
    ],
  },
  guarantee: {
    badge: "Zero risk",
    title: "30 days — or your money back. No questions.",
    copy: "Try the booster for at least two weeks. If you feel no comfort or improvement — full refund. Sensitive skin deserves a risk-free trial.",
    steps: SHARED_GUARANTEE_STEPS_EN,
  },
  routine: {
    title: "The simplest repair routine you will try",
    subtitle: "30 seconds in the evening — thin layer — night moisturizer",
    items: [
      {
        title: "One thin layer every evening",
        desc: "After gentle cleansing, before your night moisturizer.",
      },
      {
        title: "30 seconds only",
        desc: "One step is enough — no complicated routine.",
      },
      {
        title: "Gentle cleanser only",
        desc: "Avoid harsh cleansers — they protect the barrier you are rebuilding.",
      },
      {
        title: "Stay consistent for 30 days",
        desc: "Barrier repair takes time — results build gradually.",
      },
    ],
  },
  usageStats: [
    { value: "30", label: "days per jar" },
    { value: "1", label: "thin layer daily" },
    { value: "30", label: "seconds each evening" },
    { value: "PM", label: "time of use" },
  ],
  orderSteps: SHARED_ORDER_STEPS_EN,
  shipping: SHARED_SHIPPING_EN,
  faqTitle: "Before you order — everything you need to know",
  crossSellTitle: "More from Mutqan",
  crossSellSubtitle: "A targeted formula for every concern — choose what fits your skin",
  stickyCtaVerb: "Start your repair routine now",
};

const pdrnNamaPageEn: SkincareNamaPageConfig = {
  hero: {
    headline: "Fine lines and wrinkles are making your skin look older than you feel",
    subheadline:
      "It is not the creams. Skin loses firmness when cell turnover slows and collagen drops. PDRN & Peptide Booster — a concentrated cream that supports lift and fullness from within, without needles or clinic visits.",
    urgencyLine: "Last 48 hours for free shipping this week",
    imageBadges: ["Booster cream", "30-day guarantee", "Needle-free", "Cash on delivery"],
    quickStats: [
      { value: "30", label: "days per jar" },
      { value: "PDRN", label: "youth from within" },
      { value: "30", label: "day guarantee" },
      { value: "COD", label: "pay on delivery" },
    ],
  },
  problemSection: {
    eyebrow: "Does this sound familiar?",
    title: "Problems you know — solutions from within",
    subtitle: "We target loss of firmness — one ingredient for each line.",
    statValue: "27",
    statText:
      "Average age when women first notice fine lines — driven by sun, dryness, and lack of targeted care.",
    statSource: "Studies in cosmetic dermatology",
  },
  problemPairs: [
    {
      problem: "Lines around my eyes and mouth are showing — and I am not that old yet",
      solution:
        "PDRN supports cell renewal and elasticity — less visible lines with consistent use.",
    },
    {
      problem: "I considered Botox but feared the cost and needles",
      solution:
        "Targeted care without injections — peptides and adenosine support gradual firmness and fullness.",
    },
    {
      problem: "Anti-aging creams never gave me real results",
      solution:
        "The secret is concentration and dose — a Korean formula with clear actives, not generic promises.",
    },
    {
      problem: "My routine got too complicated — I do not have time for ten products",
      solution:
        "One thin layer daily. One powerful step instead of ten weak ones.",
    },
  ],
  ingredients: {
    title: "The secret is concentration, not a long list",
    subtitle: "PDRN and peptides at studied doses — for youthful skin from within.",
    items: [
      {
        title: "PDRN",
        dose: "Concentrated",
        desc: "Supports cell renewal and skin repair — the foundation of modern Korean anti-aging care.",
        highlight: "Noticeable firmness and fullness with consistent use",
      },
      {
        title: "Adenosine",
        dose: "Active",
        desc: "Helps improve the look of fine lines and supports smoother skin.",
        highlight: "Less visible lines — softer skin",
      },
      {
        title: "Peptides",
        dose: "Balanced",
        desc: "Support firmness and elasticity — for skin that looks fuller and more alive.",
        highlight: "Makeup sits better on plumper skin",
      },
    ],
    freeFrom: [
      "Needle-free",
      "No strong fragrances",
      "Paraben-free",
      "Not tested on animals",
      "Concentrated formula",
      "Simple routine",
    ],
  },
  authority: {
    title: "A studied formula, not empty promises",
    subtitle:
      "Active ingredients backed by Korean skincare research — real youthfulness, not empty claims.",
    trustPills: ["Korean skincare", "GMP", "Needle-free", "30-day guarantee"],
    stats: [
      { value: "+600", label: "happy customers" },
      { value: "+50", label: "studies supporting ingredients" },
      { value: "30 days", label: "full refund guarantee" },
      { value: "4.9★", label: "average customer rating" },
    ],
    expertQuote:
      "PDRN with peptides is among the most requested combinations in Korean anti-aging care. Dose and consistency matter more than product count — and that is what Mutqan Booster delivers.",
    expertTitle: "Korean Skincare Specialist — Mutqan",
  },
  timeline: {
    badge: "Results from the first jar",
    title: "What to expect in your first 30 days",
    subtitle: "Your skin changes week by week — your face shows it before you say it.",
    steps: [
      {
        period: "1",
        title: "First 7 days",
        desc: "A feeling of softness and fullness. Skin feels more hydrated and alive from the first use.",
      },
      {
        period: "2",
        title: "Week two",
        desc: "Fine lines start to soften. Texture is smoother and signs of fatigue look less visible.",
      },
      {
        period: "3",
        title: "End of first jar",
        desc: "A clear before-and-after difference. More elasticity and a fuller look — the second jar locks in youthfulness.",
      },
    ],
    footerNote:
      "The second jar saves more and locks in results — youthfulness needs consistency.",
  },
  longReviews: {
    title: "What Mutqan customers say",
    subtitle: "Real experiences — women who chose to give their skin a chance without needles.",
    items: [
      {
        name: "Areej Al-Ghamdi",
        age: "43",
        city: "Makkah",
        rating: 5,
        text: "At 43 I was torn between Botox and expensive creams. PDRN Booster was a smart middle ground — no needles, no complicated routine. After a month my skin felt fuller and lines around my mouth softened. Makeup sits better and I feel more confident.",
      },
      {
        name: "Jawhara Al-Anzi",
        age: "38",
        city: "Hail",
        rating: 5,
        text: "I tried many anti-aging creams with no clear results. This booster was the first where I felt a real difference in softness. I use it twice daily — morning and evening — and results were gradual but convincing.",
      },
      {
        name: "Fatima Al-Subaie",
        age: "45",
        city: "Riyadh",
        rating: 5,
        text: "I will not call it a miracle — but the difference is clear. My skin is more elastic and fine lines are lighter. Best part is the simplicity: one thin layer and done. I ordered a second jar because the bundle saves more.",
      },
    ],
  },
  comparison: {
    title: "Compare — and decide for yourself",
    subtitle:
      "Every alternative you considered, why it is not enough, and how Mutqan works differently.",
    alternatives: [
      {
        title: "Botox / filler",
        priceRange: "800–3000+ SAR",
        cons: [
          "High cost every 4–6 months",
          "Needles and side effects",
          "Can look unnatural",
        ],
      },
      {
        title: "Luxury anti-aging creams",
        priceRange: "300–800 SAR",
        cons: [
          "Weak active ingredient concentration",
          "Limited surface results",
          "High cost with no guarantee",
        ],
      },
      {
        title: "Clinic injections and treatments",
        priceRange: "500–5000+ SAR",
        cons: [
          "Pain and downtime",
          "Recurring cost",
          "Not for everyone",
        ],
      },
      {
        title: "Complex 10-step routines",
        priceRange: "—",
        cons: [
          "Hard to stick with daily",
          "High cumulative cost",
          "Ingredients can conflict",
        ],
      },
    ],
    mutqanBar: [
      "PDRN & Peptide Booster",
      "From 169 SAR",
      "Thin layer daily",
      "Works from within the skin",
      "Needle-free",
      "30-day guarantee",
    ],
  },
  guarantee: {
    badge: "Zero risk",
    title: "30 days — or your money back. No questions.",
    copy: "Try the booster for at least two weeks. If you see no improvement in softness or elasticity — full refund. Your skin deserves a risk-free trial.",
    steps: SHARED_GUARANTEE_STEPS_EN,
  },
  routine: {
    title: "The simplest youth routine you will try",
    subtitle: "30 seconds a day — thin layer — moisturizer and sunscreen",
    items: [
      {
        title: "One thin layer daily",
        desc: "Morning and/or evening depending on your routine — massage upward gently.",
      },
      {
        title: "30 seconds only",
        desc: "One powerful step instead of ten weak ones.",
      },
      {
        title: "Follow with moisturizer",
        desc: "Hydration boosts ingredient absorption and maintains elasticity.",
      },
      {
        title: "Stay consistent for 30 days",
        desc: "Youthfulness builds over time — the second jar locks in results.",
      },
    ],
  },
  usageStats: [
    { value: "30", label: "days per jar" },
    { value: "1", label: "thin layer daily" },
    { value: "30", label: "seconds per day" },
    { value: "1–2×", label: "times daily" },
  ],
  orderSteps: SHARED_ORDER_STEPS_EN,
  shipping: SHARED_SHIPPING_EN,
  faqTitle: "Before you order — everything you need to know",
  crossSellTitle: "More from Mutqan",
  crossSellSubtitle: "A targeted formula for every concern — choose what fits your skin",
  stickyCtaVerb: "Start your youth routine now",
};

export const SKINCARE_NAMA_PAGES_EN: Record<SkincareProductSlug, SkincareNamaPageConfig> = {
  "vitamin-c-booster": vitaminCNamaPageEn,
  "ceramide-booster": ceramideNamaPageEn,
  "pdrn-booster": pdrnNamaPageEn,
};
