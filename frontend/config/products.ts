import { Product } from "@/types";
import { withImageVersion, SKINCARE_PRODUCT_IMAGE_VERSION } from "@/lib/image-display";

export type ProductPageConfig = {
  heroImageAlt: string;
  shortPromise: string;
  heroAngle: string;
  problemStatement: string;
  /** Optional image used only in the product page hero (not catalog/cards) */
  heroSectionImage?: string;
  heroSectionImageAlt?: string;
  heroSectionAspect?: string;
  /** Optional image used only in the pain/problem section on the product page */
  painSectionImage?: string;
  painSectionImageAlt?: string;
  painSectionAspect?: string;
  /** Optional image used only in the solution section on the product page */
  solutionSectionImage?: string;
  solutionSectionImageAlt?: string;
  solutionSectionAspect?: string;
  /** Optional image used only in the lifestyle/benefits section on the product page */
  lifestyleSectionImage?: string;
  lifestyleSectionImageAlt?: string;
  lifestyleSectionAspect?: string;
  /** Optional image used only in the before/after "after" card on the product page */
  afterSectionImage?: string;
  afterSectionImageAlt?: string;
  afterSectionAspect?: string;
  /** Optional image for "sliding drawers" proof block on the product page */
  slidingDrawersSectionImage?: string;
  slidingDrawersSectionImageAlt?: string;
  slidingDrawersSectionAspect?: string;
  /** Optional image for "metal structure" proof block on the product page */
  metalStructureSectionImage?: string;
  metalStructureSectionImageAlt?: string;
  metalStructureSectionAspect?: string;
  /** Optional image for "stability" proof block on the product page */
  stabilitySectionImage?: string;
  stabilitySectionImageAlt?: string;
  stabilitySectionAspect?: string;
  /** Optional image for "pipe fit" proof block on the product page */
  pipeFitSectionImage?: string;
  pipeFitSectionImageAlt?: string;
  pipeFitSectionAspect?: string;
  /** Optional image for "no-tools assembly" proof block on the product page */
  noToolsAssemblySectionImage?: string;
  noToolsAssemblySectionImageAlt?: string;
  noToolsAssemblySectionAspect?: string;
  /** Optional image for "stackable vertical design" proof block on the product page */
  stackableDesignSectionImage?: string;
  stackableDesignSectionImageAlt?: string;
  stackableDesignSectionAspect?: string;
  /** Optional image for "elegant design" proof block on the product page */
  elegantDesignSectionImage?: string;
  elegantDesignSectionImageAlt?: string;
  elegantDesignSectionAspect?: string;
  /** Optional image for "durable structure" proof block on the product page */
  durableStructureSectionImage?: string;
  durableStructureSectionImageAlt?: string;
  durableStructureSectionAspect?: string;
  /** Optional image for dustproof design proof block on the product page */
  dustproofDesignSectionImage?: string;
  dustproofDesignSectionImageAlt?: string;
  dustproofDesignSectionAspect?: string;
  /** Optional image for organized shelves proof block on the product page */
  organizedShelvesSectionImage?: string;
  organizedShelvesSectionImageAlt?: string;
  organizedShelvesSectionAspect?: string;
  /** Optional image for quality materials proof block on the product page */
  qualityMaterialsSectionImage?: string;
  qualityMaterialsSectionImageAlt?: string;
  qualityMaterialsSectionAspect?: string;
  /** Optional image for practical size proof block on the product page */
  practicalSizeSectionImage?: string;
  practicalSizeSectionImageAlt?: string;
  practicalSizeSectionAspect?: string;
  /** Optional image used only in the before/after "before" card on the product page */
  beforeSectionImage?: string;
  beforeSectionImageAlt?: string;
  beforeSectionAspect?: string;
  /** Optional dimensions diagram on the product page */
  dimensionsSectionImage?: string;
  dimensionsSectionImageAlt?: string;
  dimensionsSectionAspect?: string;
  benefits: string[];
  beforeLabel: string;
  afterLabel: string;
  howToUse: string[];
  crossSellSlugs: string[];
  reviews: Array<{ name: string; city: string; rating: number; text: string; dateLabel?: string; photo?: string; photoAlt?: string; photoAspect?: string }>;
  faqs: Array<{ question: string; answer: string }>;
  seoTitle: string;
  seoDescription: string;
};

