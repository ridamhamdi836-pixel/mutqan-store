export type SkincareNamaIngredient = {
  title: string;
  dose: string;
  desc: string;
  highlight: string;
};

export type SkincareNamaProblemPair = {
  problem: string;
  solution: string;
};

export type SkincareNamaAlternative = {
  title: string;
  priceRange: string;
  cons: string[];
};

export type SkincareNamaLongReview = {
  name: string;
  age: string;
  city: string;
  text: string;
  rating: number;
};

export type SkincareNamaTimelineStep = {
  period: string;
  title: string;
  desc: string;
};

export type SkincareNamaHeroStat = {
  value: string;
  label: string;
};

export type SkincareNamaPageConfig = {
  hero: {
    headline: string;
    subheadline: string;
    urgencyLine?: string;
    imageBadges: string[];
    quickStats: SkincareNamaHeroStat[];
  };
  problemSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    statValue: string;
    statText: string;
    statSource: string;
  };
  problemPairs: SkincareNamaProblemPair[];
  ingredients: {
    title: string;
    subtitle: string;
    items: SkincareNamaIngredient[];
    freeFrom: string[];
  };
  authority: {
    title: string;
    subtitle: string;
    trustPills: string[];
    stats: Array<{ value: string; label: string }>;
    expertQuote: string;
    expertTitle: string;
  };
  timeline: {
    badge: string;
    title: string;
    subtitle: string;
    steps: SkincareNamaTimelineStep[];
    footerNote: string;
  };
  longReviews: {
    title: string;
    subtitle: string;
    items: SkincareNamaLongReview[];
  };
  comparison: {
    title: string;
    subtitle: string;
    alternatives: SkincareNamaAlternative[];
    mutqanBar: string[];
  };
  guarantee: {
    badge: string;
    title: string;
    copy: string;
    steps: Array<{ title: string; desc: string }>;
  };
  routine: {
    title: string;
    subtitle: string;
    items: Array<{ title: string; desc: string }>;
  };
  usageStats: Array<{ value: string; label: string }>;
  orderSteps: {
    title: string;
    subtitle: string;
    steps: Array<{ n: number; title: string; desc: string }>;
  };
  shipping: {
    title: string;
    cities: string[];
    note: string;
  };
  faqTitle: string;
  crossSellTitle: string;
  crossSellSubtitle: string;
  stickyCtaVerb: string;
};
