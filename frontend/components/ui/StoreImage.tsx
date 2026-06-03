import Image, { type ImageProps } from "next/image";

/** Strip ?v= cache-bust; Next/Image optimizer uses the file path only */
export function stripImageQuery(src: string): string {
  return src.split("?")[0];
}

/** Prefer pre-generated WebP under /images/ for smaller origin files */
export function preferWebpSrc(src: string): string {
  const clean = stripImageQuery(src);
  if (!clean.startsWith("/images/")) return src;
  if (/\.webp$/i.test(clean)) return clean;
  if (/\.(png|jpe?g)$/i.test(clean)) return clean.replace(/\.(png|jpe?g)$/i, ".webp");
  return clean;
}

type StoreImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
  /** Smaller files for thumbnails (cart, avatars) */
  variant?: "default" | "thumbnail" | "hero";
};

function defaultQuality(variant: StoreImageProps["variant"], priority?: boolean): number {
  if (variant === "thumbnail") return 48;
  if (variant === "hero") return priority ? 72 : 65;
  return priority ? 68 : 52;
}

/**
 * Store images: WebP sources + Next.js responsive widths (AVIF/WebP delivery).
 */
export function StoreImage({
  quality,
  loading,
  src,
  unoptimized: unoptimizedProp,
  variant = "default",
  priority,
  fetchPriority,
  ...props
}: StoreImageProps) {
  const normalizedSrc =
    typeof src === "string" ? preferWebpSrc(stripImageQuery(src)) : src;
  const isBrandAsset =
    typeof normalizedSrc === "string" &&
    normalizedSrc.startsWith("/images/brand/");

  const resolvedQuality = quality ?? defaultQuality(variant, priority);
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : variant === "thumbnail" ? "low" : "auto");

  return (
    <Image
      src={normalizedSrc}
      quality={resolvedQuality}
      unoptimized={unoptimizedProp ?? isBrandAsset}
      priority={priority}
      fetchPriority={resolvedFetchPriority}
      loading={loading ?? (priority ? undefined : "lazy")}
      decoding="async"
      {...props}
    />
  );
}
