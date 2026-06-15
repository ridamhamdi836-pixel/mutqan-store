import { PRODUCTS_CONFIG } from "@/config/products";

type ImageSlot = {
  src?: string;
  alt?: string;
  aspect?: string;
};

type ProductVisualConfig = (typeof PRODUCTS_CONFIG)[string];

function slot(
  src?: string,
  alt?: string,
  aspect?: string,
): ImageSlot {
  if (!src) return {};
  return { src, alt, aspect };
}

/** Maps «لماذا يعمل فعلاً؟» cards to product images */
export function getWhyItWorksImage(
  slug: string,
  index: number,
  config: ProductVisualConfig,
): ImageSlot {
  if (slug === "sink-organizer") {
    const slots: ImageSlot[] = [
      slot(
        config.metalStructureSectionImage,
        config.metalStructureSectionImageAlt,
        config.metalStructureSectionAspect,
      ),
      slot(
        config.slidingDrawersSectionImage,
        config.slidingDrawersSectionImageAlt,
        config.slidingDrawersSectionAspect,
      ),
      slot(
        config.pipeFitSectionImage,
        config.pipeFitSectionImageAlt,
        config.pipeFitSectionAspect,
      ),
      slot(
        config.stabilitySectionImage,
        config.stabilitySectionImageAlt,
        config.stabilitySectionAspect,
      ),
    ];
    return slots[index] ?? {};
  }

  if (slug === "storage") {
    const slots: ImageSlot[] = [
      slot(
        config.stackableDesignSectionImage,
        config.stackableDesignSectionImageAlt,
        config.stackableDesignSectionAspect,
      ),
      slot(
        config.noToolsAssemblySectionImage,
        config.noToolsAssemblySectionImageAlt,
        config.noToolsAssemblySectionAspect,
      ),
      slot(
        config.durableStructureSectionImage,
        config.durableStructureSectionImageAlt,
        config.durableStructureSectionAspect,
      ),
      slot(
        config.elegantDesignSectionImage,
        config.elegantDesignSectionImageAlt,
        config.elegantDesignSectionAspect,
      ),
    ];
    return slots[index] ?? {};
  }

  const pool: ImageSlot[] = [
    slot(
      config.solutionSectionImage,
      config.solutionSectionImageAlt,
      config.solutionSectionAspect,
    ),
    slot(
      config.lifestyleSectionImage,
      config.lifestyleSectionImageAlt,
      config.lifestyleSectionAspect,
    ),
    slot(
      config.afterSectionImage,
      config.afterSectionImageAlt,
      config.afterSectionAspect,
    ),
    slot(
      config.beforeSectionImage,
      config.beforeSectionImageAlt,
      config.beforeSectionAspect,
    ),
  ].filter((s) => s.src);

  return pool[index % pool.length] ?? {};
}
