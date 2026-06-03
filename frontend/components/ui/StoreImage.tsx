import Image, { type ImageProps } from "next/image";
import {
  STORE_IMAGE_CONTAIN_CLASS,
  STORE_IMAGE_COVER_CLASS,
} from "@/lib/image-display";
import { cn } from "@/lib/utils";

/** Strip ?v= cache-bust; Next/Image optimizer uses the file path only */
export function stripImageQuery(src: string): string {
  return src.split("?")[0];
}

type StoreImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
  variant?: "default" | "thumbnail" | "hero";
  /** contain = full image visible (default); cover = crop to fill frame */
  fit?: "contain" | "cover";
};

function defaultQuality(variant: StoreImageProps["variant"]): number {
  if (variant === "thumbnail") return 95;
  if (variant === "hero") return 100;
  return 100;
}

function isStoreStaticAsset(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.startsWith("/images/");
}

/**
 * Store images: serve originals from /images/ without re-encoding or WebP swap.
 * Default fit is contain so frames show the full photo clearly.
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
  ...props
}: StoreImageProps) {
  const normalizedSrc =
    typeof src === "string" ? stripImageQuery(src) : src;

  const useOriginal =
    unoptimizedProp ?? isStoreStaticAsset(normalizedSrc);

  const resolvedQuality = quality ?? defaultQuality(variant);
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : variant === "thumbnail" ? "low" : "auto");

  return (
    <Image
      src={normalizedSrc}
      quality={resolvedQuality}
      unoptimized={useOriginal}
      priority={priority}
      fetchPriority={resolvedFetchPriority}
      loading={loading ?? (priority ? undefined : "lazy")}
      decoding="async"
      className={cn(
        fit === "cover" ? STORE_IMAGE_COVER_CLASS : STORE_IMAGE_CONTAIN_CLASS,
        className,
      )}
      {...props}
    />
  );
}
