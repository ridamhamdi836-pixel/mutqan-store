/** Full image visible inside frame — no crop */
export const STORE_IMAGE_CONTAIN_CLASS =
  "object-contain object-center w-full h-full" as const;

/** Edge-to-edge crop fill (use only when explicitly requested) */
export const STORE_IMAGE_COVER_CLASS =
  "object-cover object-center w-full h-full" as const;

/** Request native resolution on retina / large screens (Next Image `sizes`) */
export const STORE_IMAGE_SIZES = {
  hero: "(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 2560px",
  section: "(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 1920px",
  card: "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 1200px",
  thumbnail: "320px",
  tiny: "160px",
} as const;

/** Minimum frame heights so large portraits are not squeezed on mobile */
export const STORE_IMAGE_FRAME = {
  cardMinHeight: "min-h-[220px] sm:min-h-[260px]",
  heroMinHeight: "min-h-[280px] sm:min-h-[360px] md:min-h-0",
} as const;
