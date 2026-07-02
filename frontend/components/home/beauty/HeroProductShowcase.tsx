import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES, withImageVersion } from "@/lib/image-display";

const HERO_PRODUCTS = [
  {
    src: withImageVersion("/images/products/vitamin-c-booster.png", 2),
    alt: "سيروم فيتامين سي — متقن",
    bg: "#EDE08A",
    scale: "scale-95 md:scale-100",
    z: "z-10",
  },
  {
    src: withImageVersion("/images/products/ceramide-booster.png", 2),
    alt: "سيروم السيراميد — متقن",
    bg: "#D4D8DE",
    scale: "scale-105 md:scale-110",
    z: "z-20",
  },
  {
    src: withImageVersion("/images/products/pdrn-booster.png", 2),
    alt: "سيروم PDRN — متقن",
    bg: "#F5B8C8",
    scale: "scale-95 md:scale-100",
    z: "z-10",
  },
] as const;

export function HeroProductShowcase() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-[#F3E8D8] via-white to-[#FAF3EA]">
      {/* Soft decorative rings — Nama style */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 42%, transparent 36%, rgba(26,71,49,0.07) 37%, transparent 38%), radial-gradient(circle at 50% 42%, transparent 52%, rgba(26,71,49,0.05) 53%, transparent 54%)",
        }}
      />

      <div className="absolute top-5 md:top-7 inset-x-0 text-center z-10 pointer-events-none">
        <p className="text-lg md:text-xl font-extrabold text-brand-forest tracking-tight">
          متقن
        </p>
        <p className="text-[9px] md:text-[10px] font-semibold tracking-[0.32em] text-brand-gold mt-0.5">
          KOREAN SKINCARE
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-14 md:top-16 flex items-end justify-center gap-1 sm:gap-2 md:gap-3 px-3 md:px-6 pb-6 md:pb-10">
        {HERO_PRODUCTS.map((product) => (
          <div
            key={product.alt}
            className={`relative w-[30%] max-w-[140px] aspect-[2/5] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(26,71,49,0.12)] ${product.z} ${product.scale}`}
            style={{ backgroundColor: product.bg }}
          >
            <StoreImage
              src={product.src}
              alt={product.alt}
              fill
              fit="contain"
              variant="default"
              sizes={STORE_IMAGE_SIZES.card}
              className="p-2 md:p-3"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}
