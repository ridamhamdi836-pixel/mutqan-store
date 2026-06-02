import Image, { type ImageProps } from "next/image";

/** Strip ?v= cache-bust; Next/Image optimizer uses the file path only */
export function stripImageQuery(src: string): string {
  return src.split("?")[0];
}

type StoreImageProps = Omit<ImageProps, "quality"> & {
  quality?: number;
};

/**
 * Store images with Next.js optimization (WebP/AVIF, responsive width, lazy load).
 */
export function StoreImage({
  quality = 75,
  loading,
  src,
  ...props
}: StoreImageProps) {
  const normalizedSrc = typeof src === "string" ? stripImageQuery(src) : src;

  return (
    <Image
      src={normalizedSrc}
      quality={quality}
      loading={loading ?? (props.priority ? undefined : "lazy")}
      {...props}
    />
  );
}
