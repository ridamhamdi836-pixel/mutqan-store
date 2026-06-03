import { StoreImage } from "@/components/ui/StoreImage";
import { cn } from "@/lib/utils";

type ProductMediaFrameProps = {
  src: string;
  alt: string;
  aspect?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductMediaFrame({
  src,
  alt,
  aspect,
  className,
  imageClassName,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProductMediaFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-2xl overflow-hidden shadow-md border border-brand-border/80 bg-brand-beige",
        "min-h-[240px] md:min-h-[360px] lg:min-h-[400px]",
        !aspect && "aspect-[4/5] md:aspect-auto",
        className,
      )}
      style={aspect ? { aspectRatio: aspect } : undefined}
    >
      <StoreImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover object-center", imageClassName)}
      />
    </div>
  );
}
