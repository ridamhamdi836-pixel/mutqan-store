import type { CroProductPageConfig } from "@/types/cro-product-page";
import {
  CRO_COD_COMPARISON_ROWS,
  CRO_OFFER,
  CRO_ORDER_PROCESS,
  CRO_TRUST_BADGES,
} from "./shared";

type SkincareCroInput = {
  heroHeadline: string;
  heroSubheadline: string;
  bullets: string[];
  problemTitle: string;
  problemCopy: string;
  whyHappensTitle: string;
  whyHappensCopy: string;
  solutionTitle: string;
  solutionCopy: string;
  ingredientsTitle: string;
  ingredients: Array<{ title: string; desc: string }>;
  highlightCopy: string;
  benefits: Array<{ title: string; desc: string }>;
  results: Array<{ title: string; desc: string }>;
  howToUse: string[];
  features: string[];
  reviewsTitle: string;
  finalCtaTitle: string;
  valueSummary: string;
};

function buildSkincareCroPage(input: SkincareCroInput): CroProductPageConfig {
  return {
    hero: {
      headline: input.heroHeadline,
      subheadline: input.heroSubheadline,
      bullets: input.bullets,
    },
    trustBadges: [...CRO_TRUST_BADGES],
    beforeAfter: {
      title: "قبل وبعد — عندما تبدأ البشرة بالاستجابة",
      subtitle: "ليس تغييراً ليلياً، بل روتين هادئ تلاحظين معه الفرق تدريجياً",
    },
    problem: { title: input.problemTitle, copy: input.problemCopy },
    solution: {
      title: input.solutionTitle,
      copy: input.solutionCopy,
    },
    highlight: {
      title: input.whyHappensTitle,
      copy: input.whyHappensCopy,
      placeholder: "",
    },
    benefits: {
      title: "كيف يساعدك؟",
      items: input.benefits,
    },
    whyItWorks: {
      title: input.ingredientsTitle,
      items: input.ingredients.map((item) => ({
        title: item.title,
        desc: item.desc,
        placeholder: "",
      })),
    },
    features: {
      title: "طريقة الاستخدام",
      items: input.howToUse,
    },
    valueJustification: {
      eyebrow: "قيمة العناية",
      title: "أنتِ لا تشتريين سيروماً فقط",
      summary: input.valueSummary,
      footerLine: "روتين بسيط — ثقة تدوم",
      footerSubline: "عناية · إشراقة · راحة",
      cards: input.results.map((item, index) => ({
        icon: (["sparkles", "shield", "clock"] as const)[index % 3],
        tag: item.title,
        headline: item.title,
        support: item.desc,
        featured: index === 1,
      })),
    },
    offer: { ...CRO_OFFER },
    reviews: {
      title: input.reviewsTitle,
      subtitle: "تجارب هادئة من عميلات بدأن بخطوة واحدة",
    },
    comparison: {
      title: "لماذا متقن؟",
      subtitle: "عناية كورية فاخرة — بدون تعقيد",
      rows: [
        { label: "تركيبات مركزة بخطوة واحدة", us: true, alternative: false },
        { label: "تجربة فاخرة بسيطة", us: true, alternative: false },
        { label: "مناسبة للروتين اليومي", us: true, alternative: false },
        ...CRO_COD_COMPARISON_ROWS,
      ],
    },
    orderProcess: { ...CRO_ORDER_PROCESS },
    finalCta: {
      title: input.finalCtaTitle,
      subtitle: "اطلبي الآن — دفع عند الاستلام وضمان 30 يوم",
    },
  };
}

