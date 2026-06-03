import { Star, Quote } from "lucide-react";

type ThankYouReviewCardProps = {
  name: string;
  city: string;
  rating: number;
  text: string;
};

export function ThankYouReviewCard({
  name,
  city,
  rating,
  text,
}: ThankYouReviewCardProps) {
  const initial = name.trim().charAt(0) || "م";

  return (
    <article className="card p-4 md:p-5 text-start border-brand-border/80 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full bg-brand-bronze/10 text-brand-bronze font-black text-lg flex items-center justify-center flex-shrink-0"
          aria-hidden
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-brand-espresso">{name}</p>
          <p className="text-xs text-brand-muted">{city}</p>
          <div className="flex items-center gap-0.5 mt-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-brand-border"
                }`}
              />
            ))}
          </div>
        </div>
        <Quote className="w-8 h-8 text-brand-beige flex-shrink-0 rotate-180" />
      </div>
      <p className="text-sm text-brand-muted leading-[1.75]">&ldquo;{text}&rdquo;</p>
    </article>
  );
}
