/** Edge-to-edge fill: centered crop, no letterboxing */
export const STORE_IMAGE_FILL_CLASS =
  "object-cover object-center w-full h-full" as const;

/** Request sharp output on retina / large screens (Next Image `sizes`) */
export const STORE_IMAGE_SIZES = {
  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px",
  section: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px",
  card: "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 600px",
  thumbnail: "160px",
  tiny: "80px",
} as const;
