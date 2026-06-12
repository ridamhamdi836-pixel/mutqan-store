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
  alt = "",
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
  const displaySrc = src;
  const lookupSrc = typeof src === "string" ? stripImagePath(src) : null;

  const intrinsic = lookupSrc ? getImageIntrinsic(lookupSrc) : null;

  const useFill = fill === true;
  const useNaturalIntrinsic =
    !useFill && width == null && height == null && intrinsic;
  const useSizedNative = !useFill && width != null && height != null;
  const resolvedWidth = width ?? intrinsic?.width;
  const resolvedHeight = height ?? intrinsic?.height;

  const resolvedQuality = quality ?? defaultQuality();
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : variant === "thumbnail" ? "low" : "auto");

  const resolvedLoading = loading ?? (priority ? undefined : "lazy");
  const resolvedClassName = cn(
    useNaturalIntrinsic
      ? STORE_IMAGE_INTRINSIC_CLASS
      : fit === "cover"
        ? STORE_IMAGE_COVER_CLASS
        : STORE_IMAGE_CONTAIN_CLASS,
    className,
  );

  /** Native img avoids Next/Image compositor bugs on some Android GPUs (Honor) */
  if (useNaturalIntrinsic && typeof displaySrc === "string") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        width={intrinsic!.width}
        height={intrinsic!.height}
        loading={resolvedLoading === "eager" ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={resolvedClassName}
      />
    );
  }

  if (useSizedNative && typeof displaySrc === "string") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        loading={resolvedLoading === "eager" ? "eager" : "lazy"}
        decoding="async"
        className={resolvedClassName}
      />
    );
  }

  return (
    <Image
      src={displaySrc}
      alt={alt}
      quality={resolvedQuality}
      unoptimized={unoptimizedProp ?? true}
      priority={priority}
      fetchPriority={resolvedFetchPriority}
      loading={resolvedLoading}
      decoding="async"
      width={resolvedWidth}
      height={resolvedHeight}
      fill={useFill ? true : undefined}
      className={resolvedClassName}
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
      <div
        className={cn(
          "w-full overflow-hidden bg-brand-beige store-image-frame",
          className,
        )}
      >
        <StoreImage
          src={src}
          alt={alt}
          variant={variant}
          priority={priority}
          sizes={sizes}
          className={cn("w-full h-auto max-w-full block", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-brand-beige store-image-frame",
        !aspect && "aspect-[4/3]",
        className,
      )}
      style={storeImageAspectStyle(aspect)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        className={cn(
          STORE_IMAGE_CONTAIN_CLASS,
          "absolute inset-0 h-full w-full",
          imageClassName,
        )}
      />
    </div>
  );
}
