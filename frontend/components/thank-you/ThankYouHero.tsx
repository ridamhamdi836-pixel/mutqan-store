"use client";

import { CheckCircle2, Phone } from "lucide-react";
import { useCountdown } from "@/lib/use-countdown";

const CALL_COUNTDOWN_SECONDS = 10 * 60;

export function ThankYouHero() {
  const { formatted, isExpired } = useCountdown(CALL_COUNTDOWN_SECONDS);

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
          تبقى خطوة واحدة فقط ليتم شحن طلبك اليوم.
        </p>
      </div>

      <div className="inline-flex flex-col items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-brand-espresso bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-pill">
          <Phone className="w-4 h-4 text-amber-600" />
          سيصلك اتصال التأكيد خلال 10 دقائق
        </span>

        <div
          className="rounded-2xl border-2 border-brand-bronze/25 bg-gradient-to-l from-brand-bronze/5 to-white px-6 py-3 min-w-[8.5rem]"
          aria-live="polite"
          aria-label={`الوقت المتبقي للاتصال ${formatted}`}
        >
          <p className="text-[10px] font-bold text-brand-muted mb-0.5">
            الوقت المتوقع للاتصال
          </p>
          <p
            className={`text-3xl md:text-4xl font-black tabular-nums tracking-tight ${
              isExpired ? "text-brand-muted" : "text-brand-bronze"
            }`}
          >
            {isExpired ? "قريباً" : formatted}
          </p>
        </div>
      </div>
    </section>
  );
}
