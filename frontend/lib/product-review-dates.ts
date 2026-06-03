/** Deterministic review dates for PDP social proof */
const REVIEW_DATE_LABELS = [
  "منذ 5 أيام",
  "منذ أسبوع",
  "منذ أسبوعين",
  "منذ 3 أسابيع",
  "منذ شهر",
  "منذ شهر ونصف",
] as const;

export function reviewDateLabel(slug: string, index: number): string {
  const seed =
    slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + index * 7;
  return REVIEW_DATE_LABELS[seed % REVIEW_DATE_LABELS.length];
}
