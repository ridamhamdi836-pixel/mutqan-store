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
}

export function ReviewCard({ name, city, rating, text, photo, photoAlt, photoAspect }: ReviewCardProps) {
  return (
    <div className={cn("card overflow-hidden flex flex-col w-full", !photo && "self-start")}>
      {photo && (
        <div
          className="relative w-full bg-brand-beige"
          style={{ aspectRatio: photoAspect ?? "3/4" }}
        >
          <StoreImage
            src={photo}
            alt={photoAlt ?? `صورة من ${name} بعد استلام المنتج`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      )}
      <div className={cn("flex flex-col gap-2", photo ? "p-5" : "px-5 pt-4 pb-3")}>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-brand-border"}`}
            />
          ))}
        </div>
        <p className="text-sm text-brand-text leading-relaxed">&ldquo;{text}&rdquo;</p>
        <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
          <span className="font-semibold text-brand-espresso">{name}</span>
          <span>·</span>
          <span>{city}</span>
        </div>
      </div>
    </div>
  );
}
