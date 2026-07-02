import { StoreImageFrame } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES, withImageVersion } from "@/lib/image-display";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";

const HERO_IMAGE = withImageVersion("/images/hero/skincare-hero.png", 2);

export function HeroProductShowcase() {
  const { hero } = HOMEPAGE_BEAUTY;

  return (
    <StoreImageFrame
      src={HERO_IMAGE}
      alt={hero.imageAlt}
      variant="hero"
      priority
      sizes={STORE_IMAGE_SIZES.hero}
      className="rounded-xl bg-transparent"
      imageClassName="rounded-xl"
    />
  );
}
