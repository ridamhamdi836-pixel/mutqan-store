import { Star } from "lucide-react";
import { THANK_YOU_REVIEWS } from "@/config/thank-you";
import { ThankYouReviewCard } from "@/components/thank-you/ThankYouReviewCard";

export function ThankYouReviews() {
  return (
    <section className="space-y-4">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 text-amber-500 font-bold text-xs">
          <Star className="w-4 h-4 fill-current" />
          <span>تجارب حقيقية</span>
        </div>
        <h2 className="font-black text-lg md:text-xl text-brand-espresso">
          عملاء ردّوا على الاتصال واستلموا طلبهم
        </h2>
      </div>
      <div className="space-y-3">
        {THANK_YOU_REVIEWS.map((review, i) => (
          <ThankYouReviewCard key={`${review.name}-${i}`} {...review} />
        ))}
      </div>
    </section>
  );
}
