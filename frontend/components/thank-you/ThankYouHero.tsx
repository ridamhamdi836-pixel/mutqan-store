"use client";

import { CheckCircle2, Phone } from "lucide-react";
import { useStorefront } from "@/providers/storefront-provider";

export function ThankYouHero() {
  const { t } = useStorefront();

  return (
    <section className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full bg-brand-trust/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 md:w-9 md:h-9 text-brand-trust" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl md:text-[1.75rem] font-black text-brand-espresso leading-snug">
          {t("thankYouHeroTitle")}
        </h1>
        <p className="text-sm md:text-base text-brand-muted leading-relaxed max-w-md mx-auto font-medium">
          {t("thankYouHeroDesc")}{" "}
          <span className="text-brand-espresso font-bold">{t("thankYouHeroNoShip")}</span>
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <span className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-brand-espresso bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-pill">
          <Phone className="w-4 h-4 text-amber-600 shrink-0" />
          {t("thankYouCallBadge")}
        </span>
        <p className="text-xs md:text-sm text-brand-muted leading-relaxed px-1">
          {t("thankYouCallNote")}
        </p>
      </div>
    </section>
  );
}
