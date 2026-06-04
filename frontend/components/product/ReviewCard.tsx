import { StoreImageFrame } from "@/components/ui/StoreImage";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";

interface ReviewCardProps {
  name: string;
  city: string;
  rating: number;
  text: string;
  photo?: string;
  photoAlt?: string;
  photoAspect?: string;
  /** e.g. "منذ أسبوعين" */
  dateLabel?: string;
}

export function ReviewCard({
  name,
  city,
  rating,
  text,
  photo,
  photoAlt,
  photoAspect,
  dateLabel,
}: ReviewCardProps) {
  return (
    <article className={cn("card overflow-hidden flex flex-col w-full", !photo && "self-start")}>
      {photo ? (
        <StoreImageFrame
          src={photo}
          alt={photoAlt ?? `صورة من ${name} بعد استلام المنتج`}
          aspect={photoAspect}
          className="rounded-t-2xl overflow-hidden"
          sizes={STORE_IMAGE_SIZES.section}
        />
      ) : null}
      <div className={cn("flex flex-col gap-2", photo ? "p-4 md:p-5" : "px-4 md:px-5 pt-4 pb-3")}>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-brand-border"}`}
              />
            ))}
          </div>
          {dateLabel ? (
            <time className="text-[10px] md:text-xs text-brand-muted font-medium">
              {dateLabel}
            </time>
          ) : null}
        </div>
        <p className="text-sm text-brand-text leading-relaxed">&ldquo;{text}&rdquo;</p>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium pt-0.5">
          <span className="font-semibold text-brand-espresso">{name}</span>
          <span aria-hidden>·</span>
          <span>{city}</span>
        </div>
      </div>
    </article>
  );
}
