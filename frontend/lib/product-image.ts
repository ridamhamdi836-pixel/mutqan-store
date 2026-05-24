const IMAGE_VERSION: Record<string, number> = {
  "magic-under-sink-organizer": 3,
};

export function getProductImageSrc(slug: string): string {
  const version = IMAGE_VERSION[slug] ?? 2;
  return `/images/products/${slug}.jpg?v=${version}`;
}
