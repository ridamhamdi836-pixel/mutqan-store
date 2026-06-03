/** Full image visible inside frame — no crop */
export const STORE_IMAGE_CONTAIN_CLASS =
  "object-contain object-center w-full h-full" as const;

/** Edge-to-edge crop fill (use only when explicitly requested) */
export const STORE_IMAGE_COVER_CLASS =
  "object-cover object-center w-full h-full" as const;

/** Full viewport width — no downscale hint on mobile/tablet/desktop */
export const STORE_IMAGE_SIZES = {
  hero: "100vw",
  section: "100vw",
  card: "(max-width: 1280px) 100vw, 1200px",
  thumbnail: "480px",
  tiny: "240px",
} as const;

/** Tall frames so large/portrait photos are not squeezed (mobile + desktop) */
export const STORE_IMAGE_FRAME = {
  cardMinHeight: "min-h-[280px] sm:min-h-[340px] lg:min-h-[380px]",
  heroMinHeight: "min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] xl:min-h-[560px]",
  sectionMinHeight: "min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] xl:min-h-[520px]",
  reviewMinHeight: "min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]",
} as const;

/** Apply config aspect ratio on section/hero frames */
export function storeImageAspectStyle(
  aspect?: string,
): { aspectRatio: string } | undefined {
  if (!aspect) return undefined;
  return { aspectRatio: aspect.includes("/") ? aspect.replace("/", " / ") : aspect };
}
