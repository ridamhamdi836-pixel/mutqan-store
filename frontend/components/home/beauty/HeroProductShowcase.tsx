import { StoreImageFrame } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";

export function HeroProductShowcase() {
  const { hero } = HOMEPAGE_BEAUTY;

  return (
    <StoreImageFrame
      src={hero.image}
      alt={hero.imageAlt}
      variant="hero"
      priority
      sizes={STORE_IMAGE_SIZES.hero}
      className="rounded-2xl bg-transparent"
      imageClassName="rounded-2xl w-full h-auto max-w-full block"
    />
  );
}
