import Image, { type ImageProps } from "next/image";
import {
  STORE_IMAGE_CONTAIN_CLASS,
  STORE_IMAGE_COVER_CLASS,
  STORE_IMAGE_INTRINSIC_CLASS,
  getImageIntrinsic,
  storeImageAspectStyle,
  stripImagePath,
} from "@/lib/image-display";
import { cn } from "@/lib/utils";

export function stripImageQuery(src: string): string {
  return src.split("?")[0];
}

type StoreImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
  variant?: "default" | "thumbnail" | "hero";
  fit?: "contain" | "cover";
};

function defaultQuality(): number {
  return 100;
}

/**
 * Store images at full quality. With width+height (no fill) the frame matches
 * the photo's natural aspect — nothing stretched or cropped.
 */
export function StoreImage({
  quality,
  loading,
  src,
  className,
  unoptimized: unoptimizedProp,
  variant = "default",
  fit = "contain",
  priority,
  fetchPriority,
  fill,
  width,
  height,
  ...props
}: StoreImageProps) {
  const normalizedSrc =
    typeof src === "string" ? stripImageQuery(src) : src;

  const intrinsic =
    typeof normalizedSrc === "string"
      ? getImageIntrinsic(normalizedSrc)
      : null;

  const useFill = fill === true;
  const resolvedWidth = width ?? intrinsic?.width;
  const resolvedHeight = height ?? intrinsic?.height;
  const useIntrinsic = !useFill && resolvedWidth && resolvedHeight;

  const resolvedQuality = quality ?? defaultQuality();
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : variant === "thumbnail" ? "low" : "auto");

  return (
    <Image
      src={normalizedSrc}
      quality={resolvedQuality}
      unoptimized={unoptimizedProp ?? true}
      priority={priority}
      fetchPriority={resolvedFetchPriority}
      loading={loading ?? (priority ? undefined : "lazy")}
      decoding="async"
      width={useIntrinsic ? resolvedWidth : width}
      height={useIntrinsic ? resolvedHeight : height}
      fill={useFill ? true : undefined}
      className={cn(
        useIntrinsic
          ? STORE_IMAGE_INTRINSIC_CLASS
          : fit === "cover"
            ? STORE_IMAGE_COVER_CLASS
            : STORE_IMAGE_CONTAIN_CLASS,
        className,
      )}
      {...props}
    />
  );
}

/** Frame sized to natural image dimensions when known in STORE_IMAGE_INTRINSIC */
export function StoreImageFrame({
  src,
  alt,
  className,
  imageClassName,
  variant = "default",
  priority,
  sizes,
  aspect,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  variant?: StoreImageProps["variant"];
  priority?: boolean;
  sizes?: string;
  aspect?: string;
}) {
  const intrinsic = getImageIntrinsic(stripImagePath(src));

  if (intrinsic) {
    return (
      <div className={cn("w-full overflow-hidden bg-brand-beige", className)}>
        <StoreImage
          src={src}
          alt={alt}
          width={intrinsic.width}
          height={intrinsic.height}
          variant={variant}
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-brand-beige",
        !aspect && "aspect-[4/3]",
        className,
      )}
      style={storeImageAspectStyle(aspect)}
    >
      <StoreImage
        src={src}
        alt={alt}
        fill
        variant={variant}
        priority={priority}
        sizes={sizes}
        className={imageClassName}
      />
    </div>
  );
}
