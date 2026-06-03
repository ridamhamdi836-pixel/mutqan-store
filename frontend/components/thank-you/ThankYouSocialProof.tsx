"use client";

import { Star } from "lucide-react";
import { THANK_YOU_REVIEWS, THANK_YOU_STATS } from "@/config/thank-you";

export function ThankYouSocialProof() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {THANK_YOU_STATS.map((stat) => (
          <div
            key={stat.label}
            className="card p-3 text-center bg-brand-beige/40 border-brand-border/50"
          >
            <p className="text-base md:text-lg font-black text-brand-espresso">
              {stat.value}
            </p>
            <p className="text-[10px] md:text-xs text-brand-muted mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-brand-espresso text-base text-center">
          عملاء ردّوا على الاتصال واستلموا طلبهم
        </h2>
        {THANK_YOU_REVIEWS.map((review, i) => (
          <div key={i} className="card p-4 text-start">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star
                  key={j}
                  className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                />
              ))}
              <span className="text-xs text-brand-muted mr-2">
                {review.name} · {review.city}
              </span>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
