import type { CroProductPageConfig } from "@/types/cro-product-page";
import {
  CRO_COD_COMPARISON_ROWS,
  CRO_OFFER,
  CRO_ORDER_PROCESS,
  CRO_TRUST_BADGES,
} from "./shared";

type BeautyCroInput = {
  heroHeadline: string;
  heroSubheadline: string;
  bullets: string[];
  problemTitle: string;
  problemCopy: string;
  solutionTitle: string;
  solutionCopy: string;
  highlightCopy: string;
  benefits: Array<{ title: string; desc: string }>;
  whyItWorks: Array<{ title: string; desc: string }>;
  features: string[];
  reviewsTitle: string;
  finalCtaTitle: string;
  valueSummary: string;
};

function buildBeautyCroPage(input: BeautyCroInput): CroProductPageConfig {
  return {
    hero: {
      headline: input.heroHeadline,
      subheadline: input.heroSubheadline,
      bullets: input.bullets,
    },
    trustBadges: [...CRO_TRUST_BADGES],
    beforeAfter: {
      title: "الفرق واضح — قبل وبعد",
      subtitle: "شاهدي كيف يتحول روتينك اليومي مع متقن",
    },
    problem: { title: input.problemTitle, copy: input.problemCopy },
    solution: { title: input.solutionTitle, copy: input.solutionCopy },
    highlight: {
      title: "لماذا هذا المنتج؟",
      copy: input.highlightCopy,
      placeholder: "[BEAUTY PRODUCT PLACEHOLDER]",
    },
    benefits: { title: "ماذا يتغيّر في روتينك؟", items: input.benefits },
    whyItWorks: {
      title: "لماذا يعمل فعلاً؟",
      items: input.whyItWorks.map((item) => ({
        ...item,
        placeholder: "[DETAIL PLACEHOLDER]",
      })),
    },
    features: { title: "مواصفات سريعة", items: input.features },
    valueJustification: {
      eyebrow: "قبل أن ترى السعر",
      title: "لماذا تختارين متقن؟",
      summary: input.valueSummary,
      footerLine: "استثمار مرة واحدة — روتين أجمل كل يوم",
      cards: [
        {
          icon: "sparkles",
          tag: "أناقة",
          headline: "تصميم يليق بزاوية جمالك",
          support: "تفاصيل مدروسة تضيف لمسة فاخرة لروتينك اليومي",
        },
        {
          icon: "shield",
          tag: "ثقة",
          headline: "ضمان 30 يوم",
          support: "استبدال أو استرجاع بكل راحة إذا لم يناسبك",
          featured: true,
        },
        {
          icon: "clock",
          tag: "راحة",
          headline: "توفير وقت يومي",
          support: "روتين أسرع وأكثر ترتيباً أمام المرآة",
        },
      ],
    },
    offer: { ...CRO_OFFER },
    reviews: {
      title: input.reviewsTitle,
      subtitle: "تجارب حقيقية من عميلات متقن",
    },
    comparison: {
      title: "لماذا متقن وليس البدائل؟",
      subtitle: "مقارنة سريعة قبل أن تقرري",
      rows: [
        { label: "تصميم فاخر يليق بزاوية الجمال", us: true, alternative: false },
        { label: "جودة خامات عالية", us: true, alternative: false },
        { label: "مختار بعناية لعميلات متقن", us: true, alternative: false },
        ...CRO_COD_COMPARISON_ROWS,
      ],
    },
    orderProcess: { ...CRO_ORDER_PROCESS },
    finalCta: {
      title: input.finalCtaTitle,
      subtitle: "دفع عند الاستلام · تأكيد هاتفي · ضمان 30 يوم",
    },
  };
}

