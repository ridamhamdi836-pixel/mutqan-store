export type ValueJustificationIcon =
  | "home"
  | "layers"
  | "scan"
  | "shield"
  | "sparkles"
  | "zap"
  | "car"
  | "clock"
  | "flame"
  | "droplets"
  | "utensils";

export type CroValueCard = {
  icon: ValueJustificationIcon;
  tag: string;
  headline: string;
  support: string;
  stat?: string;
  featured?: boolean;
  accent?: boolean;
};

export type CroProductPageConfig = {
  hero: {
    headline: string;
    subheadline: string;
    bullets: string[];
  };
  trustBadges: Array<{ label: string }>;
  beforeAfter: {
    title: string;
    subtitle: string;
  };
  problem: {
    title: string;
    copy: string;
  };
  solution: {
    title: string;
    copy: string;
  };
  highlight: {
    title: string;
    copy: string;
    placeholder: string;
  };
  benefits: {
    title: string;
    items: Array<{ title: string; desc: string }>;
  };
  whyItWorks: {
    title: string;
    items: Array<{ title: string; desc: string; placeholder: string }>;
  };
  features: {
    title: string;
    items: string[];
  };
  /** Optional product dimensions block (image + copy) — storage cabinet only */
  dimensionsSection?: {
    title: string;
    subtitle: string;
    bullets: string[];
  };
  valueJustification: {
    eyebrow: string;
    title: string;
    summary: string;
    footerLine: string;
    footerSubline?: string;
    featuredStatLabel?: string;
    cards: CroValueCard[];
  };
  offer: {
    title: string;
    subtitle: string;
  };
  reviews: {
    title: string;
    subtitle: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    rows: Array<{ label: string; us: boolean; alternative: boolean }>;
  };
  orderProcess: {
    title: string;
    steps: Array<{ n: number; title: string; desc: string }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
  };
};
