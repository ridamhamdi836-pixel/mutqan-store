/** Homepage copy & presentation — premium beauty / vanity brand */
import { withImageVersion } from "@/lib/image-display";

export const HOMEPAGE_FEATURED_SLUGS = [
  "beauty-vanity-cabinet",
  "led-makeup-bag",
  "makeup-brush-cleaner",
  "rotating-brush-organizer",
] as const;

export type HomepageBeautyProduct = {
  slug: (typeof HOMEPAGE_FEATURED_SLUGS)[number];
  nameAr: string;
  subtitle: string;
  image: string;
  imageAlt: string;
};

export const HOMEPAGE_BEAUTY = {
  tagline: "تفاصيل أجمل… لأنك تستحقين الأفضل",

  hero: {
    badge: "✨ أكثر من 50,000 عميلة تثق بمتقن",
    headline: "تفاصيل جمالك تستحق الأفضل",
    subheadline:
      "مجموعة متقن المختارة بعناية لتنظيم مستحضراتك، تنظيف فرشك، وإضاءة روتينك اليومي بأناقة وجودة تدوم.",
    trustBullets: [
      "✓ الدفع عند الاستلام",
      "✓ ضمان 30 يوم",
      "✓ شحن سريع داخل المملكة",
    ],
    primaryCta: "اكتشفي المجموعة",
    secondaryCta: "لماذا متقن؟",
    image: withImageVersion("/images/hero/beauty-vanity-hero.png", 2),
    imageAlt: "إعداد فاخر للتجميل — مجموعة متقن الأربعة على طاولة الزينة",
  },

  trustBar: [
    { label: "50,000+ عميلة سعيدة", icon: "users" as const },
    { label: "ضمان 30 يوم", icon: "shield" as const },
    { label: "الدفع عند الاستلام", icon: "credit-card" as const },
    { label: "خدمة عملاء عبر واتساب", icon: "message" as const },
    { label: "شحن سريع لجميع مناطق المملكة", icon: "truck" as const },
  ],

  bestSellers: {
    title: "الأكثر حباً لدى عميلات متقن",
    products: [
      {
        slug: "beauty-vanity-cabinet",
        nameAr: "خزانة الجمال الفاخرة المضادة للغبار",
        subtitle: "تنظيم أنيق يحافظ على مستحضراتك بأفضل صورة.",
        image: withImageVersion("/images/products/beauty-vanity-cabinet.png", 3),
        imageAlt: "خزانة الجمال الفاخرة المضادة للغبار — متقن",
      },
      {
        slug: "led-makeup-bag",
        nameAr: "حقيبة المكياج الفاخرة بإضاءة LED",
        subtitle: "إضاءة مثالية وأناقة ترافقك أينما كنت.",
        image: withImageVersion("/images/products/led-makeup-bag.png", 2),
        imageAlt: "حقيبة المكياج الفاخرة بإضاءة LED — متقن",
      },
      {
        slug: "makeup-brush-cleaner",
        nameAr: "جهاز تنظيف فرش المكياج الذكي",
        subtitle: "تنظيف وتجفيف سريع لفرش أكثر نظافة وعناية.",
        image: withImageVersion("/images/products/makeup-brush-cleaner.png", 2),
        imageAlt: "جهاز تنظيف فرش المكياج الذكي — متقن",
      },
      {
        slug: "rotating-brush-organizer",
        nameAr: "منظم الفرش الدوار الفاخر",
        subtitle: "ترتيب أنيق يحافظ على فرشك بعيداً عن الغبار.",
        image: "/images/products/rotating-brush-organizer.png",
        imageAlt: "منظم الفرش الدوار الفاخر — متقن",
      },
    ] satisfies HomepageBeautyProduct[],
  },

  whyMutqan: {
    headline: "لماذا تختار آلاف العميلات متقن؟",
    cards: [
      {
        id: "curated",
        title: "منتجات مختارة بعناية",
        desc: "كل منتج يتم اختياره بعناية ليمنحك تجربة أنيقة وعملية تستحقينها.",
      },
      {
        id: "quality",
        title: "جودة تدوم",
        desc: "خامات عالية الجودة وتصاميم أنيقة مصممة للاستخدام اليومي الطويل.",
      },
      {
        id: "guarantee",
        title: "ضمان ذهبي 30 يوم",
        desc: "استبدال أو استرجاع بكل راحة إذا لم يكن المنتج كما توقعتِ.",
      },
      {
        id: "support",
        title: "خدمة عملاء حقيقية",
        desc: "فريق دعم جاهز لخدمتك قبل وبعد الطلب بكل اهتمام.",
      },
    ],
  },

  lifestyle: {
    headline: "روتين عناية أكثر جمالاً وراحة",
    description:
      "صممنا مجموعة متقن لتجعل كل لحظة أمام مرآتك أكثر ترتيباً، راحة وأناقة.",
    image: withImageVersion("/images/hero/beauty-lifestyle.png", 2),
    imageAlt: "روتين عناية أنيق أمام المرآة — متقن",
  },

  testimonials: {
    headline: "تجارب حقيقية من عميلات متقن",
    items: [
      {
        name: "نورة المطيري",
        city: "الرياض",
        rating: 5,
        text: "خزانة الجمال غيّرت طريقة ترتيبي للمكياج بالكامل. أنيقة، عملية، وتحافظ على كل شيء نظيفاً. توصيل سريع وخدمة راقية.",
      },
      {
        name: "سارة العنزي",
        city: "جدة",
        rating: 5,
        text: "حقيبة الـ LED صارت أساسية في حقيبتي. الإضاءة مثالية للتعديلات السريعة وأنا خارج البيت. جودة تستحق السعر.",
      },
      {
        name: "هنوف الشهري",
        city: "الدمام",
        rating: 5,
        text: "جهاز تنظيف الفرش وفّر علي وقت كثير. فرشي أنظف وأنعم، والمنظم الدوار يكمل المجموعة بشكل رائع. أنصح فيها بقوة.",
      },
    ],
  },

  orderSteps: {
    headline: "كيف تطلبين؟",
    steps: [
      { title: "اختاري المنتج المناسب", desc: "تصفّحي مجموعة متقن واختاري ما يناسب روتينك" },
      { title: "أدخلي بياناتك", desc: "اسمك ورقم جوالك فقط — بدون بطاقة بنكية" },
      { title: "نتواصل لتأكيد الطلب", desc: "فريقنا يتصل لتأكيد التفاصيل قبل الشحن" },
      { title: "استلمي وادفعي عند الاستلام", desc: "تدفعين للمندوب فقط عند استلام طلبك" },
    ],
  },

  faq: [
    {
      question: "هل الدفع عند الاستلام متاح؟",
      answer:
        "نعم، الدفع عند الاستلام هو طريقتنا الأساسية. لا تدفعين أي مبلغ حتى تستلمين طلبك بيدك.",
    },
    {
      question: "كم مدة التوصيل؟",
      answer:
        "عادةً من 2 إلى 5 أيام عمل لجميع مناطق المملكة العربية السعودية. نتواصل معك قبل الشحن لتأكيد العنوان.",
    },
    {
      question: "هل يوجد ضمان؟",
      answer:
        "نعم، نقدم ضماناً ذهبياً لمدة 30 يوماً. إذا لم يعجبك المنتج، يمكنك الاستبدال أو الاسترجاع بكل راحة.",
    },
    {
      question: "هل يمكن الاستبدال أو الإرجاع؟",
      answer:
        "بالتأكيد. خلال 30 يوماً من الاستلام، تواصلي معنا عبر واتساب وسنساعدك في الاستبدال أو الاسترجاع.",
    },
  ],

  finalCta: {
    headline: "لأن جمالك يستحق الأفضل ✨",
    description:
      "انضمي إلى آلاف العميلات اللواتي اخترن متقن ليصبح روتين العناية أكثر أناقة وراحة.",
    trustBadges: ["✓ شحن سريع", "✓ الدفع عند الاستلام", "✓ ضمان 30 يوم"],
    button: "تسوقي الآن",
  },
} as const;
