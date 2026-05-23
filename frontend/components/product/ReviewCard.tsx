import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  city: string;
  rating: number;
  text: string;
}

export function ReviewCard({ name, city, rating, text }: ReviewCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-brand-border"}`}
          />
        ))}
      </div>
      <p className="text-sm text-brand-text leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-1.5 text-xs text-brand-muted font-medium mt-auto">
        <span className="font-semibold text-brand-espresso">{name}</span>
        <span>·</span>
        <span>{city}</span>
      </div>
    </div>
  );
}