export const PRODUCTS_CONFIG: Record<string, ProductPageConfig> = {
  "powerful-cordless-vacuum": {
    heroImageAlt: "المكنسة اللاسلكية القوية أثناء التنظيف في المنزل",
    heroSectionImage: "/images/products/powerful-cordless-vacuum-hero.png",
    heroSectionImageAlt: "امرأة تستخدم المكنسة اللاسلكية القوية في غرفة المعيشة — تنظيف سريع وفعّال",
    heroSectionAspect: "819/1024",
    painSectionImage: "/images/products/powerful-cordless-vacuum-chaos.png",
    painSectionImageAlt: "امرأة أمام فوضى فتات على الكنب والأرض — غبار يومي في البيت",
    painSectionAspect: "819/1024",
    solutionSectionImage: "/images/products/powerful-cordless-vacuum-solution.png",
    solutionSectionImageAlt: "المكنسة اللاسلكية تنظف الفتات من الكنب — تنظيف سريع في ثوانٍ",
    solutionSectionAspect: "1024/938",
    lifestyleSectionImage: "/images/products/powerful-cordless-vacuum-lifestyle.png",
    lifestyleSectionImageAlt: "المكنسة اللاسلكية مع القاعدة والملحقات — فلتر قابل للغسل وشحن مريح",
    lifestyleSectionAspect: "1024/804",
    beforeSectionImage: "/images/products/powerful-cordless-vacuum-before.png",
    beforeSectionImageAlt: "امرأة أمام فتات على الكنب — فوضى قبل استخدام المكنسة",
    beforeSectionAspect: "1024/859",
    afterSectionImage: "/images/products/powerful-cordless-vacuum-after.png",
    afterSectionImageAlt: "امرأة تستخدم المكنسة على الكنب — منزل أنظف بعد متقن",
    afterSectionAspect: "1024/959",
    shortPromise: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق",
    heroAngle: "أداة تنظيف يومية سريعة للفوضى الصغيرة في المنزل والسيارة",
    problemStatement: "الغبار والفتات في ركنة الكنب، مقاعد السيارة، وسطح المطبخ لا يستحق إخراج المكنسة الكبيرة. المكنسة اللاسلكية القوية من متقن هي الحل اليومي العملي.",
    benefits: [
      "تنظيف خفيف وسريع في ثوانٍ",
      "مناسبة للمنزل والسيارة",
      "سهلة الحمل والتخزين",
      "فلتر قابل للتنظيف",
      "شحن مريح ومدة تشغيل مناسبة",
    ],
    beforeLabel: "قبل: فتات وغبار في المقاعد",
    afterLabel: "بعد متقن: سيارة ومنزل أنظف",
    howToUse: [
      "اشحن المكنسة قبل الاستخدام الأول",
      "اختر الملحق المناسب للسطح",
      "أدر المكنسة على المنطقة المراد تنظيفها",
      "فرّغ الحاوية ونظف الفلتر بانتظام",
    ],
    crossSellSlugs: ["pull-out-cabinet-drawer", "sink-organizer"],
    reviews: [
      {
        name: "سارة أحمد",
        city: "الرياض",
        rating: 5,
        text: "استخدمتها للسيارة والكنب وما شاء الله فرق واضح. سهلة الاستخدام وسريعة الشحن.",
        photo: "/images/reviews/powerful-cordless-vacuum/review-in-use.png",
        photoAlt: "صورة من سارة — المكنسة أثناء التنظيف على السجاد",
        photoAspect: "1024/768",
      },
      {
        name: "منال الشهري",
        city: "جدة",
        rating: 5,
        text: "قطعتين أخذت واحدة للبيت وواحدة للسيارة. أفضل قرار. مريحة جدًا للفتات اليومي.",
        photo: "/images/reviews/powerful-cordless-vacuum/review-unboxing.png",
        photoAlt: "صورة من منال — المكنسة بعد فتح الطرد",
        photoAspect: "768/1024",
      },
      { name: "نوف العتيبي", city: "الدمام", rating: 4, text: "خفيفة الوزن وفعّالة. أنصح فيها لكل بيت فيه أطفال." },
      {
        name: "عبير الراشد",
        city: "الطائف",
        rating: 5,
        text: "من أفضل المنتجات اللي طلبتها أونلاين. الشفط قوي والبطارية تمشي وقت طويل.",
        photo: "/images/reviews/powerful-cordless-vacuum/review-charger.png",
        photoAlt: "صورة من عبير — المكنسة على قاعدة الشحن",
        photoAspect: "685/1024",
      },
      {
        name: "لمياء السبيعي",
        city: "بريدة",
        rating: 5,
        text: "استخدمتها لتنظيف كراسي الأطفال في السيارة. ممتازة ونتيجة فورية.",
        photo: "/images/reviews/powerful-cordless-vacuum/review-handheld.png",
        photoAlt: "صورة من لمياء — المكنسة في اليد أثناء الاستخدام",
        photoAspect: "640/853",
      },
      {
        name: "هند القرني",
        city: "أبها",
        rating: 5,
        text: "شكل المكنسة أنيق وخفيفة. أحسن شيء إنها لاسلكية ما تحتاج أسلاك.",
        photo: "/images/reviews/powerful-cordless-vacuum/review-dock.png",
        photoAlt: "صورة من هند — المكنسة على القاعدة بجانب الكنب",
        photoAspect: "518/800",
      },
    ],
    faqs: [
      { question: "هل تناسب السيارة والمنزل؟", answer: "نعم، تأتي بملحقات مناسبة للمقاعد، الأركان، وأسطح المطبخ والسيارة." },
      { question: "هل هي بديلة للمكنسة الكبيرة؟", answer: "هي مكملة للمكنسة الكبيرة، وليست بديلة. مثالية للتنظيف اليومي الخفيف والسريع." },
      { question: "كيف يتم تنظيف الفلتر؟", answer: "يُفتح الفلتر بسهولة ويُنظف بالماء ويُجفف تمامًا قبل إعادة التركيب." },
      { question: "كم مدة التوصيل؟", answer: "عادة 2-5 أيام عمل داخل المدن الرئيسية في المملكة." },
      { question: "هل الدفع عند الاستلام متاح؟", answer: "نعم، الدفع عند الاستلام هو طريقة الدفع الوحيدة حاليًا. ادفع عند استلام الطلب بكل راحة." },
    ],
    seoTitle: "المكنسة اللاسلكية القوية | متقن",
    seoDescription: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق. اطلب الآن من متقن مع الدفع عند الاستلام والتوصيل داخل السعودية.",
  },
  "storage": {
    heroImageAlt: "الخزانة التراكمية الذكية بجانب المغسلة — تخزين منظم للمنزل",
    heroSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-couple-hero.png",
      5,
    ),
    heroSectionImageAlt: "رجل وامرأة مع الخزانة التراكمية الذكية — حل تنظيم يناسب كل البيت",
    heroSectionAspect: "884/1015",
    shortPromise: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق",
    heroAngle: "حوّل الزوايا المهملة إلى مساحة تخزين أنيقة ومنظمة",
    problemStatement: "المساحة ليست المشكلة، بل طريقة استخدامها. الخزانة التراكمية تستغل المساحة العمودية وتحوّل أي ركن إلى مخزن منظم وجميل.",
    painSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-chaos.png",
      5,
    ),
    painSectionImageAlt: "زوجان متعبان من فوضى البيت — المشكلة التي تحلها الخزانة التراكمية",
    painSectionAspect: "1024/682",
    solutionSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-assembly.png",
      5,
    ),
    solutionSectionImageAlt: "رجل يركّب الخزانة التراكمية الذكية بسهولة في البيت",
    solutionSectionAspect: "960/1023",
    lifestyleSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-woman.png",
      5,
    ),
    lifestyleSectionImageAlt: "امرأة بجانب الخزانة التراكمية الذكية — تناسب كل غرفة في البيت",
    lifestyleSectionAspect: "960/1007",
    noToolsAssemblySectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-no-tools-assembly.png",
      5,
    ),
    noToolsAssemblySectionImageAlt:
      "امرأة تركّب الخزانة التراكمية الذكية — تركيب بسيط بدون أدوات",
    noToolsAssemblySectionAspect: "778/1024",
    stackableDesignSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-stackable-design.png",
      5,
    ),
    stackableDesignSectionImageAlt:
      "امرأة بالعباءة السوداء بجانب الخزانة التراكمية في غرفة المعيشة — تصميم تراكمي عمودي",
    stackableDesignSectionAspect: "825/1024",
    elegantDesignSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-elegant-design.png",
      5,
    ),
    elegantDesignSectionImageAlt:
      "الخزانة التراكمية في غرفة المعيشة والطعام — تصميم أنيق يليق بأي غرفة",
    elegantDesignSectionAspect: "903/1024",
    durableStructureSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-durable-structure.png",
      6,
    ),
    durableStructureSectionImageAlt:
      "الخزانة التراكمية في غرفة الغسيل — هيكل متين مع أدراج عملية",
    durableStructureSectionAspect: "637/1024",
    afterSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-laundry-sink.png",
      5,
    ),
    afterSectionImageAlt: "الخزانة التراكمية الذكية بجانب المغسلة — تخزين أنيق ومرتب",
    afterSectionAspect: "898/1024",
    beforeSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-laundry-mess.png",
      5,
    ),
    beforeSectionImageAlt: "زاوية مغسلة مزدحمة وغير منظمة — قبل استخدام الخزانة التراكمية",
    beforeSectionAspect: "717/1024",
    dimensionsSectionImage: withImageVersion(
      "/images/products/smart-stackable-cabinet-dimensions.png",
      1,
    ),
    dimensionsSectionImageAlt:
      "مخطط أبعاد الخزانة التراكمية — عرض 70 سم وعمق 37 سم وارتفاع 33 سم لكل طبقة",
    dimensionsSectionAspect: "1024/682",
    benefits: [
      "تركيب سريع بدون أدوات",
      "تراكمية وقابلة للتوسع",
      "مواد متينة تتحمل الاستخدام اليومي",
      "تناسب غرف النوم، الحمام، والمطبخ",
      "تصميم أنيق يليق بالمنازل العصرية",
    ],
    beforeLabel: "قبل: زاوية مزدحمة وغير منظمة",
    afterLabel: "بعد متقن: تخزين أنيق ومرتب",
    howToUse: [
      "اختر الموقع المناسب لوضع الخزانة",
      "ابدأ بالقطعة السفلية وثبّتها",
      "أضف القطع العلوية بسهولة",
      "رتب أغراضك وامتع بالنظام الجديد",
    ],
    crossSellSlugs: ["pull-out-cabinet-drawer", "sink-organizer"],
    reviews: [
      {
        name: "هنوف القحطاني",
        city: "الرياض",
        rating: 5,
        text: "حطيتها في زاوية غرفة النوم وما شاء الله غيرت شكل الأوضة بالكامل. تركيب سهل وتصميم راقي.",
        photo: "/images/reviews/smart-stackable-cabinet/review-living-room.png",
        photoAlt: "صورة من هنوف — الخزانة في غرفة المعيشة بعد التركيب",
        photoAspect: "576/983",
      },
      {
        name: "ريم الزهراني",
        city: "مكة",
        rating: 5,
        text: "أخذت قطعتين للحمام وغرفة الملابس. تنظيم مثالي وبسعر ممتاز.",
        photo: "/images/reviews/smart-stackable-cabinet/review-hallway.png",
        photoAlt: "صورة من ريم — الخزانة في الممر بعد الاستلام",
        photoAspect: "401/663",
      },
      { name: "دلال الحربي", city: "الدمام", rating: 5, text: "شكلها فخم ومرتبة. استغليت مساحة ما كنت أستخدمها أبداً. أنصح فيها بشدة." },
      {
        name: "مها العمري",
        city: "الطائف",
        rating: 5,
        text: "حطيت واحدة في المطبخ والثانية في الحمام. ترتيب ممتاز وتوفير مساحة.",
        photo: "/images/reviews/smart-stackable-cabinet/review-kitchen-use.png",
        photoAlt: "صورة من مها — استخدام الخزانة في المطبخ",
        photoAspect: "406/664",
      },
      {
        name: "سلمى الخالدي",
        city: "تبوك",
        rating: 4,
        text: "جودة ممتازة والتركيب سهل بدون أدوات. تصميم عملي يناسب أي مكان.",
        photo: "/images/reviews/smart-stackable-cabinet/review-unboxing.png",
        photoAlt: "صورة من سلمى — الخزانة بعد التركيب في البيت",
        photoAspect: "400/672",
      },
      { name: "عهود البلوي", city: "المدينة", rating: 5, text: "أفضل حل للتخزين جربته. صار البيت أنظم وأريح بكثير." },
    ],
    faqs: [
      { question: "هل يمكن تركيبها فوق بعضها؟", answer: "نعم، صُممت خصيصًا لتثبت فوق بعضها بأمان." },
      { question: "أين يمكن استخدامها؟", answer: "في أي مكان: غرف النوم، الحمام، المطبخ، مناطق التخزين، أو الغرف الجانبية." },
      { question: "هل تحتاج أدوات تركيب؟", answer: "لا، التركيب بسيط جدًا ولا يحتاج أي أدوات." },
      { question: "هل يمكن طلب أكثر من خزانة؟", answer: "نعم — خزانتين بـ 599 ر.س (توفير 99 ر.س)، أو 3 خزائن بـ 749 ر.س (توفير 298 ر.س)." },
    ],
    seoTitle: "الخزانة التراكمية الذكية | متقن",
    seoDescription: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا. اطلب الآن مع الدفع عند الاستلام والتوصيل داخل السعودية.",
  },
  "pull-out-cabinet-drawer": {
    heroImageAlt: "درج الخزانة المنزلق — تنظيم أدوات المطبخ بسهولة",
    heroSectionImage: "/images/products/pull-out-cabinet-drawer-hero.png",
    heroSectionImageAlt: "درج الخزانة المنزلق مفتوح — بهارات وأواني منظمة بسهولة",
    heroSectionAspect: "930/1024",
    shortPromise: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة",
    heroAngle: "اجعل المساحة المخفية خلف الخزانة سهلة الوصول في ثانية واحدة",
    problemStatement: "الأغراض في آخر الخزانة تُنسى ولا تُستخدم. الدرج المنزلق يجلب كل شيء إلى متناول يدك في لحظة.",
    painSectionImage: "/images/products/pull-out-cabinet-drawer-chaos.png",
    painSectionImageAlt: "امرأة أمام خزانة مطبخ مزدحمة — صعوبة الوصول للأواني في الخلف",
    painSectionAspect: "1024/681",
    solutionSectionImage: "/images/products/pull-out-cabinet-drawer-solution.png",
    solutionSectionImageAlt: "امرأة تستخدم الدرج المنزلق — بهارات وأواني منظمة بسهولة",
    solutionSectionAspect: "1024/976",
    lifestyleSectionImage: "/images/products/pull-out-cabinet-drawer-lifestyle.png",
    lifestyleSectionImageAlt: "امرأة تطبخ وتستخدم الدرج المنزلق — تنظيم المطبخ بسهولة",
    lifestyleSectionAspect: "1024/681",
    benefits: [
      "وصول سهل لأعمق نقطة في الخزانة",
      "انزلاق سلس وصامت",
      "يتحمل أوزان البهارات وأدوات التنظيف",
      "سهل التركيب والإزالة",
      "متوفر بباقات تناسب المطبخ والحمام",
    ],
    beforeLabel: "قبل: أشياء مخبأة وصعبة الوصول",
    beforeSectionImage: "/images/products/pull-out-cabinet-drawer-before.png",
    beforeSectionImageAlt: "خزانة مطبخ مزدحمة — أواني ومرطبانات صعبة الوصول",
    beforeSectionAspect: "1024/771",
    afterLabel: "بعد متقن: كل شيء بمتناول يدك",
    afterSectionImage: "/images/products/pull-out-cabinet-drawer-after.png",
    afterSectionImageAlt: "امرأة تستخدم الدرج المنزلق — كل شيء بمتناول اليد",
    afterSectionAspect: "1024/768",
    howToUse: [
      "قِس عرض الخزانة قبل الطلب",
      "ضع الدرج على القاعدة المخصصة",
      "اسحب ببساطة للوصول لأغراضك",
    ],
    crossSellSlugs: ["sink-organizer", "storage"],
    reviews: [
      {
        name: "نورة العنزي",
        city: "الرياض",
        rating: 5,
        text: "أكثر شيء فرق معي أن الأشياء اللي كانت في آخر الخزانة صارت سهلة الوصول. ممتازة جدًا.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-pantry-extended.png",
        photoAlt: "صورة من نورة — الدرج المنزلق ممتد داخل الخزانة",
        photoAspect: "1024/768",
      },
      {
        name: "فوز الدوسري",
        city: "الخبر",
        rating: 5,
        text: "طلبت 4 قطع للمطبخ. الفرق كبير جدًا في الترتيب والوصول للبهارات والأواني.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-pantry-shelves.png",
        photoAlt: "صورة من فوز — درجين منزلقين منظّمين في المطبخ",
        photoAspect: "768/1024",
      },
      {
        name: "ابتسام الحربي",
        city: "الدمام",
        rating: 4,
        text: "تركيبها سهل جدًا والانزلاق سلس. راضية جدًا عن الشراء.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-wood-cabinet.png",
        photoAlt: "صورة من ابتسام — الدرج المنزلق بعد التركيب في الخزانة",
        photoAspect: "768/1024",
      },
      {
        name: "وجدان المالكي",
        city: "جدة",
        rating: 5,
        text: "كل الخزائن صارت منظمة. البهارات والأواني كلها بمتناول اليد بدون أي جهد.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-pantry-drawer.png",
        photoAlt: "صورة من وجدان — درج منزلق ممتلئ بمستلزمات المطبخ",
        photoAspect: "768/1024",
      },
      {
        name: "نجلاء الزهراني",
        city: "مكة",
        rating: 5,
        text: "أخذت 6 قطع للبيت كامل. صراحة أفضل شيء سويته للمطبخ من سنوات.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-kitchen-install.png",
        photoAlt: "صورة من نجلاء — درجين منزلقين في خزانة المطبخ",
        photoAspect: "768/1024",
      },
      {
        name: "رنا الشريف",
        city: "حائل",
        rating: 5,
        text: "حتى زوجي لاحظ الفرق في المطبخ. الانزلاق ناعم والجودة عالية.",
        photo: "/images/reviews/pull-out-cabinet-drawer/review-under-sink.png",
        photoAlt: "صورة من رنا — الدرج المنزلق تحت الخزانة منظّم",
        photoAspect: "768/1024",
      },
    ],
    faqs: [
      { question: "كيف أعرف أنها تناسب خزانتي؟", answer: "قس عرض الخزانة الداخلي. فريق التأكيد يساعدك للتأكد قبل الشحن." },
      { question: "هل تحتاج تركيب؟", answer: "لا، توضع مباشرة داخل الخزانة بدون أي تثبيت أو أدوات." },
      { question: "هل تتحمل أدوات المطبخ؟", answer: "نعم، مصممة لتتحمل البهارات وأدوات التنظيف والعلب." },
      { question: "ما الفرق بين الباقات؟", answer: "قطعة واحدة لبداية التنظيم، قطعتان لدرجين في المطبخ (الأكثر اختيارًا)، وخيارات 3 و4 قطع بتوفير أكبر." },
      { question: "هل يمكن استخدامها تحت المغسلة؟", answer: "نعم، تعمل بشكل ممتاز تحت المغسلة مع مراعاة المواسير." },
    ],
    seoTitle: "درج الخزانة المنزلق | متقن",
    seoDescription: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة. اطلب الآن من متقن مع الدفع عند الاستلام.",
  },
  "sink-organizer": {
    heroImageAlt: "منظّم المغسلة السحري — تنظيم أنيق تحت المغسلة",
    heroSectionImage: "/images/products/magic-under-sink-organizer-hero.png?v=3",
    heroSectionImageAlt: "امرأة برداء بيج تستخدم منظّم المغسلة السحري تحت الحوض — تخزين ذكي ومرتب",
    heroSectionAspect: "819/1024",
    painSectionImage: "/images/products/magic-under-sink-organizer-chaos.png",
    painSectionImageAlt: "خزانة تحت المغسلة مزدحمة بزجاجات التنظيف والمواسير — فوضى يومية",
    painSectionAspect: "1024/819",
    solutionSectionImage: "/images/products/magic-under-sink-organizer-solution.png",
    solutionSectionImageAlt: "منظّمان رماديان تحت المغسلة — تخزين منظم حول المواسير",
    solutionSectionAspect: "765/572",
    lifestyleSectionImage: "/images/products/magic-under-sink-organizer-lifestyle.png",
    lifestyleSectionImageAlt: "منظّم رمادي تحت المغسلة — أدراج منزلقة وسهل التركيب",
    lifestyleSectionAspect: "768/619",
    beforeSectionImage: "/images/products/magic-under-sink-organizer-before.png",
    beforeSectionImageAlt: "خزانة تحت المغسلة مزدحمة — فوضى قبل استخدام المنظّم",
    beforeSectionAspect: "1024/819",
    afterSectionImage: "/images/products/magic-under-sink-organizer-after.png",
    afterSectionImageAlt: "منظّم رمادي تحت المغسلة — ترتيب ذكي يسهّل يومك",
    afterSectionAspect: "576/718",
    slidingDrawersSectionImage:
      "/images/products/magic-under-sink-organizer-sliding-drawers.png",
    slidingDrawersSectionImageAlt:
      "يد تسحب درج منظّم متقن تحت المغسلة — وصول سريع لأدوات التنظيف",
    slidingDrawersSectionAspect: "575/714",
    metalStructureSectionImage:
      "/images/products/magic-under-sink-organizer-countertop.png",
    metalStructureSectionImageAlt:
      "منظّم متقن على طاولة المطبخ — هيكل معدني متين يتحمل زجاجات ومنظفات",
    metalStructureSectionAspect: "575/769",
    stabilitySectionImage:
      "/images/products/magic-under-sink-organizer-stability.png",
    stabilitySectionImageAlt:
      "منظّم متقن ثابت تحت المغسلة — أدراج منزلقة ومواسير في الخلف",
    stabilitySectionAspect: "574/807",
    pipeFitSectionImage:
      "/images/products/magic-under-sink-organizer-pipe-fit.png",
    pipeFitSectionImageAlt:
      "منظّمان متقن تحت المغسلة — تصميم يستغل المساحة حول المواسير",
    pipeFitSectionAspect: "1024/931",
    shortPromise: "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا وراحة",
    heroAngle: "المساحة المخفية تحت المغسلة يمكن أن تكون أكثر مساحاتك ترتيبًا",
    problemStatement: "زجاجات التنظيف مكوّمة، والمواسير تحتل نصف المساحة. المنظّم السحري يحوّل هذه الفوضى إلى تخزين ذكي ومرتب.",
    benefits: [
      "يستغل المساحة العمودية تحت المغسلة",
      "يتجاوز المواسير بتصميم مرن",
      "يتحمل زجاجات ومنظفات المطبخ",
      "سهل التركيب والتخصيص",
      "مناسب للمطبخ والحمام",
    ],
    beforeLabel: "قبل: فوضى تحت المغسلة",
    afterLabel: "بعد متقن: ترتيب ذكي يسهّل يومك",
    howToUse: [
      "قس المساحة تحت مغسلتك",
      "ركّب الرفوف مع مراعاة موضع المواسير",
      "رتب زجاجاتك وأدوات التنظيف",
    ],
    crossSellSlugs: ["pull-out-cabinet-drawer", "pure-faucet-filter"],
    reviews: [
      {
        name: "هيا المطيري",
        city: "جدة",
        rating: 5,
        text: "كان تحت مغسلة المطبخ عندي فوضى كاملة، المنظّم غير كل شيء. تركيب بدون أدوات وممتاز جدًا.",
        photo: "/images/reviews/magic-under-sink-organizer/review-unboxing.png",
        photoAlt: "صورة من هيا — المنظّم بعد فتح الطرد",
        photoAspect: "768/1024",
      },
      {
        name: "خلود الشمري",
        city: "الرياض",
        rating: 5,
        text: "أخذته للمطبخ والحمام. أفضل منتج جربته للتنظيم.",
        photo: "/images/reviews/magic-under-sink-organizer/review-kitchen.png",
        photoAlt: "صورة من خلود — المنظّم على رخام المطبخ",
        photoAspect: "236/315",
      },
      {
        name: "بشاير العجمي",
        city: "الخبر",
        rating: 5,
        text: "المواسير ما أثرت أبداً. المنظم يلف حول المواسير بسهولة. تصميم ذكي فعلاً.",
        photo: "/images/reviews/magic-under-sink-organizer/review-under-sink.png",
        photoAlt: "صورة من بشاير — المنظّم تحت المغسلة مع المواسير",
        photoAspect: "768/1024",
      },
      {
        name: "غادة النفيعي",
        city: "الدمام",
        rating: 5,
        text: "أخيراً تحت المغسلة صار مرتب ونظيف. كل شيء بمكانه.",
        photo: "/images/reviews/magic-under-sink-organizer/review-jars.png",
        photoAlt: "صورة من غادة — المنظّم مرتب بمرطبانات وأدوات",
        photoAspect: "236/420",
      },
      {
        name: "حصة الرشيدي",
        city: "بريدة",
        rating: 4,
        text: "جودة ممتازة والتركيب ما أخذ أكثر من 5 دقائق. أنصح فيه.",
        photo: "/images/reviews/magic-under-sink-organizer/review-counter.png",
        photoAlt: "صورة من حصة — المنظّم على سطح المطبخ",
        photoAspect: "576/1024",
      },
      {
        name: "فاطمة الجهني",
        city: "المدينة",
        rating: 5,
        text: "طلبت قطعتين للمطبخ والحمام. النتيجة فاقت توقعاتي بصراحة.",
        photo: "/images/reviews/magic-under-sink-organizer/review-received.png",
        photoAlt: "صورة من فاطمة — المنظّم بعد الاستلام",
        photoAspect: "1/1",
      },
    ],
    faqs: [
      { question: "هل يناسب وجود مواسير تحت المغسلة؟", answer: "نعم، صُمم ليعمل مع المواسير بتصميم مرن يتكيف مع المساحة." },
      { question: "هل يمكن استخدامه في الحمام؟", answer: "نعم، مثالي للحمام والمطبخ على حد سواء." },
      { question: "هل يتحمل علب التنظيف؟", answer: "نعم، مصنوع من مواد متينة تتحمل زجاجات التنظيف والعلب." },
      { question: "هل يحتاج تركيب؟", answer: "التركيب بسيط جدًا ولا يحتاج أدوات أو حفر." },
    ],
    seoTitle: "منظّم المغسلة السحري | متقن",
    seoDescription: "تصميم عملي يساعدك على استغلال مساحة المغسلة. اطلب الآن من متقن مع الدفع عند الاستلام.",
  },
  "pure-faucet-filter": {
    heroImageAlt: "فلتر الصنبور النقي مركب على صنبور المطبخ",
    heroSectionImage: "/images/products/pure-faucet-filter-hero.png",
    heroSectionImageAlt: "امرأة تغسل الخس بماء الفلتر من الصنبور — مياه أنقى للمطبخ",
    heroSectionAspect: "819/1024",
    painSectionImage: "/images/products/pure-faucet-filter-pain.png",
    painSectionImageAlt: "امرأة تفحص كوب ماء غير واضح من الصنبور — قلق من جودة الماء",
    painSectionAspect: "819/1024",
    solutionSectionImage: "/images/products/pure-faucet-filter-solution.png",
    solutionSectionImageAlt: "امرأة تملأ كوباً بماء الفلتر وتقدمه لطفلتها — تجربة ماء أنقى",
    solutionSectionAspect: "819/1024",
    lifestyleSectionImage: "/images/products/pure-faucet-filter-lifestyle.png",
    lifestyleSectionImageAlt: "فلتر الصنبور النقي على الصنبور — ماء نقي بتصميم أنيق",
    lifestyleSectionAspect: "819/1024",
    beforeSectionImage: "/images/products/pure-faucet-filter-before.png",
    beforeSectionImageAlt: "امرأة أمام صنبور بدون فلتر — ماء غير واضح من الصنبور",
    beforeSectionAspect: "1/1",
    afterSectionImage: "/images/products/pure-faucet-filter-after.png",
    afterSectionImageAlt: "فلتر على الصنبور — ماء نقي واضح بعد متقن",
    afterSectionAspect: "1/1",
    shortPromise: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري",
    heroAngle: "تجربة استخدام ماء الصنبور اليومية أكثر راحة وأناقة",
    problemStatement: "طعم ماء الصنبور ومظهره يؤثران على التجربة اليومية في المطبخ. الفلتر يساعد على تحسين تجربة استخدام الماء اليومية.",
    benefits: [
      "يساعد على تحسين تجربة استخدام ماء الصنبور",
      "تركيب سهل على معظم الصنابير",
      "تصميم أنيق يليق بمطبخ عصري",
      "يأتي بمحولات للصنابير المختلفة",
      "اقتصادي وعملي للاستخدام اليومي",
    ],
    beforeLabel: "قبل: صنبور عادي بدون فلتر",
    afterLabel: "بعد متقن: تجربة ماء أنيقة ومريحة",
    howToUse: [
      "اختر المحول المناسب لصنبورك من المجموعة المرفقة",
      "ثبّت الفلتر على الصنبور",
      "افتح الماء واستمتع بتجربة أفضل",
    ],
    crossSellSlugs: ["sink-organizer", "smart-table-warmer"],
    reviews: [
      {
        name: "أسماء العمري",
        city: "الرياض",
        rating: 5,
        text: "تركيب سهل جدًا وفرق واضح في شكل المطبخ. سعيدة بالشراء.",
        photo: "/images/reviews/pure-faucet-filter/review-installed.png",
        photoAlt: "صورة من أسماء — الفلتر مركب على صنبور المطبخ",
        photoAspect: "576/1024",
      },
      { name: "لطيفة الغامدي", city: "مكة", rating: 4, text: "المنتج مرتب وأنيق. التركيب أخذ دقيقتين فقط. ممتاز للمطبخ." },
      {
        name: "شوق الحازمي",
        city: "جدة",
        rating: 5,
        text: "الفلتر حسّن تجربة المطبخ بشكل ملحوظ. شكله أنيق على الصنبور.",
        photo: "/images/reviews/pure-faucet-filter/review-in-use.png",
        photoAlt: "صورة من شوق — الفلتر على الصنبور والماء يخرج نقياً",
        photoAspect: "771/1024",
      },
      {
        name: "نوال السويلم",
        city: "الخرج",
        rating: 5,
        text: "سهل التركيب وعملي جداً. صار المطبخ يبان أحلى مع الفلتر.",
        photo: "/images/reviews/pure-faucet-filter/review-received.png",
        photoAlt: "صورة من نوال — الفلتر بعد الاستلام",
        photoAspect: "768/1024",
      },
      { name: "عبير الخثلان", city: "الدمام", rating: 5, text: "أخذت قطعتين واحدة لي وواحدة هدية لأختي. كلنا راضيات." },
      {
        name: "مريم البقمي",
        city: "الطائف",
        rating: 4,
        text: "المحولات المرفقة ناسبت صنبوري تماماً. تركيب بدون أي مشاكل.",
        photo: "/images/reviews/pure-faucet-filter/review-unboxing.png",
        photoAlt: "صورة من مريم — محتويات الطرد والمحولات",
        photoAspect: "768/1024",
      },
    ],
    faqs: [
      { question: "هل يناسب كل الصنابير؟", answer: "يأتي بمجموعة من المحولات تناسب معظم أحجام الصنابير الشائعة. فريق التأكيد يساعد للتحقق قبل الشحن." },
      { question: "هل يأتي معه محولات؟", answer: "نعم، تأتي المجموعة بمحولات متعددة للصنابير المختلفة." },
      { question: "كيف يتم تركيبه؟", answer: "يُلوى على فوهة الصنبور بكل سهولة بدون أي أدوات." },
      { question: "هل الدفع عند الاستلام متاح؟", answer: "نعم، الدفع عند الاستلام متاح ومريح لجميع طلباتنا." },
    ],
    seoTitle: "فلتر الصنبور النقي | متقن",
    seoDescription: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري. اطلب الآن مع الدفع عند الاستلام.",
  },
  "smart-table-warmer": {
    heroImageAlt: "سخّان المائدة الذكي على طاولة عائلية",
    heroSectionImage: "/images/products/smart-table-warmer-hero.png",
    heroSectionImageAlt: "عائلة سعودية حول مائدة مع سخّان المائدة الذكي — طعام دافئ طوال الجلسة",
    heroSectionAspect: "1024/918",
    shortPromise: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة",
    heroAngle: "جلسة عائلية أدفأ مع طعام يحافظ على حرارته طوال الوقت",
    problemStatement: "الطعام يبرد خلال جلسات العائلة والضيوف الطويلة. سخّان المائدة يجعل كل وجبة مستعدة في أي وقت.",
    painSectionImage: "/images/products/smart-table-warmer-pain.png",
    painSectionImageAlt: "عائلة حول مائدة — الطعام بارد والمجهود يضيع",
    painSectionAspect: "822/1024",
    solutionSectionImage: "/images/products/smart-table-warmer-solution.png",
    solutionSectionImageAlt: "سخّان المائدة الذكي على مائدة — أطباق دافئة مع بخار",
    solutionSectionAspect: "1024/726",
    lifestyleSectionImage: "/images/products/smart-table-warmer-lifestyle.png",
    lifestyleSectionImageAlt: "سخّان المائدة الذكي في المطبخ — سهل التخزين والحمل",
    lifestyleSectionAspect: "819/1024",
    benefits: [
      "يحافظ على حرارة الطعام طوال الجلسة",
      "تصميم أنيق يناسب المائدة والضيافة",
      "آمن للاستخدام اليومي",
      "سهل التخزين والحمل",
      "مثالي للعائلة والضيوف",
    ],
    beforeLabel: "قبل: طعام بارد في منتصف الجلسة",
    beforeSectionImage: "/images/products/smart-table-warmer-before.png",
    beforeSectionImageAlt: "عائلة في المطبخ — إعادة تسخين الطعام في الميكروويف",
    beforeSectionAspect: "819/1024",
    afterLabel: "بعد متقن: طعام دافئ طوال الجلسة",
    afterSectionImage: "/images/products/smart-table-warmer-after.png",
    afterSectionImageAlt: "سخّان المائدة الذكي — أطباق دافئة مع بخار في المطبخ",
    afterSectionAspect: "819/1024",
    howToUse: [
      "ضع الطبق على السخّان",
      "اشغّل السخّان وانتظر لحظة",
      "استمتع بالطعام الدافئ طوال الجلسة",
    ],
    crossSellSlugs: ["pure-faucet-filter", "thermal-lunch-box"],
    reviews: [
      {
        name: "أم خالد",
        city: "الرياض",
        rating: 5,
        text: "مثالي للعزوم والعائلة. الطعام يبقى دافئ من بداية الجلسة للآخر. ممتاز ومريح جدًا.",
        photo: "/images/reviews/smart-table-warmer/review-unboxing.png",
        photoAlt: "صورة من أم خالد — السخّان بعد فتح الطرد",
        photoAspect: "1/1",
      },
      { name: "شيخة المري", city: "جدة", rating: 5, text: "أشكر متقن على هذا المنتج. جلساتنا العائلية صارت أجمل. الطعام يبقى كما هو." },
      {
        name: "مشاعل الدوسري",
        city: "الخبر",
        rating: 5,
        text: "العزايم صارت أحلى بكثير. الضيوف دائماً يسألون عنه.",
        photo: "/images/reviews/smart-table-warmer/review-in-use.png",
        photoAlt: "صورة من مشاعل — السخّان على المائدة",
        photoAspect: "400/300",
      },
      {
        name: "أم فيصل",
        city: "الرياض",
        rating: 5,
        text: "طلبت قطعتين وما ندمت. كل يوم نستخدمه في العشاء العائلي.",
        photo: "/images/reviews/smart-table-warmer/review-boxes.png",
        photoAlt: "صورة من أم فيصل — قطعتي السخّان بعد الاستلام",
        photoAspect: "443/590",
      },
      { name: "نورة الشثري", city: "القصيم", rating: 4, text: "تصميمه أنيق ويناسب السفرة. الطعام يبقى حار لفترة طويلة." },
      { name: "ريما الفهد", city: "المدينة", rating: 5, text: "هدية ممتازة لأي بيت سعودي. عملي وفخم ويستاهل كل ريال." },
    ],
    faqs: [
      { question: "هل يحافظ على حرارة الطعام؟", answer: "نعم، يعمل على الحفاظ على درجة الحرارة لفترات طويلة خلال الجلسة." },
      { question: "هل يناسب جلسات العائلة؟", answer: "نعم، صُمم خصيصًا للجلسات العائلية الطويلة والضيافة." },
      { question: "هل آمن للاستخدام؟", answer: "نعم، يعمل بمعايير السلامة المعتمدة. يُنصح بعدم ترك الأطفال الصغار دون مراقبة بالقرب منه." },
      { question: "كم مدة التوصيل؟", answer: "عادة 2-5 أيام عمل داخل المدن الرئيسية في المملكة." },
    ],
    seoTitle: "سخّان المائدة الذكي | متقن",
    seoDescription: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة. مثالي للعائلة والضيوف. اطلب الآن مع الدفع عند الاستلام.",
  },
  "thermal-lunch-box": {
    heroImageAlt: "حافظة الغداء الحرارية مع وجبة دافئة",
    heroSectionImage: "/images/products/thermal-lunch-box-hero.png?v=5",
    heroSectionImageAlt: "رجل سعودي في المكتب يتناول وجبة دافئة من حافظة الغداء الحرارية",
    heroSectionAspect: "665/801",
    painSectionImage: "/images/products/thermal-lunch-box-pain.png",
    painSectionImageAlt: "رجل في المكتب أمام وجبة باردة في علبة بلاستيك — إحباط من الأكل في الدوام",
    painSectionAspect: "819/1024",
    solutionSectionImage: "/images/products/thermal-lunch-box-solution.png",
    solutionSectionImageAlt: "رجل في المكتب يفتح حافظة الغداء الحرارية — بخار ووجبة دافئة",
    solutionSectionAspect: "819/1024",
    lifestyleSectionImage: "/images/products/thermal-lunch-box-lifestyle.png",
    lifestyleSectionImageAlt: "حافظة الغداء الحرارية في المكتب والدراسة والسفر والتخييم — تناسب نمط حياتك",
    lifestyleSectionAspect: "1/1",
    shortPromise: "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة",
    heroAngle: "وجبة دافئة معك أينما ذهبت في يومك",
    problemStatement: "الوجبة الباردة في العمل أو الدراسة تؤثر على يومك. الحافظة الحرارية تجعل وجبتك دافئة وجاهزة في أي وقت.",
    benefits: [
      "تحافظ على حرارة الوجبة لساعات",
      "خفيفة وسهلة الحمل",
      "مناسبة للعمل والدراسة والسفر",
      "سهلة التنظيف",
      "تصميم أنيق وعملي",
    ],
    beforeLabel: "قبل: وجبة باردة في العمل",
    beforeSectionImage: "/images/products/thermal-lunch-box-before.png?v=3",
    beforeSectionImageAlt: "رجل سعودي على الشرفة يمسك رأسه أمام وجبة باردة — قبل استخدام الحافظة",
    beforeSectionAspect: "819/1024",
    afterLabel: "بعد متقن: وجبة دافئة أينما كنت",
    afterSectionImage: "/images/products/thermal-lunch-box-after.png?v=3",
    afterSectionImageAlt: "رجل سعودي على الشرفة يتناول وجبة دافئة من حافظة الغداء الحرارية",
    afterSectionAspect: "819/1024",
    howToUse: [
      "ضع الوجبة الساخنة في الحافظة",
      "أغلقها جيدًا للحفاظ على الحرارة",
      "افتحها وقت الغداء واستمتع بوجبتك الدافئة",
    ],
    crossSellSlugs: ["smart-table-warmer", "powerful-cordless-vacuum"],
    reviews: [
      { name: "نادية الحمدان", city: "الدمام", rating: 5, text: "أفضل هدية أهديتها لنفسي. وجبتي تبقى دافئة من البيت للعمل. ممتازة وأنيقة." },
      { name: "رهف الصالح", city: "الرياض", rating: 4, text: "خفيفة ومريحة وتحافظ على الحرارة. أوصي فيها لكل من يأكل خارج البيت." },
      { name: "سمر الغامدي", city: "جدة", rating: 5, text: "زوجي يستخدمها يومياً للدوام. الأكل يوصل حار كأنه طازج." },
      { name: "لينا القحطاني", city: "الخبر", rating: 5, text: "أنيقة وعملية. الحجم مناسب ومريحة في الشنطة." },
      { name: "أمل الحارثي", city: "مكة", rating: 5, text: "أخذت وحدة لي ووحدة لبنتي في الجامعة. كلنا مبسوطات فيها." },
      { name: "روان المطيري", city: "تبوك", rating: 4, text: "تحافظ على الحرارة لساعات. جودة ممتازة والتوصيل كان سريع." },
    ],
    faqs: [
      { question: "هل تحافظ على الطعام دافئًا؟", answer: "نعم، تحافظ على الحرارة لعدة ساعات حسب الوجبة ودرجة الحرارة المحيطة." },
      { question: "هل تناسب الدوام والسفر؟", answer: "نعم، مناسبة للعمل والدراسة والسفر وأي يوم خارج البيت." },
      { question: "هل سهلة التنظيف؟", answer: "نعم، الداخل مصنوع من مواد سهلة التنظيف." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم، الدفع عند الاستلام متاح لجميع الطلبات." },
    ],
    seoTitle: "حافظة الغداء الحرارية | متقن",
    seoDescription: "تجربة عملية تمنحك وجبات دافئة أينما كنت. اطلب الآن من متقن مع الدفع عند الاستلام والتوصيل داخل السعودية.",
  },
  "beauty-vanity-cabinet": {
    heroImageAlt: "خزانة الجمال الفاخرة المضادة للغبار — متقن",
    heroSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-before-after.png",
      1,
    ),
    heroSectionImageAlt:
      "قبل وبعد تنظيم مستحضرات التجميل باستخدام خزانة الجمال الفاخرة المضادة للغبار",
    heroSectionAspect: "1024/759",
    shortPromise: "تنظيم أنيق يحافظ على مستحضراتك بأفضل صورة.",
    heroAngle: "زاوية جمال مرتبة ومحمية من الغبار",
    problemStatement: "مستحضراتك مبعثرة ومعرضة للغبار؟ خزانة الجمال الفاخرة تحافظ على كل شيء نظيفاً ومرتباً.",
    painSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-problem.png",
      1,
    ),
    painSectionImageAlt:
      "عميلة أمام مستحضرات تجميل مبعثرة على طاولة الزينة قبل تنظيمها",
    painSectionAspect: "1024/768",
    solutionSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-solution.png",
      1,
    ),
    solutionSectionImageAlt:
      "عميلة ترتب مستحضرات التجميل داخل خزانة الجمال الفاخرة المضادة للغبار",
    solutionSectionAspect: "1024/953",
    lifestyleSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-product.png",
      1,
    ),
    lifestyleSectionImageAlt:
      "خزانة الجمال الفاخرة مفتوحة ومنظمة بمستحضرات التجميل على طاولة الزينة",
    lifestyleSectionAspect: "1024/774",
    organizedShelvesSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-shelves.png",
      1,
    ),
    organizedShelvesSectionImageAlt:
      "تفاصيل أرفف خزانة الجمال الفاخرة وهي تنظم أحمر الشفاه والمستحضرات",
    organizedShelvesSectionAspect: "768/1024",
    dustproofDesignSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-dustproof.png",
      1,
    ),
    dustproofDesignSectionImageAlt:
      "خزانة الجمال الفاخرة بتصميم مغلق مضاد للغبار على طاولة الزينة",
    dustproofDesignSectionAspect: "1024/819",
    practicalSizeSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-practical-size.png",
      1,
    ),
    practicalSizeSectionImageAlt:
      "خزانة الجمال الفاخرة بحجم عملي على طاولة زينة أنيقة",
    practicalSizeSectionAspect: "1024/768",
    qualityMaterialsSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-quality-materials.png",
      1,
    ),
    qualityMaterialsSectionImageAlt:
      "درج خزانة الجمال الفاخرة بخامات شفافة متينة وتفاصيل أنيقة",
    qualityMaterialsSectionAspect: "1024/768",
    benefits: [
      "حماية من الغبار والرطوبة",
      "تصميم شفاف أنيق",
      "مساحة منظمة لكل مستحضر",
      "تناسب طاولة الزينة",
      "ضمان 30 يوم",
    ],
    beforeLabel: "قبل: مستحضرات مبعثرة ومعرضة للغبار",
    beforeSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-before.png",
      1,
    ),
    beforeSectionImageAlt:
      "مستحضرات تجميل مبعثرة على طاولة الزينة قبل استخدام خزانة الجمال الفاخرة",
    beforeSectionAspect: "1024/939",
    afterLabel: "بعد متقن: ترتيب فاخر ومحمي",
    afterSectionImage: withImageVersion(
      "/images/products/beauty-vanity-cabinet-after.png",
      1,
    ),
    afterSectionImageAlt:
      "خزانة الجمال الفاخرة بعد ترتيب مستحضرات التجميل على طاولة الزينة",
    afterSectionAspect: "1024/778",
    howToUse: [
      "رتّبي مستحضراتك على الأرفف",
      "أغلقي الخزانة للحماية من الغبار",
      "استمتعي بروتين أسرع وأكثر أناقة",
    ],
    crossSellSlugs: ["led-makeup-bag", "rotating-brush-organizer"],
    reviews: [
      {
        name: "نورة المطيري",
        city: "الرياض",
        rating: 5,
        dateLabel: "قبل 3 أسابيع",
        text: "والله ما توقعت تطلع بهالجودة كنت كل يوم أدور أغراضي وما ألاقي شي، الحين كل شي مرتب وقدامي. أكثر شي عجبني إنها مقفلة وتحمي المكياج من الغبار.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-01.png",
        photoAlt: "صورة مراجعة نورة لخزانة الجمال الفاخرة",
        photoAspect: "768/1024",
      },
      {
        name: "ريم الحربي",
        city: "جدة",
        rating: 5,
        dateLabel: "قبل شهر",
        text: "وصلتني أمس ورتبت كل أغراضي فيها على طول صراحة شكل التسريحة صار أفخم بكثير، وحتى زوجي سألني إذا غيرت الطاولة.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-02.png",
        photoAlt: "صورة مراجعة ريم لخزانة الجمال الفاخرة",
        photoAspect: "768/1024",
      },
      {
        name: "دانة القحطاني",
        city: "الدمام",
        rating: 5,
        dateLabel: "قبل شهر ونصف",
        text: "كنت أحسبها صغيرة، بس شالت أشياء أكثر من اللي توقعت. الأدراج مرة عملية والخامة مو رخيصة أبداً.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-03.png",
        photoAlt: "صورة مراجعة دانة لخزانة الجمال الفاخرة",
        photoAspect: "768/1024",
      },
      {
        name: "سارة الشهري",
        city: "الخبر",
        rating: 5,
        dateLabel: "قبل أسبوعين",
        text: "أكثر شي كنت أخاف منه يكون البلاستيك ضعيف، بس يوم وصلتني انصدمت من الجودة. صراحة تستاهل كل ريال.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-04.png",
        photoAlt: "صورة مراجعة سارة لخزانة الجمال الفاخرة",
        photoAspect: "576/1024",
      },
      {
        name: "جوهرة العنزي",
        city: "حائل",
        rating: 5,
        dateLabel: "قبل شهرين",
        text: "أنا عندي مشكلة الغبار دايم على المكياج، وهذي أكثر ميزة خلتني أطلبها. كل شي صار نظيف ومرتب.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-05.png",
        photoAlt: "صورة مراجعة جوهرة لخزانة الجمال الفاخرة",
        photoAspect: "768/1024",
      },
      {
        name: "هند العتيبي",
        city: "الرياض",
        rating: 5,
        dateLabel: "قبل شهر",
        text: "أقسم بالله إن شكل زاوية المكياج تغير 180 درجة حتى صرت أستمتع وأنا أرتب أغراضي، والخزانة شكلها فخم مرة.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-06.png",
        photoAlt: "صورة مراجعة هند لخزانة الجمال الفاخرة",
        photoAspect: "768/1024",
      },
      {
        name: "مشاعل الزهراني",
        city: "أبها",
        rating: 5,
        dateLabel: "قبل 20 يوم",
        text: "شريتها وأنا مترددة شوي، بس بعد ما وصلتني ندمت إني ما طلبتها من زمان مرررة مريحة وكل شي صار له مكان.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-07.png",
        photoAlt: "صورة مراجعة مشاعل لخزانة الجمال الفاخرة",
        photoAspect: "460/1024",
      },
      {
        name: "أريج الغامدي",
        city: "مكة",
        rating: 5,
        dateLabel: "قبل 6 أسابيع",
        text: "أنا من الناس اللي أحب كل شي يكون مرتب، والخزانة فعلاً فرقت معي. شكلها يعطي إحساس كأنها من براندات غالية.",
        photo: "/images/reviews/beauty-vanity-cabinet/review-08.png",
        photoAlt: "صورة مراجعة أريج لخزانة الجمال الفاخرة",
        photoAspect: "693/649",
      },
    ],
    faqs: [
      { question: "هل تحمي من الغبار؟", answer: "نعم، التصميم المغلق يحمي مستحضراتك من الغبار والرطوبة." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم، الدفع عند الاستلام متاح لجميع الطلبات." },
      { question: "كم مدة التوصيل؟", answer: "عادة 2-5 أيام عمل داخل المملكة." },
      { question: "هل يوجد ضمان؟", answer: "نعم، ضمان ذهبي 30 يوم للاستبدال أو الاسترجاع." },
    ],
    seoTitle: "خزانة الجمال الفاخرة المضادة للغبار | متقن",
    seoDescription: "تنظيم أنيق يحافظ على مستحضراتك بأفضل صورة. اطلبي الآن مع الدفع عند الاستلام وضمان 30 يوم.",
  },
  "led-makeup-bag": {
    heroImageAlt: "حقيبة المكياج الفاخرة بإضاءة LED — متقن",
    shortPromise: "إضاءة مثالية وأناقة ترافقك أينما كنت.",
    heroAngle: "مكياج دقيق بإضاءة احترافية في أي مكان",
    problemStatement: "الإضاءة الضعيفة تخرب مكياجك؟ حقيبة LED تمنحك إضاءة مثالية أينما كنت.",
    benefits: [
      "إضاءة LED مثالية للمكياج",
      "تصميم فاخر وخفيف",
      "مساحة منظمة داخلية",
      "سهلة الحمل والسفر",
      "ضمان 30 يوم",
    ],
    beforeLabel: "قبل: إضاءة ضعيفة ومكياج غير دقيق",
    afterLabel: "بعد متقن: إضاءة مثالية في أي مكان",
    howToUse: [
      "افتحي الحقيبة وشغّلي الإضاءة",
      "رتّبي أدواتك في التقسيمات الداخلية",
      "استمتعي بمكياج دقيق أينما كنت",
    ],
    crossSellSlugs: ["beauty-vanity-cabinet", "makeup-brush-cleaner"],
    reviews: [
      { name: "سارة العنزي", city: "جدة", rating: 5, text: "الإضاءة مثالية والتصميم فاخر. صارت أساسية في حقيبتي." },
      { name: "لمى الشمري", city: "الرياض", rating: 5, text: "جودة عالية وأناقة تستحق الثمن. أنصح فيها." },
      { name: "غادة السبيعي", city: "الخبر", rating: 4, text: "عملية للسفر والتعديلات السريعة. الإضاءة واضحة جداً." },
    ],
    faqs: [
      { question: "هل الإضاءة مناسبة للمكياج؟", answer: "نعم، إضاءة LED مصممة لتوزيع متساوٍ على الوجه." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم، الدفع عند الاستلام متاح." },
      { question: "كم مدة التوصيل؟", answer: "2-5 أيام عمل داخل المملكة." },
      { question: "هل يوجد ضمان؟", answer: "نعم، ضمان 30 يوم." },
    ],
    seoTitle: "حقيبة المكياج الفاخرة بإضاءة LED | متقن",
    seoDescription: "إضاءة مثالية وأناقة ترافقك أينما كنت. اطلبي الآن مع الدفع عند الاستلام.",
  },
  "makeup-brush-cleaner": {
    heroImageAlt: "جهاز تنظيف فرش المكياج الذكي — متقن",
    shortPromise: "تنظيف وتجفيف سريع لفرش أكثر نظافة وعناية.",
    heroAngle: "فرش نظيفة في دقائق — بدون مجهود",
    problemStatement: "فرش متسخة تؤثر على بشرتك؟ الجهاز الذكي ينظف ويجفّف بسرعة.",
    benefits: [
      "تنظيف عميق سريع",
      "تجفيف تلقائي",
      "مناسب لمعظم الفرش",
      "سهل الاستخدام",
      "ضمان 30 يوم",
    ],
    beforeLabel: "قبل: فرش متسخة وتنظيف يدوي متعب",
    afterLabel: "بعد متقن: فرش نظيفة في دقائق",
    howToUse: [
      "ضعي الفرشة في الجهاز",
      "أضيفي محلول التنظيف",
      "شغّلي الجهاز وانتظري التجفيف",
    ],
    crossSellSlugs: ["rotating-brush-organizer", "beauty-vanity-cabinet"],
    reviews: [
      { name: "هنوف الشهري", city: "الدمام", rating: 5, text: "وفّر علي وقت كثير. فرشي أنظف وأنعم من قبل." },
      { name: "مها الدوسري", city: "الرياض", rating: 5, text: "سهل الاستخدام ونتائج ممتازة. أنصح فيه." },
      { name: "عبير الزهراني", city: "جدة", rating: 5, text: "فرش نظيفة = بشرة أحسن. منتج يستحق." },
    ],
    faqs: [
      { question: "هل يناسب كل الفرش؟", answer: "نعم، مناسب لمعظم أحجام فرش المكياج." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم." },
      { question: "كم مدة التوصيل؟", answer: "2-5 أيام عمل." },
      { question: "هل يوجد ضمان؟", answer: "نعم، 30 يوم." },
    ],
    seoTitle: "جهاز تنظيف فرش المكياج الذكي | متقن",
    seoDescription: "تنظيف وتجفيف سريع لفرش أكثر نظافة وعناية. اطلبي مع الدفع عند الاستلام.",
  },
  "rotating-brush-organizer": {
    heroImageAlt: "منظم الفرش الدوار الفاخر — متقن",
    shortPromise: "ترتيب أنيق يحافظ على فرشك بعيداً عن الغبار.",
    heroAngle: "فرش مرتبة ومحمية — بلمسة فاخرة",
    problemStatement: "فرش مبعثرة على الطاولة؟ المنظم الدوار يحافظ على كل شيء مرتباً ونظيفاً.",
    benefits: [
      "تصميم دوار عملي",
      "حماية من الغبار",
      "سهل الوصول لكل فرشة",
      "مظهر أنيق على الطاولة",
      "ضمان 30 يوم",
    ],
    beforeLabel: "قبل: فرش مبعثرة ومعرضة للغبار",
    afterLabel: "بعد متقن: ترتيب دوار أنيق",
    howToUse: [
      "ضعي كل فرشة في فتحتها",
      "دوّري المنظم للوصول السريع",
      "احفظي فرشك نظيفة ومرتبة",
    ],
    crossSellSlugs: ["makeup-brush-cleaner", "led-makeup-bag"],
    reviews: [
      { name: "فاطمة العتيبي", city: "الرياض", rating: 5, text: "أنيق وعملي. فرشي مرتبة ومحمية من الغبار." },
      { name: "شهد الغامدي", city: "جدة", rating: 5, text: "التصميم الدوار رائع — وصول سريع لأي فرشة." },
      { name: "نوف المالكي", city: "الدمام", rating: 5, text: "يليق بزاوية جمالي. جودة ممتازة." },
    ],
    faqs: [
      { question: "هل يناسب فرش كبيرة؟", answer: "نعم، فتحات متعددة تتسع لمعظم الأحجام." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم." },
      { question: "كم مدة التوصيل؟", answer: "2-5 أيام عمل." },
      { question: "هل يوجد ضمان؟", answer: "نعم، 30 يوم." },
    ],
    seoTitle: "منظم الفرش الدوار الفاخر | متقن",
    seoDescription: "ترتيب أنيق يحافظ على فرشك بعيداً عن الغبار. اطلبي مع الدفع عند الاستلام.",
  },
  "vitamin-c-booster": {
    heroImageAlt: "بوستر فيتامين سي ونياسيناميد ضد البقع والبهتان — متقن",
    shortPromise: "كريم معزّز — حمض الأسكوربيك ونياسيناميد ضد البقع والبهتان.",
    heroAngle: "إشراقة تبدأ من خطوة واحدة واضحة",
    problemStatement: "بقع داكنة وبهتان رغم الروتين؟ بشرتك تحتاج بوستر فيتامين C مركّزاً.",
    heroSectionImage: withImageVersion(
      "/images/products/vitamin-c-booster-before-after.png",
      1,
    ),
    heroSectionImageAlt: "قبل وبعد — بوستر فيتامين سي ضد البقع والبهتان",
    painSectionImage: withImageVersion(
      "/images/products/vitamin-c-booster-model.png",
      1,
    ),
    painSectionImageAlt: "امرأة تلمس وجهها — بقع وبهتان قبل العلاج",
    solutionSectionImage: withImageVersion(
      "/images/products/vitamin-c-booster-studio.png",
      1,
    ),
    solutionSectionImageAlt: "بوستر فيتامين سي Arencia — تركيبة معزّزة على رخام",
    benefits: ["إشراقة طبيعية", "مظهر موحّد", "ملمس خفيف", "روتين بسيط"],
    beforeLabel: "قبل",
    afterLabel: "بعد",
    howToUse: ["نظّفي البشرة", "طبقة رقيقة", "دلّكي بلطف", "مرطب وواقي شمس"],
    crossSellSlugs: ["ceramide-booster", "pdrn-booster"],
    reviews: [
      { name: "نورة المطيري", city: "الرياض", rating: 5, text: "بشرتي صارت أنعم وأكثر إشراقة. أحب البساطة." },
      { name: "ريم الحربي", city: "جدة", rating: 5, text: "ملمس خفيف ونتيجة واضحة مع الاستمرار." },
      { name: "دانة القحطاني", city: "الدمام", rating: 5, text: "أخيراً منتج يعطي إحساساً بالثقة في المرآة." },
    ],
    faqs: [
      { question: "هل يناسب البشرة الحساسة؟", answer: "نعم، التركيبة خفيفة ومناسبة لمعظم أنواع البشرة." },
      { question: "متى أستخدمه؟", answer: "صباحاً قبل المرطب وواقي الشمس." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم." },
      { question: "هل يوجد ضمان؟", answer: "نعم، 30 يوم." },
    ],
    seoTitle: "بوستر فيتامين سي ونياسيناميد ضد البقع | متقن",
    seoDescription: "بوستر فيتامين سي ونياسيناميد — كريم معزّز ضد البقع والبهتان. عناية كورية مع الدفع عند الاستلام.",
  },
  "ceramide-booster": {
    heroImageAlt: "بوستر السنتيلا والسيراميد ضد الحبوب — متقن",
    shortPromise: "كريم معزّز — سنتيلا وسيراميد ضد الحبوب وجلد الدجاجة.",
    heroAngle: "راحة البشرة تبدأ من إصلاح الحاجز",
    problemStatement: "حبوب وجلد دجاجة رغم المرطب؟ بشرتك تحتاج بوستر تهدئة وإصلاحاً مركّزاً.",
    heroSectionImage: withImageVersion(
      "/images/products/ceramide-booster-before-after.png",
      1,
    ),
    heroSectionImageAlt: "قبل وبعد — بوستر السنتيلا والسيراميد ضد الحبوب",
    painSectionImage: withImageVersion(
      "/images/products/ceramide-booster-model.png",
      1,
    ),
    painSectionImageAlt: "امرأة تعاني من حبوب وحمرار — قبل استخدام البوستر",
    solutionSectionImage: withImageVersion(
      "/images/products/ceramide-booster-studio.png",
      1,
    ),
    solutionSectionImageAlt: "بوستر السنتيلا والسيراميد Arencia — تركيبة معزّزة على رخام",
    benefits: ["حاجز أقوى", "ترطيب يدوم", "بشرة هادئة", "ملمس ناعم"],
    beforeLabel: "قبل",
    afterLabel: "بعد",
    howToUse: ["نظّفي مساءً", "طبقة رقيقة", "دلّكي بلطف", "مرطب ليلي"],
    crossSellSlugs: ["vitamin-c-booster", "pdrn-booster"],
    reviews: [
      { name: "سارة الشهري", city: "الخبر", rating: 5, text: "بشرتي الحساسة أخيراً مرتاحة. فرق واضح." },
      { name: "هند العتيبي", city: "الرياض", rating: 5, text: "ترطيب حقيقي بدون ثقل. أحببت التجربة." },
      { name: "مشاعل الزهراني", city: "أبها", rating: 5, text: "هادئ وراقي — يشعرك أن بشرتك في أمان." },
    ],
    faqs: [
      { question: "هل للبشرة الجافة؟", answer: "نعم، مثالي لإصلاح الحاجز والترطيب العميق." },
      { question: "متى أستخدمه؟", answer: "مساءً قبل المرطب الليلي." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم." },
      { question: "هل يوجد ضمان؟", answer: "نعم، 30 يوم." },
    ],
    seoTitle: "بوستر السنتيلا والسيراميد ضد الحبوب | متقن",
    seoDescription: "بوستر سنتيلا وسيراميد — كريم معزّز ضد الحبوب وجلد الدجاجة. عناية كورية للبشرة الحساسة.",
  },
  "pdrn-booster": {
    heroImageAlt: "بوستر PDRN والببتيدات ضد التجاعيد — متقن",
    shortPromise: "كريم معزّز — PDRN وببتيدات ضد التجاعيد والخطوط الدقيقة.",
    heroAngle: "شباب البشرة يبدأ من عناية مركّزة",
    problemStatement: "تجاعيد وخطوط دقيقة؟ بشرتك تحتاج بوستر يعيد المرونة والشد.",
    heroSectionImage: withImageVersion(
      "/images/products/pdrn-booster-before-after.png",
      1,
    ),
    heroSectionImageAlt: "قبل وبعد — بوستر PDRN والببتيدات ضد التجاعيد",
    painSectionImage: withImageVersion(
      "/images/products/pdrn-booster-model.png",
      1,
    ),
    painSectionImageAlt: "امرأة تظهر علامات التجاعيد — قبل استخدام البوستر",
    benefits: ["مرونة أعلى", "خطوط أقل وضوحاً", "حيوية تعود", "ثقة في كل عمر"],
    beforeLabel: "قبل",
    afterLabel: "بعد",
    howToUse: ["نظّفي البشرة", "طبقة رقيقة", "دلّكي صاعداً", "مرطب وواقي شمس"],
    crossSellSlugs: ["vitamin-c-booster", "ceramide-booster"],
    reviews: [
      { name: "أريج الغامدي", city: "مكة", rating: 5, text: "ملمس أنعم وإحساس بالشباب يعود تدريجياً." },
      { name: "جوهرة العنزي", city: "حائل", rating: 5, text: "منتج راقي — النتيجة هادئة ومقنعة." },
      { name: "فاطمة السبيعي", city: "الرياض", rating: 5, text: "أحب أنه بسيط وفعّال في نفس الوقت." },
    ],
    faqs: [
      { question: "من أي عمر؟", answer: "مناسب لمن تلاحظ فقدان المرونة أو ظهور خطوط دقيقة." },
      { question: "كم مرة أستخدمه؟", answer: "مرة أو مرتين يومياً حسب روتينك." },
      { question: "هل الدفع عند الاستلام؟", answer: "نعم." },
      { question: "هل يوجد ضمان؟", answer: "نعم، 30 يوم." },
    ],
    seoTitle: "بوستر PDRN والببتيدات ضد التجاعيد | متقن",
    seoDescription: "بوستر PDRN وببتيدات — كريم معزّز ضد التجاعيد والخطوط الدقيقة. عناية كورية للشباب.",
  },
};
