import Image, { type ImageProps } from "next/image";
import {
  STORE_IMAGE_CONTAIN_CLASS,
  STORE_IMAGE_COVER_CLASS,
} from "@/lib/image-display";
import { cn } from "@/lib/utils";

/** Strip ?v= cache-bust; Next/Image uses the file path only */
export function stripImageQuery(src: string): string {
  return src.split("?")[0];
}

type StoreImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
  variant?: "default" | "thumbnail" | "hero";
  /** contain = full image visible (default); cover = crop to fill frame */
  fit?: "contain" | "cover";
};

function defaultQuality(): number {
  return 100;
}

/**
 * All store images: serve files as-is (no Next.js re-encode, no WebP swap).
 * Default fit is contain — full photo visible inside the frame.
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
      className={cn(
        fit === "cover" ? STORE_IMAGE_COVER_CLASS : STORE_IMAGE_CONTAIN_CLASS,
        className,
      )}
      {...props}
    />
  );
}
