import { StoreImage } from "@/components/ui/StoreImage";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  name: string;
  city: string;
  rating: number;
  text: string;
  photo?: string;
  photoAlt?: string;
  photoAspect?: string;
  /** featured = large photo on desktop for PDP */
  variant?: "default" | "featured" | "compact";
}

export function ReviewCard({
  name,
  city,
  rating,
  text,
  photo,
  photoAlt,
  photoAspect,
  variant = "default",
}: ReviewCardProps) {
  const featured = variant === "featured" && photo;
  const compact = variant === "compact";

  return (
    <div
      className={cn(
        "card overflow-hidden w-full bg-white border-brand-border/70",
        featured ? "md:flex md:flex-row md:items-stretch" : "flex flex-col",
        compact && "shadow-sm",
      )}
    >
      {photo && (
        <div
          className={cn(
            "relative bg-brand-beige shrink-0",
            featured
              ? "w-full md:w-[48%] min-h-[220px] md:min-h-[280px]"
              : "w-full",
          )}
          style={
            featured
              ? undefined
              : { aspectRatio: photoAspect ?? "4/5" }
          }
        >
          <StoreImage
            src={photo}
            alt={photoAlt ?? `صورة من ${name}`}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 480px"
                : "(max-width: 640px) 100vw, 400px"
            }
            className="object-cover object-center"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-2 justify-center",
          photo ? "p-5 md:p-6" : "px-5 py-4",
          featured && "md:flex-1",
        )}
      >
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-brand-border",
              )}
            />
          ))}
        </div>
        <p
          className={cn(
            "text-brand-text leading-relaxed",
            featured ? "text-base md:text-lg" : "text-sm",
          )}
        >
          &ldquo;{text}&rdquo;
        </p>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium pt-1">
          <span className="font-bold text-brand-espresso">{name}</span>
          <span>·</span>
          <span>{city}</span>
        </div>
      </div>
    </div>
  );
}