export const vitaminCBoosterCroPage = buildSkincareCroPage({
  heroHeadline: "سيروم فيتامين سي ونياسيناميد ضد البقع والبهتان",
  heroSubheadline:
    "حمض الأسكوربيك ونياسيناميد بجرعة مركّزة — يستهدف البقع والبهتان ويوحّد مظهر البشرة. لإشراقة تبدأ من أول نظرة في المرآة.",
  bullets: [
    "إشراقة هادئة دون مبالغة",
    "يساعد على توحيد مظهر البشرة",
    "خطوة واحدة في روتينك الصباحي",
    "ملمس خفيف ينسجم مع بقية العناية",
  ],
  problemTitle: "هل تشعرين أن بشرتك باهتة رغم كل ما تفعلينه؟",
  problemCopy:
    "التعب، الإجهاد، والعوامل اليومية تترك البشرة بلا حيوية. تضعين الكريمات، لكن المرآة لا تعكس الإشراقة التي تتمنينها.",
  whyHappensTitle: "لماذا يحدث هذا؟",
  whyHappensCopy:
    "مع الوقت، تفقد البشرة توهجها الطبيعي. الإجهاد والتعرض اليومي يبطئان تجدد الخلايا، فيظهر اللون غير متساوٍ والبشرة بلا حياة.",
  solutionTitle: "الإشراقة تبدأ من خطوة مركزة",
  solutionCopy:
    "فيتامين سي في تركيبة مركّزة يدعم إشراقة البشرة ويوحّد مظهرها تدريجياً — لتشعرين أن بشرتك تعود للحياة.",
  ingredientsTitle: "المكونات المهمة",
  ingredients: [
    { title: "فيتامين سي مستقر", desc: "يدعم الإشراقة ويوحّد مظهر البشرة بلطف." },
    { title: "نياسيناميد", desc: "يساعد على تقليل مظهر البقع وتحسين النعومة." },
    { title: "مستخلصات مهدئة", desc: "لتجربة مريحة حتى على البشرة الحساسة." },
  ],
  highlightCopy: "ليس وعداً بمعجزة — بل روتين يمنحك إحساساً أوضح كل أسبوع.",
  benefits: [
    { title: "توهج طبيعي", desc: "بشرة تبدو أكثر حيوية من الداخل." },
    { title: "مظهر موحّد", desc: "لون أكثر اتزاناً مع الاستمرار." },
    { title: "ثقة في المرآة", desc: "إشراقة تلاحظينها في روتينك اليومي." },
    { title: "خطوة بسيطة", desc: "تندمج بسهولة في صباحك دون تعقيد." },
  ],
  results: [
    { title: "أسبوعان", desc: "بشرة تبدو أكثر نضارة ونعومة." },
    { title: "شهر", desc: "مظهر أكثر توحيداً وإشراقة واضحة." },
    { title: "روتين مستمر", desc: "ثقة تبقى معك كل صباح." },
  ],
  howToUse: [
    "نظّفي بشرتك جيداً",
    "ضعي 2-3 قطرات على الوجه والرقبة",
    "دلّكي بلطف حتى الامتصاص",
    "أكملي بمرطب وواقي شمس صباحاً",
  ],
  features: [
    "تركيبة خفيفة سريعة الامتصاص",
    "مناسبة للاستخدام اليومي",
    "خطوة واحدة قبل المرطب",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "عميلات لاحظن الفرق",
  finalCtaTitle: "ابدئي رحلة الإشراقة اليوم",
  valueSummary: "أنتِ تستثمرين في شعور — بشرة أكثر إشراقاً وثقة كل يوم.",
});

export const ceramideBoosterCroPage = buildSkincareCroPage({
  heroHeadline: "سيروم السنتيلا والسيراميد ضد الحبوب وجلد الدجاجة",
  heroSubheadline:
    "سنتيلا آسيوية وسيراميد NP وبانثينول — يهدئان الحبوب، يرطّبان، ويخففان جلد الدجاجة. لبشرة حريرية ومريحة كل يوم.",
  bullets: [
    "إصلاح حاجز البشرة بلطف",
    "ترطيب عميق دون ثقل",
    "مناسب للبشرة الحساسة",
    "خطوة واحدة في روتينك الليلي",
  ],
  problemTitle: "هل بشرتك تشعر بالجفاف أو التوتر رغم المرطب؟",
  problemCopy:
    "أحياناً المرطب وحده لا يكفي. حاجز البشرة الضعيف يجعلها جافة، حساسة، وغير مرتاحة — حتى مع أفضل الكريمات.",
  whyHappensTitle: "لماذا يحدث هذا؟",
  whyHappensCopy:
    "العوامل الخارجية والتنظيف القوي يضعفان حاجز البشرة. عندما يفقد الحاجز قوته، تفقد البشرة قدرتها على الاحتفاظ بالرطوبة.",
  solutionTitle: "الإصلاح يبدأ من الداخل",
  solutionCopy:
    "السيراميد يعيد بناء حاجز البشرة ويدعم ترطيبها الطبيعي — لتشعرين ببشرة أهدأ وأكثر راحة.",
  ingredientsTitle: "المكونات المهمة",
  ingredients: [
    { title: "سيراميد مركّز", desc: "يعيد بناء حاجز البشرة ويحافظ على رطوبتها." },
    { title: "حمض الهيالورونيك", desc: "يرطب بعمق دون إحساس بالثقل." },
    { title: "مستخلصات مهدئة", desc: "تهدئ البشرة الحساسة وتقلل الإحساس بالتوتر." },
  ],
  highlightCopy: "عناية هادئة تركز على ما تحتاجه بشرتك حقاً — الراحة والتوازن.",
  benefits: [
    { title: "حاجز أقوى", desc: "بشرة أكثر قدرة على حماية نفسها." },
    { title: "ترطيب يدوم", desc: "رطوبة تبقى معك طوال اليوم." },
    { title: "بشرة هادئة", desc: "أقل حساسية وأكثر راحة." },
    { title: "ملمس ناعم", desc: "بشرة تبدو وكأنها أكثر نعومة من الداخل." },
  ],
  results: [
    { title: "أيام قليلة", desc: "إحساس بالراحة والترطيب." },
    { title: "أسبوعان", desc: "بشرة أهدأ وأقل جفافاً." },
    { title: "روتين مستمر", desc: "حاجز قوي يدوم معك." },
  ],
  howToUse: [
    "نظّفي بشرتك مساءً",
    "ضعي 2-3 قطرات على الوجه والرقبة",
    "دلّكي بلطف حتى الامتصاص",
    "أكملي بمرطب ليلي",
  ],
  features: [
    "تركيبة غنية ومريحة",
    "مناسبة للبشرة الحساسة",
    "خطوة إصلاح قبل المرطب",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "عميلات وجدن الراحة",
  finalCtaTitle: "امنحي بشرتك الراحة التي تستحقها",
  valueSummary: "أنتِ تستثمرين في شعور — بشرة مرتاحة وواثقة كل يوم.",
});

export const pdrnBoosterCroPage = buildSkincareCroPage({
  heroHeadline: "سيروم PDRN والببتيدات ضد التجاعيد والخطوط الدقيقة",
  heroSubheadline:
    "PDRN وأدينوزين وببتيدات — يشدّان مظهر البشرة ويقللان الخطوط الدقيقة. عناية شباب بروتين كوري — بلا إبر وبلا مبالغة.",
  bullets: [
    "يدعم مرونة البشرة بلطف",
    "يقلل مظهر الخطوط الدقيقة",
    "ملمس أنعم وأكثر حيوية",
    "خطوة شباب في روتينك",
  ],
  problemTitle: "هل تلاحظين أن بشرتك فقدت بعض حيويتها؟",
  problemCopy:
    "مع الوقت، تفقد البشرة مرونتها. الخطوط الدقيقة تظهر، والبشرة لا تعكس الشباب الذي تشعرين به من الداخل.",
  whyHappensTitle: "لماذا يحدث هذا؟",
  whyHappensCopy:
    "التقدم في العمر يبطئ تجدد الخلايا ويقلل إنتاج الكولاجين. البشرة تحتاج دعماً مركزاً لتستعيد مرونتها.",
  solutionTitle: "الشباب يبدأ من العناية المركزة",
  solutionCopy:
    "PDRN يدعم تجدد البشرة ويعزز مرونتها — لتشعرين أن بشرتك تعود لحيويتها تدريجياً.",
  ingredientsTitle: "المكونات المهمة",
  ingredients: [
    { title: "PDRN", desc: "يدعم تجدد الخلايا ومرونة البشرة." },
    { title: "ببتيدات", desc: "تعزز إنتاج الكولاجين وتقلل مظهر الخطوط." },
    { title: "مضادات أكسدة", desc: "تحمي البشرة من العوامل الخارجية." },
  ],
  highlightCopy: "عناية تركز على ما تبحثين عنه — بشرة أكثر شباباً ومرونة.",
  benefits: [
    { title: "مرونة أعلى", desc: "بشرة تبدو أكثر شدّاً ونعومة." },
    { title: "خطوط أقل وضوحاً", desc: "مظهر أنعم مع الاستمرار." },
    { title: "حيوية تعود", desc: "بشرة تعكس الشباب الذي تشعرين به." },
    { title: "ثقة في كل عمر", desc: "لأن الجمال لا يعرف عمراً." },
  ],
  results: [
    { title: "3 أسابيع", desc: "ملمس أنعم وبشرة أكثر حيوية." },
    { title: "شهر", desc: "مظهر أقل للخطوط الدقيقة." },
    { title: "روتين مستمر", desc: "مرونة تدوم معك." },
  ],
  howToUse: [
    "نظّفي بشرتك جيداً",
    "ضعي 2-3 قطرات على الوجه والرقبة",
    "دلّكي بلطف مع حركات صاعدة",
    "أكملي بمرطب وواقي شمس",
  ],
  features: [
    "تركيبة مركزة للشباب",
    "مناسبة للبشرة الناضجة",
    "خطوة واحدة في الروتين",
    "ضمان 30 يوم",
  ],
  reviewsTitle: "عميلات لاحظن التحول",
  finalCtaTitle: "ابدئي رحلة الشباب اليوم",
  valueSummary: "أنتِ تستثمرين في شعور — بشرة أكثر شباباً وثقة.",
});
