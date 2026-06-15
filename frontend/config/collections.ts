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
];

export const getCollectionBySlug = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);
