/** Homepage copy & presentation — Nama-style trust + Korean skincare */
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
  description: string;
  image: string;
  imageAlt: string;
  minPriceSar?: number;
  goalLabel?: string;
  routineLabel: string;
  accentColor: string;
  cardBg: string;
  ingredients: readonly string[];
};

export const HOMEPAGE_BEAUTY = {
  tagline: "عناية كورية فاخرة… لبشرة تثقين بها",

  announcement: "✓ سيرومات كورية مركّزة — تركيبات مدروسة بمكونات نشطة واضحة",

  hero: {
    badge: "عناية كورية فاخرة • تركيبات مركّزة",
    headline: "سيرومات كورية لجمال يبدأ من بشرتك",
    subheadline:
      "ثلاث سيرومات مركّزة — تستهدف الإشراقة والبقع، الحبوب والتهيج، والتجاعيد والخطوط. فيتامين C، سنتيلا، وPDRN بجرعات واضحة. آمنة للاستخدام اليومي — بدون تعقيد ولا وعود فارغة.",
    trustPills: [
      { id: "korean", label: "كورية", sub: "تركيبات مختارة" },
      { id: "actives", label: "نشطة", sub: "جرعات واضحة" },
      { id: "daily", label: "يومية", sub: "آمنة للبشرة" },
      { id: "guarantee", label: "30 يوم", sub: "ضمان استرجاع" },
    ],
    primaryCta: "استكشفي السيرومات الكورية",
    guaranteeBadge: "ضمان استرجاع 30 يوم",
    imageAlt: "سيرومات متقن الكورية — إشراقة، إصلاح، شباب",
    imageBadgeTitle: "تركيبات كورية مركّزة",
    imageBadgeSub: "متقن — عناية موثوقة",
  },

  formulations: {
    label: "تركيباتنا",
    headline: "ثلاث سيرومات. ثلاث مشاكل. حلّ واحد واضح.",
    subtitle:
      "كل سيروم يستهدف هدفاً محدداً — يمكنكِ استخدامه وحده أو بناء روتين متكامل. مكونات نشطة بجرعات مدروسة، لا خلطات عشوائية.",
  },

  bestSellers: {
    products: [
      {
        slug: "vitamin-c-booster",
        nameAr: "سيروم فيتامين سي للإشراقة",
        subtitle: "إشراقة · توحيد · بقع داكنة",
        description:
          "حمض الأسكوربيك ونياسيناميد وجلسرين — لتوهج طبيعي وبشرة أكثر توحيداً.",
        image: withImageVersion("/images/products/vitamin-c-booster.png", 2),
        imageAlt: "سيروم فيتامين سي — متقن",
        goalLabel: "Glow",
        routineLabel: "روتين الإشراقة",
        accentColor: "#A89420",
        cardBg: "#EDE08A",
        ingredients: [
          "حمض الأسكوربيك (فيتامين C)",
          "نياسيناميد",
          "جلسرين",
          "مستخلص الغاردينيا",
        ],
      },
      {
        slug: "ceramide-booster",
        nameAr: "سيروم السيراميد للإصلاح",
        subtitle: "حبوب · ترطيب · بشرة حريرية",
        description:
          "سنتيلا آسيوية وسيراميد NP وبانثينول — لتهدئة البشرة وإزالة الحبوب وجلد الدجاجة.",
        image: withImageVersion("/images/products/ceramide-booster.png", 2),
        imageAlt: "سيروم السيراميد — متقن",
        goalLabel: "Repair",
        routineLabel: "روتين الإصلاح",
        accentColor: "#5C6670",
        cardBg: "#D4D8DE",
        ingredients: [
          "سنتيلا آسيوية",
          "سيراميد NP",
          "بانثينول",
          "نياسيناميد",
          "شجرة الشاي",
        ],
      },
      {
        slug: "pdrn-booster",
        nameAr: "سيروم PDRN للشباب",
        subtitle: "تجاعيد · شد · مرونة",
        description:
          "PDRN وببتيدات وأدينوزين — لشد البشرة وتقليل الخطوط الدقيقة ومرونة أعلى.",
        image: withImageVersion("/images/products/pdrn-booster.png", 2),
        imageAlt: "سيروم PDRN — متقن",
        goalLabel: "Youth",
        routineLabel: "روتين الشباب",
        accentColor: "#C25D78",
        cardBg: "#F5B8C8",
        ingredients: [
          "PDRN (DNA السلمون)",
          "ببتيدات",
          "أدينوزين",
          "هيالورونيك متعدد الأوزان",
          "سيراميدات",
        ],
      },
    ] satisfies HomepageBeautyProduct[],
  },

  whyMutqan: {
    label: "لماذا متقن",
    headline: "عناية كورية، مو متجر عشوائي",
    subtitle:
      "نبني ثقتكِ على أربع ركائز: تركيبات مركّزة، مكونات نشطة واضحة، ضمان 30 يوم، وراحة الدفع عند الاستلام.",
    cards: [
      {
        id: "formulas",
        title: "تركيبات مركّزة، مو خلطات عشوائية",
        desc: "كل مكوّن يُختار لدوره — بجرعة واضحة ومصدر معروف. لا وعود سرية ولا مكونات مبهمة.",
      },
      {
        id: "actives",
        title: "مكونات نشطة بجرعات مدروسة",
        desc: "فيتامين C، سنتيلا، PDRN، سيراميدات — كل سيروم يستهدف مشكلة بشرتكِ بشكل مباشر.",
      },
      {
        id: "guarantee",
        title: "ضمان 30 يوم — الدفع عند الاستلام",
        desc: "لم تلاحظي فرقاً؟ نستبدل أو نسترجع. ادفعي فقط عند استلام طلبك — بدون مخاطرة.",
      },
      {
        id: "korean",
        title: "عناية كورية فاخرة مختارة",
        desc: "تجربة بسيطة وأنيقة — خطوة واحدة، نتيجة واضحة. كما تتوقعين من براند عناية عالمي.",
      },
    ],
  },

  testimonials: {
    label: "تقييمات موثّقة",
    headline: "عميلات قرأن المكونات قبل ما يطلبن",
    subtitle: "شفافية كاملة — تعرفين ما تضعينه على بشرتكِ قبل الشراء.",
    items: [
      {
        name: "نورة المطيري",
        city: "الرياض",
        age: "34",
        rating: 5,
        text: "قرأت المكونات قبل الطلب — فيتامين C ونياسيناميد واضحين. بشرتي صارت أكثر إشراقاً بعد أسبوعين.",
        verified: true,
      },
      {
        name: "سارة العنزي",
        city: "جدة",
        age: "29",
        rating: 5,
        text: "سيروم السيراميد هدّأ حبوبي وجلد الدجاجة. الدفع عند الاستلام خلاني أجرّب بدون قلق.",
        verified: true,
      },
      {
        name: "هنوف الشهري",
        city: "الدمام",
        age: "41",
        rating: 5,
        text: "PDRN غيّر ملمس بشرتي — الخطوط الدقيقة أخف والبشرة أشد. روتين بسيط ونتيجة واضحة.",
        verified: true,
      },
    ],
  },

  orderSteps: {
    label: "كيف يعمل",
    headline: "من الطلب لباب بيتك في 3 خطوات",
    subtitle: "بدون دفع أونلاين. بدون التزام. بدون مخاطرة.",
    steps: [
      {
        title: "اختاري روتينك",
        desc: "إشراقة، إصلاح حبوب وترطيب، أو شد وتجاعيد — اختاري السيروم الذي يناسب هدف بشرتكِ.",
      },
      {
        title: "أكدي طلبك (بدون دفع)",
        desc: "أدخلي اسمك ورقم جوالك فقط. فريقنا يتصل لتأكيد العنوان والكمية قبل الشحن.",
      },
      {
        title: "استلمي وادفعي",
        desc: "التوصيل خلال 2–5 أيام داخل المملكة. تدفعين عند الاستلام نقداً أو بمدى.",
      },
    ],
  },

  faq: {
    label: "الأسئلة الشائعة",
    headline: "أسئلة قبل الطلب",
    subtitle: "كل شيء تحتاجين معرفته قبل الدفع عند الاستلام.",
    items: [
      {
        question: "هل السيرومات مناسبة للبشرة الحساسة؟",
        answer:
          "تركيباتنا خفيفة ومصممة للاستخدام اليومي. سيروم السيراميد مخصّص للبشرة الحساسة والمعرّضة للحبوب. ابدئي بخطوة واحدة ثم زيدي تدريجياً.",
      },
      {
        question: "هل الدفع عند الاستلام متاح لكل المدن؟",
        answer:
          "نعم، الدفع عند الاستلام متاح لمعظم مدن المملكة. نؤكد العنوان في مكالمة قبل الشحن.",
      },
      {
        question: "متى ألاحظ النتيجة؟",
        answer:
          "معظم العميلات يلاحظن نعومة وراحة خلال أسبوعين. الإشراقة والتجاعيد تحتاج استمراراً 4–8 أسابيع لنتائج أوضح.",
      },
      {
        question: "كم مدة التوصيل داخل السعودية؟",
        answer:
          "بعد التأكيد: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام للمدن الرئيسية.",
      },
      {
        question: "ما هو ضمان الاسترجاع؟",
        answer:
          "ضمان 30 يوماً — لم تلاحظي فرقاً؟ تواصلي معنا عبر واتساب للاستبدال أو الاسترجاع الكامل.",
      },
      {
        question: "هل يمكنني استخدام أكثر من سيروم معاً؟",
        answer:
          "نعم. فيتامين C صباحاً، السيراميد أو PDRN مساءً — روتين بسيط يغطي الإشراقة والإصلاح والشباب.",
      },
    ],
  },

  finalCta: {
    label: "ابدئي روتينكِ",
    headline: "بشرتكِ تستحق عناية ترى نتيجتها — مو وعود",
    description:
      "ابدئي روتينكِ الكوري اليوم. الدفع عند الاستلام، شحن داخل المملكة، وضمان استرجاع 30 يوم — تجربة بدون مخاطرة.",
    trustBadges: [
      { icon: "shield" as const, label: "ضمان 30 يوم" },
      { icon: "truck" as const, label: "شحن داخل المملكة" },
      { icon: "card" as const, label: "الدفع عند الاستلام" },
      { icon: "leaf" as const, label: "مكونات نشطة واضحة" },
    ],
    button: "استكشفي السيرومات الآن",
  },

  trustFooter: [
    {
      id: "shipping",
      title: "شحن سريع داخل السعودية",
      desc: "2–5 أيام للمدن الرئيسية بعد التأكيد",
    },
    {
      id: "cod",
      title: "الدفع عند الاستلام",
      desc: "ادفعي بعد ما يوصل الطلب لباب بيتك",
    },
    {
      id: "guarantee",
      title: "ضمان استرجاع 30 يوم",
      desc: "ما لاحظتي فرق؟ نرجّع المبلغ كاملاً",
    },
    {
      id: "actives",
      title: "مكونات نشطة واضحة",
      desc: "كل مكوّن مذكور بجرعته — بلا أسرار",
    },
  ],
} as const;