export const beautyVanityCabinetCroPage = buildBeautyCroPage({
  heroHeadline: "مستحضراتك تستحق عرضاً يليق بها",
  heroSubheadline:
    "خزانة جمال مضادة للغبار — تنظيم أنيق يحافظ على مكياجك وعنايتك بأفضل صورة",
  bullets: [
    "حماية من الغبار والرطوبة",
    "تصميم شفاف أنيق",
    "مساحة منظمة لكل مستحضر",
    "تناسب طاولة الزينة",
  ],
  problemTitle: "هل مستحضراتك مبعثرة ومعرضة للغبار؟",
  problemCopy: "فوضى على الطاولة · غبار على المكياج · صعب تلاقين ما تحتاجين",
  solutionTitle: "ترتيب فاخر يحمي ويعرض",
  solutionCopy: "خزانة شفافة مغلقة — كل شيء في مكانه، نظيف ومرتب",
  highlightCopy: "تصميم عملي يناسب روتين العناية اليومي مع لمسة فاخرة",
  benefits: [
    { title: "حماية من الغبار", desc: "مكياجك وعنايتك تبقى نظيفة لفترة أطول" },
    { title: "ترتيب واضح", desc: "ترى كل مستحضر بسهولة — بدون بحث" },
    { title: "مظهر أنيق", desc: "يليق بزاوية جمالك ويضيف لمسة فخامة" },
    { title: "سهل الاستخدام", desc: "فتح وإغلاق سلس — روتين أسرع" },
  ],
  whyItWorks: [
    { title: "تصميم مغلق مضاد للغبار", desc: "يحمي المستحضرات من الأتربة اليومية" },
    { title: "أرفف منظمة", desc: "مساحة لكل نوع — كريمات، أحمر شفاه، عطور" },
    { title: "مواد عالية الجودة", desc: "متينة وأنيقة — تدوم مع الاستخدام" },
    { title: "حجم عملي", desc: "يناسب معظم طاولات الزينة" },
  ],
  features: [
    "حماية من الغبار والرطوبة",
    "تصميم شفاف أنيق",
    "أرفف متعددة للتنظيم",
    "مناسبة لطاولة الزينة",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "آراء من اشتريت خزانة الجمال",
  finalCtaTitle: "جاهزة لزاوية جمال أكثر أناقة؟",
  valueSummary: "أنتِ لا تشتري خزانة — تشتريين روتيناً أكثر راحة وأناقة كل صباح",
});

export const ledMakeupBagCroPage = buildBeautyCroPage({
  heroHeadline: "إضاءة مثالية أينما كنت",
  heroSubheadline:
    "حقيبة مكياج فاخرة بإضاءة LED — أناقة وعملية في كل مكان",
  bullets: [
    "إضاءة LED مثالية للمكياج",
    "تصميم فاخر وخفيف",
    "مساحة منظمة داخلية",
    "سهلة الحمل والسفر",
  ],
  problemTitle: "هل الإضاءة تخرب مكياجك خارج البيت؟",
  problemCopy: "إضاءة ضعيفة · ألوان غير دقيقة · صعب تعدّلين بسرعة",
  solutionTitle: "إضاءة احترافية في حقيبتك",
  solutionCopy: "LED مدمج — مكياج دقيق في أي مكان",
  highlightCopy: "رفيقة السفر والتعديلات السريعة — أنيقة وعملية",
  benefits: [
    { title: "إضاءة LED مثالية", desc: "ترى ألوانك بوضوح — مكياج أدق" },
    { title: "أناقة فاخرة", desc: "تصميم يليق بذوقك — داخل وخارج البيت" },
    { title: "تنظيم داخلي", desc: "كل أداة في مكانها — بدون فوضى" },
    { title: "خفيفة للحمل", desc: "مناسبة للسفر والتعديلات السريعة" },
  ],
  whyItWorks: [
    { title: "إضاءة LED مدمجة", desc: "توزيع متساوٍ للضوء على الوجه" },
    { title: "مرآة واضحة", desc: "رؤية دقيقة لكل تفصيلة" },
    { title: "تصميم مدمج", desc: "لا تشغل مساحة كبيرة في حقيبتك" },
    { title: "مواد فاخرة", desc: "ملمس ناعم ومتين" },
  ],
  features: [
    "إضاءة LED مدمجة",
    "مرآة عالية الوضوح",
    "تقسيمات داخلية منظمة",
    "خفيفة وسهلة الحمل",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "آراء من اشتريت حقيبة الـ LED",
  finalCtaTitle: "جاهزة لمكياج أدق في أي مكان؟",
  valueSummary: "حقيبة واحدة — إضاءة احترافية وأناقة ترافقك أينما كنت",
});

export const makeupBrushCleanerCroPage = buildBeautyCroPage({
  heroHeadline: "فرش أنظف في دقائق",
  heroSubheadline:
    "جهاز ذكي لتنظيف وتجفيف فرش المكياج — عناية أعمق ببشرتك",
  bullets: [
    "تنظيف عميق سريع",
    "تجفيف تلقائي",
    "مناسب لمعظم الفرش",
    "سهل الاستخدام",
  ],
  problemTitle: "هل فرشك تحمل بقايا مكياج قديم؟",
  problemCopy: "فرش متسخة · بقع على البشرة · تنظيف يدوي متعب",
  solutionTitle: "تنظيف وتجفيف بضغطة",
  solutionCopy: "ضعي الفرشة · شغّلي الجهاز · فرش نظيفة وجافة",
  highlightCopy: "روتين عناية أكثر نظافة — بجهد أقل",
  benefits: [
    { title: "تنظيف عميق", desc: "يزيل بقايا المكياج من عمق الفرش" },
    { title: "تجفيف سريع", desc: "جاهزة للاستخدام في دقائق" },
    { title: "بشرة أنظف", desc: "فرش نظيفة = مكياج أجمل وأقل تهيجاً" },
    { title: "توفير وقت", desc: "بدلاً من الغسل اليدوي المتعب" },
  ],
  whyItWorks: [
    { title: "تقنية تنظيف دوارة", desc: "تنظيف شامل لشعر الفرشة" },
    { title: "تجفيف بالهواء", desc: "فرش جافة وجاهزة بسرعة" },
    { title: "يتسع لعدة أحجام", desc: "مناسب لمعظم فرش المكياج" },
    { title: "تشغيل بسيط", desc: "زر واحد — بدون تعقيد" },
  ],
  features: [
    "تنظيف وتجفيف تلقائي",
    "مناسب لمعظم الفرش",
    "تشغيل بزر واحد",
    "تصميم مدمج أنيق",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "آراء من اشتريت جهاز تنظيف الفرش",
  finalCtaTitle: "جاهزة لفرش أنظف كل يوم؟",
  valueSummary: "جهاز واحد — فرش نظيفة وروتين عناية أكثر راحة",
});

export const rotatingBrushOrganizerCroPage = buildBeautyCroPage({
  heroHeadline: "فرشك مرتبة ومحمية",
  heroSubheadline:
    "منظم دوار فاخر — ترتيب أنيق يبعد فرشك عن الغبار",
  bullets: [
    "تصميم دوار عملي",
    "حماية من الغبار",
    "سهل الوصول لكل فرشة",
    "مظهر أنيق على الطاولة",
  ],
  problemTitle: "هل فرشك مبعثرة ومعرضة للغبار؟",
  problemCopy: "فرش على الطاولة · غبار · صعب تلاقين الفرشة المناسبة",
  solutionTitle: "ترتيب دوار أنيق",
  solutionCopy: "كل فرشة في مكانها — دوران سهل ووصول سريع",
  highlightCopy: "يليق بزاوية جمالك ويحافظ على فرشك نظيفة",
  benefits: [
    { title: "ترتيب واضح", desc: "كل فرشة مرئية وسهلة الوصول" },
    { title: "حماية من الغبار", desc: "فرش نظيفة لفترة أطول" },
    { title: "تصميم دوار", desc: "وصول سريع بدون فوضى" },
    { title: "لمسة فاخرة", desc: "يضيف أناقة لطاولة الزينة" },
  ],
  whyItWorks: [
    { title: "قاعدة دوارة", desc: "تدوير سلس لاختيار الفرشة بسرعة" },
    { title: "فتحات متعددة", desc: "تسع معظم أحجام الفرش" },
    { title: "تصميم مغلق جزئياً", desc: "يقلل تراكم الغبار" },
    { title: "قاعدة ثابتة", desc: "لا تنقلب — آمن على الطاولة" },
  ],
  features: [
    "تصميم دوار 360°",
    "فتحات متعددة للفرش",
    "حماية من الغبار",
    "قاعدة ثابتة أنيقة",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "آراء من اشتريت منظم الفرش الدوار",
  finalCtaTitle: "جاهزة لفرش مرتبة وأنيقة؟",
  valueSummary: "منظم واحد — زاوية جمال أكثر ترتيباً كل يوم",
});
