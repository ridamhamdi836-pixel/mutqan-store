import type { CroProductPageConfig } from "@/types/cro-product-page";
import {
  CRO_OFFER,
  CRO_ORDER_PROCESS,
  CRO_TRUST_BADGES,
} from "./shared";

export const sinkOrganizerCroPage: CroProductPageConfig = {
  hero: {
    headline: "تحت المغسلة فوضى؟ حوّلها مساحة تخزين مرتبة",
    subheadline:
      "وصول أسرع لأدوات التنظيف — بدون تكديس — حتى مع وجود المواسير",
    bullets: [
      "يستغل المساحة المهدورة",
      "يناسب أغلب المواسير",
      "معدن متين وليس بلاستيك",
      "وصول أسرع لأدوات التنظيف",
    ],
  },
  trustBadges: [...CRO_TRUST_BADGES],
  beforeAfter: {
    title: "الفرق واضح — قبل وبعد",
    subtitle: "شاهد التحول تحت المغسلة في ثوانٍ",
  },
  problem: {
    title: "هل تحت المغسلة عندك هكذا؟",
    copy: "زجاجات مكدّسة · مواسير تأخذ نصف المساحة · صعب تلاقي أي شيء",
  },
  solution: {
    title: "ترتيب ذكي حول المواسير",
    copy: "أدراج منزلقة · وصول سريع · كل شيء بمكانه",
  },
  highlight: {
    title: "هل يناسب مغسلتي؟",
    copy: "صُمّم ليتكيّف مع مواسير أغلب المغاسل — بدون حفر أو تعديل",
    placeholder: "[PIPE COMPATIBILITY PLACEHOLDER]",
  },
  benefits: {
    title: "ماذا يتغيّر في يومك؟",
    items: [
      {
        title: "يستغل المساحات التي تضيع بسبب المواسير",
        desc: "لا تترك نصف الخزانة فارغاً بعد اليوم",
      },
      {
        title: "وصول أسرع لكل أدوات التنظيف بدون فوضى",
        desc: "افتح الدرج — خذ ما تحتاج — بدون بحث",
      },
      {
        title: "مطبخ وحمام أنظف من الخارج",
        desc: "ما عاد تحتاج تخبّي الفوضى وراء الباب",
      },
      {
        title: "تركيب بسيط بدون أدوات",
        desc: "تركّبه بنفسك في دقائق",
      },
    ],
  },
  whyItWorks: {
    title: "لماذا يعمل فعلاً؟",
    items: [
      {
        title: "هيكل معدني متين",
        desc: "يتحمل زجاجات ومنظفات يومياً — ليس بلاستيك رخيص",
        placeholder: "[METAL CONSTRUCTION PLACEHOLDER]",
      },
      {
        title: "أدراج منزلقة",
        desc: "تسحب للخارج — تشوف كل شيء بدون انحناء",
        placeholder: "[SLIDING DRAWERS PLACEHOLDER]",
      },
      {
        title: "تصميم يتجاوز المواسير",
        desc: "يستغل المساحة حول المواسير لا أمامها فقط",
        placeholder: "[PIPE FIT PLACEHOLDER]",
      },
      {
        title: "ثبات ومتانة",
        desc: "ما يتزحزح مع الاستخدام اليومي",
        placeholder: "[STABILITY PLACEHOLDER]",
      },
    ],
  },
  features: {
    title: "مواصفات سريعة",
    items: [
      "تحت المغسلة — مطبخ أو حمام",
      "أرفف + أدراج منزلقة",
      "مقاوم للرطوبة اليومية",
      "تركيب بدون حفر",
      "ضمان 30 يوم",
    ],
  },
  valueJustification: {
    eyebrow: "قبل أن ترى السعر",
    title: "لماذا يعتبره العملاء استثماراً وليس مجرد منظم؟",
    summary:
      "أنت لا تشتري «رفاً» — تشتري مساحة تخزين حقيقية وراحة يومية تحت المغسلة",
    footerLine: "استثمار مرة واحدة — ترتيب يدوم لسنوات",
    footerSubline: "مساحة · راحة · ترتيب يومي — يستحق السعر",
    featuredStatLabel: "تخزين",
    cards: [
      {
        icon: "home",
        tag: "مساحة مهملة",
        headline:
          "يستغل مساحة موجودة بالفعل داخل منزلك بدل أن تبقى مهملة",
        support:
          "المساحة تحت المغسلة تصبح تخزيناً حقيقياً — بدون توسعة أو تجديد",
      },
      {
        icon: "layers",
        tag: "ضعف التخزين",
        stat: "×2",
        headline: "يضاعف تقريباً سعة التخزين تحت المغسلة دون أي تعديل",
        support: "مستويان من الأدراج المنزلقة — تركيب بسيط بدون حفر",
        featured: true,
      },
      {
        icon: "scan",
        tag: "وصول فوري",
        stat: "ثوانٍ",
        headline: "كل أدواتك أمامك خلال ثوانٍ بدل البحث وسط الفوضى",
        support: "افتح الدرج — خذ ما تحتاج — بدون انحناء أو تكديس",
      },
      {
        icon: "shield",
        tag: "متانة حقيقية",
        headline: "هيكل معدني متين مصمم للاستخدام اليومي لسنوات",
        support: "يتحمل زجاجات ومنظفات يومياً — ليس بلاستيك رخيص",
      },
      {
        icon: "sparkles",
        tag: "ليس مؤقتاً",
        headline:
          "ترتيب يومي يدوم لسنوات... وليس حلاً مؤقتاً لأسبوع أو أسبوعين",
        support: "استثمار مرة واحدة — راحة يومية طويلة الأمد",
        accent: true,
      },
    ],
  },
  offer: { ...CRO_OFFER },
  reviews: {
    title: "آراء من اشتروا المنظّم",
    subtitle: "صور حقيقية من عملاء متقن",
  },
  comparison: {
    title: "لماذا متقن وليس البدائل؟",
    subtitle: "مقارنة سريعة قبل أن تقرر",
    rows: [
      { label: "يناسب المواسير تحت المغسلة", us: true, alternative: false },
      { label: "هيكل معدني متين", us: true, alternative: false },
      { label: "أدراج منزلقة للوصول السريع", us: true, alternative: false },
      { label: "الدفع عند الاستلام", us: true, alternative: false },
      { label: "تأكيد هاتفي قبل الشحن", us: true, alternative: false },
      { label: "ضمان 30 يوم", us: true, alternative: false },
    ],
  },
  orderProcess: { ...CRO_ORDER_PROCESS },
  finalCta: {
    title: "جاهز لترتيب تحت المغسلة؟",
    subtitle: "دفع عند الاستلام · تأكيد هاتفي · ضمان 30 يوم",
  },
};
