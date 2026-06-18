/** Intrinsic layout — frame matches image pixels, no stretch */
export const STORE_IMAGE_INTRINSIC_CLASS =
  "w-full h-auto max-w-full block" as const;

/** Full image inside a fixed-ratio box (fallback when dimensions unknown) */
export const STORE_IMAGE_CONTAIN_CLASS =
  "object-contain object-center w-full h-full" as const;

export const STORE_IMAGE_COVER_CLASS =
  "object-cover object-center w-full h-full" as const;

export const STORE_IMAGE_SIZES = {
  hero: "100vw",
  section: "100vw",
  card: "(max-width: 1280px) 100vw, 1200px",
  thumbnail: "480px",
  tiny: "240px",
} as const;

/** Card thumbnails only — heroes/sections use intrinsic or config aspect */
export const STORE_IMAGE_FRAME = {
  cardMinHeight: "min-h-[220px] sm:min-h-[260px]",
} as const;

/** Known source dimensions — frame follows natural aspect (no letterboxing) */
export const STORE_IMAGE_INTRINSIC: Record<
  string,
  { width: number; height: number }
> = {
  "/images/hero/saudi-family.png": { width: 1024, height: 950 },
  "/images/hero/beauty-vanity-hero.png": { width: 1024, height: 819 },
  "/images/hero/beauty-lifestyle.png": { width: 1024, height: 682 },
  "/images/products/beauty-vanity-cabinet.png": { width: 1024, height: 1024 },
  "/images/products/beauty-vanity-cabinet-before.png": {
    width: 1024,
    height: 939,
  },
  "/images/products/beauty-vanity-cabinet-before-after.png": {
    width: 1024,
    height: 759,
  },
  "/images/products/beauty-vanity-cabinet-after.png": {
    width: 1024,
    height: 778,
  },
  "/images/products/beauty-vanity-cabinet-problem.png": {
    width: 1024,
    height: 768,
  },
  "/images/products/beauty-vanity-cabinet-solution.png": {
    width: 1024,
    height: 953,
  },
  "/images/products/led-makeup-bag.png": { width: 1024, height: 1024 },
  "/images/products/makeup-brush-cleaner.png": { width: 1024, height: 1024 },
  "/images/products/rotating-brush-organizer.png": { width: 1024, height: 1024 },
  "/images/products/smart-stackable-cabinet-couple-hero.png": {
    width: 884,
    height: 1015,
  },
  "/images/products/smart-stackable-cabinet-chaos.png": {
    width: 1024,
    height: 682,
  },
  "/images/products/smart-stackable-cabinet-assembly.png": {
    width: 960,
    height: 1023,
  },
  "/images/products/smart-stackable-cabinet-woman.png": {
    width: 960,
    height: 1007,
  },
  "/images/products/smart-stackable-cabinet-laundry-sink.png": {
    width: 898,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-laundry-mess.png": {
    width: 717,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-no-tools-assembly.png": {
    width: 778,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-stackable-design.png": {
    width: 825,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-elegant-design.png": {
    width: 903,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-durable-structure.png": {
    width: 637,
    height: 1024,
  },
  "/images/products/smart-stackable-cabinet-dimensions.png": {
    width: 1024,
    height: 682,
  },
  "/images/products/magic-under-sink-organizer-sliding-drawers.png": {
    width: 575,
    height: 714,
  },
  "/images/products/magic-under-sink-organizer-countertop.png": {
    width: 575,
    height: 769,
  },
  "/images/products/magic-under-sink-organizer-stability.png": {
    width: 574,
    height: 807,
  },
  "/images/products/magic-under-sink-organizer-pipe-fit.png": {
    width: 1024,
    height: 931,
  },
};

export function stripImagePath(src: string): string {
  return src.split("?")[0];
}

/** Same asset URL on every device; bump version when replacing a file. */
export function withImageVersion(src: string, version: number): string {
  return `${stripImagePath(src)}?v=${version}`;
}

export function getImageIntrinsic(
  src: string,
): { width: number; height: number } | null {
  return STORE_IMAGE_INTRINSIC[stripImagePath(src)] ?? null;
}

export function storeImageAspectStyle(
  aspect?: string,
): { aspectRatio: string } | undefined {
  if (!aspect) return undefined;
  return {
    aspectRatio: aspect.includes("/") ? aspect.replace("/", " / ") : aspect,
  };
}

export function aspectFromDimensions(width: number, height: number): string {
  return `${width}/${height}`;
}
