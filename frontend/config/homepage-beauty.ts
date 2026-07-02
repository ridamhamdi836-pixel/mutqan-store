/** Homepage copy & presentation — Premium Korean Skincare */
import { withImageVersion } from "@/lib/image-display";

export const HOMEPAGE_FEATURED_SLUGS = [
  "vitamin-c-booster",
  "ceramide-booster",
  "pdrn-booster",
] as const;

export type HomepageBeautyProduct = {
  slug: string;
  nameAr: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  minPriceSar?: number;
  goalLabel?: string;
};

export const HOMEPAGE_BEAUTY = {
  tagline: "عناية كورية فاخرة… لبشرة تثقين بها",

  hero: {
    badge: "✨ عناية كورية فاخرة",
    headline: "بشرتك تستحق عناية ترى نتيجتها",
    subheadline:
      "كل يوم فرصة لبشرة أكثر إشراقاً وراحة. متقن يقدّم لكِ روتيناً بسيطاً يعيد الثقة — لا التعقيد.",
    trustBullets: [
      "✓ الدفع عند الاستلام",
      "✓ ضمان 30 يوم",
      "✓ شحن سريع داخل المملكة",
    ],
    primaryCta: "اختاري هدف بشرتك",
    secondaryCta: "لماذا متقن؟",
    image: withImageVersion("/images/hero/skincare-hero.png", 1),
    imageAlt: "عناية كورية فاخرة — متقن",
  },

  trustBar: [
    { label: "عناية كورية مختارة", icon: "users" as const },
    { label: "ضمان 30 يوم", icon: "shield" as const },
    { label: "الدفع عند الاستلام", icon: "credit-card" as const },
    { label: "دعم عبر واتساب", icon: "message" as const },
    { label: "شحن سريع لجميع مناطق المملكة", icon: "truck" as const },
  ],

  whyStartCare: {
    headline: "لماذا تبدأ العناية الصحيحة؟",
    description:
      "البشرة لا تطلب الكثير — تطلب الاتساق والثقة. عندما تعتنين بها بخطوات بسيطة ومدروسة، يتغيّر شعورك قبل أن يتغيّر مظهرها.",
    points: [
      "لأن الإشراقة تبدأ من الداخل",
      "لأن الراحة أهم من التعقيد",
      "لأنك تستحقين منتجات تثقين بها",
    ],
  },

  threeSteps: {
    headline: "3 خطوات لبشرة أفضل",
    subtitle: "روتين متقن — بسيط، فاخر، وفعّال",
    steps: [
      {
        id: "glow",
        label: "Glow",
        title: "إشراقة",
        desc: "معزّز فيتامين سي — توهج وتوحيد",
        slug: "vitamin-c-booster",
        accent: "#C9A96A",
      },
      {
        id: "repair",
        label: "Repair",
        title: "إصلاح",
        desc: "معزّز السيراميد — حاجز وترطيب",
        slug: "ceramide-booster",
        accent: "#E7D8C9",
      },
      {
        id: "youth",
        label: "Youth",
        title: "شباب",
        desc: "معزّز PDRN — مرونة وشد",
        slug: "pdrn-booster",
        accent: "#1E2430",
      },
    ],
  },

  skinGoals: {
    title: "اختاري هدف بشرتك",
    subtitle: "ليس المنتج — بل الشعور الذي تبحثين عنه",
  },

  bestSellers: {
    title: "مجموعة متقن للعناية",
    products: [
      {
        slug: "vitamin-c-booster",
        nameAr: "معزّز فيتامين سي",
        subtitle: "إشراقة طبيعية وبشرة أكثر توحيداً.",
        image: withImageVersion("/images/products/vitamin-c-booster.png", 1),
        imageAlt: "معزّز فيتامين سي — متقن",
        goalLabel: "Glow",
      },
      {
        slug: "ceramide-booster",
        nameAr: "معزّز السيراميد",
        subtitle: "إصلاح الحاجز وترطيب عميق.",
        image: withImageVersion("/images/products/ceramide-booster.png", 1),
        imageAlt: "معزّز السيراميد — متقن",
        goalLabel: "Repair",
      },
      {
        slug: "pdrn-booster",
        nameAr: "معزّز PDRN",
        subtitle: "مرونة أعلى ومظهر أنعم.",
        image: withImageVersion("/images/products/pdrn-booster.png", 1),
        imageAlt: "معزّز PDRN — متقن",
        goalLabel: "Youth",
      },
    ] satisfies HomepageBeautyProduct[],
  },

  whyMutqan: {
    headline: "لماذا اختارت آلاف السيدات متقن؟",
    cards: [
      {
        id: "curated",
        title: "عناية كورية مختارة",
        desc: "تركيبات مركزة بخطوة واحدة — بدون تعقيد.",
      },
      {
        id: "quality",
        title: "فخامة بسيطة",
        desc: "تجربة أنيقة تشبه براندات العناية العالمية.",
      },
      {
        id: "guarantee",
        title: "ضمان ذهبي 30 يوم",
        desc: "جرّبي براحة — استبدال أو استرجاع بكل وضوح.",
      },
      {
        id: "support",
        title: "ثقة من أول طلب",
        desc: "دفع عند الاستلام وتأكيد هاتفي قبل الشحن.",
      },
    ],
  },

  results: {
    headline: "نتائج يمكنك ملاحظتها",
    items: [
      { period: "أسبوعان", text: "بشرة أكثر نعومة وإحساس بالراحة" },
      { period: "شهر", text: "مظهر أوضح وإشراقة تدريجية" },
      { period: "روتين مستمر", text: "ثقة تبقى معك كل يوم" },
    ],
  },

  beforeAfter: {
    headline: "قبل وبعد",
    before: "بشرة باهتة، جافة، أو بلا حيوية",
    after: "بشرة أكثر إشراقاً وراحة وثقة",
  },

  routine: {
    headline: "روتين متقن",
    morning: {
      title: "صباحاً",
      steps: ["تنظيف لطيف", "معزّز فيتامين سي", "مرطب + واقي شمس"],
    },
    night: {
      title: "مساءً",
      steps: ["تنظيف مزدوج", "معزّز السيراميد أو PDRN", "مرطب ليلي"],
    },
  },

  lifestyle: {
    headline: "العناية ليست رفاهية — إنها ثقة",
    description:
      "متقن يقدّم لكِ روتيناً هادئاً يعيد لبشرتك ما تستحقه: الراحة، الإشراقة، والشعور بأنكِ في أحسن نسخة من نفسك.",
    image: withImageVersion("/images/hero/skincare-lifestyle.png", 1),
    imageAlt: "روتين عناية كورية فاخر — متقن",
  },

  testimonials: {
    headline: "تجارب هادئة",
    items: [
      {
        name: "نورة المطيري",
        city: "الرياض",
        rating: 5,
        text: "بشرتي صارت أنعم. أحب البساطة والفخامة معاً.",
      },
      {
        name: "سارة العنزي",
        city: "جدة",
        rating: 5,
        text: "إحساس مختلف — كأن البشرة تتنفس أخيراً.",
      },
      {
        name: "هنوف الشهري",
        city: "الدمام",
        rating: 5,
        text: "روتين بسيط ونتيجة واضحة. أنصح فيه.",
      },
    ],
  },

  orderSteps: {
    headline: "كيف تطلبين؟",
    steps: [
      { title: "اختاري هدف بشرتك", desc: "إشراقة، إصلاح، أو شباب" },
      { title: "أدخلي بياناتك", desc: "اسمك ورقم جوالك فقط" },
      { title: "نتواصل للتأكيد", desc: "قبل الشحن مباشرة" },
      { title: "استلمي وادفعي", desc: "عند الاستلام فقط" },
    ],
  },

  faq: [
    {
      question: "هل المنتجات مناسبة للبشرة الحساسة؟",
      answer:
        "تركيباتنا خفيفة ومصممة للاستخدام اليومي. إذا كانت بشرتك حساسة جداً، ابدئي بخطوة واحدة ثم زيدي تدريجياً.",
    },
    {
      question: "متى أرى النتائج؟",
      answer:
        "معظم العميلات يلاحظن فرقاً في النعومة والراحة خلال أسبوعين. الإشراقة والتوحيد يحتاجان استمراراً أطول.",
    },
    {
      question: "هل الدفع عند الاستلام متاح؟",
      answer: "نعم، الدفع عند الاستلام هو طريقتنا الأساسية.",
    },
    {
      question: "هل يوجد ضمان؟",
      answer: "نعم، ضمان ذهبي 30 يوماً للاستبدال أو الاسترجاع.",
    },
  ],

  finalCta: {
    headline: "ابدئي رحلة بشرتك اليوم",
    description: "لأن الثقة تبدأ من عناية بسيطة — وفاخرة — تليق بكِ.",
    trustBadges: ["✓ شحن سريع", "✓ الدفع عند الاستلام", "✓ ضمان 30 يوم"],
    button: "اختاري هدف بشرتك",
  },
} as const;
