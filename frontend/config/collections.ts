export const COLLECTIONS = [
  {
    slug: "home-organization",
    nameAr: "تنظيم المنزل",
    descriptionAr: "حلول عملية وأنيقة تحوّل مساحاتك من الفوضى إلى الترتيب بكل سهولة.",
    productSlugs: ["storage", "pull-out-cabinet-drawer", "sink-organizer"],
  },
  {
    slug: "modern-kitchen",
    nameAr: "المطبخ العصري",
    descriptionAr: "منتجات مختارة لمطبخ أكثر أناقة وعملية في استخدامه اليومي.",
    productSlugs: ["pure-faucet-filter", "sink-organizer", "pull-out-cabinet-drawer"],
  },
  {
    slug: "cleaning-care",
    nameAr: "العناية والنظافة",
    descriptionAr: "أدوات تنظيف سريعة وفعّالة لمنزل وسيارة تشعر بالنظافة دائمًا.",
    productSlugs: ["powerful-cordless-vacuum"],
  },
  {
    slug: "dining-hosting",
    nameAr: "جلسات وضيافة",
    descriptionAr: "حلول ضيافة تجعل كل جلسة عائلية أدفأ وأجمل.",
    productSlugs: ["smart-table-warmer", "thermal-lunch-box"],
  },
  {
    slug: "beauty-vanity",
    nameAr: "الجمال والعناية",
    descriptionAr: "مجموعة متقن المختارة بعناية لتنظيم مستحضراتك وإضاءة روتينك اليومي بأناقة.",
    productSlugs: [
      "beauty-vanity-cabinet",
      "led-makeup-bag",
      "makeup-brush-cleaner",
      "rotating-brush-organizer",
    ],
  },
  {
    slug: "makeup-tools",
    nameAr: "أدوات المكياج",
    descriptionAr: "حقائب مكياج، مرايا وإكسسوارات فاخرة لروتين أكثر أناقة أينما كنت.",
    productSlugs: ["led-makeup-bag"],
  },
  {
    slug: "beauty-organization",
    nameAr: "تنظيم الجمال",
    descriptionAr: "منظمات وخزائن vanity أنيقة تحافظ على مستحضراتك مرتبة ومحمية.",
    productSlugs: ["beauty-vanity-cabinet", "rotating-brush-organizer"],
  },
  {
    slug: "brush-care",
    nameAr: "العناية بالفرش",
    descriptionAr: "أجهزة تنظيف ومنظمات فرش لعناية أعمق ببشرتك وروتينك اليومي.",
    productSlugs: ["makeup-brush-cleaner", "rotating-brush-organizer"],
  },
];

export const getCollectionBySlug = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);
