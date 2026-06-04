/** Stable per-slug review count for PDP social proof (100–300). */
export function getProductReviewDisplayCount(slug: string): number {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 100 + (hash % 201);
}
