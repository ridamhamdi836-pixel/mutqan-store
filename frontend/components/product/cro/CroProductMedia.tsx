"use client";

import { StoreImageFrame } from "@/components/ui/StoreImage";
import { cn } from "@/lib/utils";
import {
  PRODUCT_SECTION_IMAGE_FRAME_CLASS,
  STORE_IMAGE_SIZES,
} from "@/lib/image-display";

type MediaProps = {
  src?: string;
  alt?: string;
  aspect?: string;
  placeholder: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function CroProductMedia({
  src,
  alt,
  aspect = "4/3",
  placeholder,
  priority,
  className,
  imageClassName,
}: MediaProps) {
  if (src) {
    return (
      <StoreImageFrame
        src={src}
        alt={alt ?? placeholder}
        aspect={aspect}
        className={cn(
          "rounded-2xl overflow-hidden shadow-md border border-brand-border",
          PRODUCT_SECTION_IMAGE_FRAME_CLASS,
          className,
        )}
        variant={priority ? "hero" : "default"}
        priority={priority}
        sizes={STORE_IMAGE_SIZES.section}
        imageClassName={imageClassName}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed border-brand-border/80 bg-gradient-to-b from-brand-beige/80 to-brand-surface flex items-center justify-center text-center px-4 shadow-sm",
        className,
      )}
      style={{ aspectRatio: aspect.replace("/", " / ") }}
    >
      <span className="text-xs sm:text-sm font-bold text-brand-muted leading-relaxed">
        {placeholder}
      </span>
    </div>
  );
}
