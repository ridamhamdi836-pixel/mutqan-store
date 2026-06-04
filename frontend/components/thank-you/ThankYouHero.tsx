"use client";

import { useMemo } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { getCallExpectation } from "@/lib/call-window";
import { cn } from "@/lib/utils";

const HERO_SUBLINES: Record<
  ReturnType<typeof getCallExpectation>["variant"],
  string
> = {
  business_hours: "تبقى خطوة واحدة — أجب على اتصال التأكيد لنبدأ تجهيز طلبك.",
  morning_today: "طلبك محفوظ. نتصل صباحاً بين 9 ص و 9 م لتأكيد التفاصيل.",
  morning_tomorrow:
    "طلبك محفوظ. نتصل في أول فترة عمل غداً (9 ص – 9 م) لتأكيد التفاصيل.",
};

export function ThankYouHero() {
  const expectation = useMemo(() => getCallExpectation(), []);
  const duringHours = expectation.variant === "business_hours";

  return (
    <section className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-brand-trust/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 md:w-9 md:h-9 text-brand-trust" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-[1.75rem] font-black text-brand-espresso leading-snug">
          تم حجز طلبك بنجاح ✅
        </h1>
        <p className="text-sm md:text-base text-brand-muted leading-relaxed max-w-md mx-auto font-medium">
          {HERO_SUBLINES[expectation.variant]}
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs md:text-sm font-bold px-4 py-2 rounded-pill border",
            duringHours
              ? "text-brand-espresso bg-amber-50 border-amber-200/80"
              : "text-brand-espresso bg-brand-trust/10 border-brand-trust/30",
          )}
        >
          <Phone
            className={cn(
              "w-4 h-4 shrink-0",
              duringHours ? "text-amber-600" : "text-brand-trust",
            )}
          />
          {expectation.bannerHeadline}
        </span>
        <p className="text-xs md:text-sm text-brand-muted leading-relaxed px-1">
          {expectation.bannerSubline}
        </p>
      </div>
    </section>
  );
}
