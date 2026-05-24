/** Per-product image filename under /public/images/products/ */
const PRODUCT_IMAGE_FILE: Record<string, string> = {
  "magic-under-sink-organizer": "magic-under-sink-organizer.png",
};

export function getProductImageSrc(slug: string): string {
  const file = PRODUCT_IMAGE_FILE[slug] ?? `${slug}.jpg`;
  return `/images/products/${file}`;
}
