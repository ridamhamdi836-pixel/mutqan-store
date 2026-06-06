"use client";

import { Home, Layers, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import { SINK_ORGANIZER_PAGE } from "@/config/sink-organizer-page";
import { cn } from "@/lib/utils";

const PAGE = SINK_ORGANIZER_PAGE.valueJustification;

const ICONS = {
  home: Home,
  layers: Layers,
  scan: ScanSearch,
  shield: ShieldCheck,
  sparkles: Sparkles,
} as const;

export function SinkOrganizerValueJustification() {
  return (
    <section className="cv-section page-x py-8 md:py-11 bg-gradient-to-b from-brand-beige/90 via-brand-surface to-brand-beige/50">
      <div className="max-w-content mx-auto space-y-6 md:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 px-1">
          <p className="text-[11px] sm:text-xs font-bold text-brand-bronze uppercase tracking-widest">
            قبل أن ترى السعر
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-brand-espresso leading-snug">
            {PAGE.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
          {PAGE.cards.map((card, index) => {
            const Icon = ICONS[card.icon];
            const isFourth = index === 3;
            const isFifth = index === 4;

            return (
              <article
                key={card.headline}
                className={cn(
                  "group relative rounded-2xl md:rounded-3xl border border-brand-border/50 bg-white p-5 md:p-6 shadow-[0_8px_30px_rgba(45,36,32,0.06)]",
                  "transition-[transform,box-shadow] duration-200",
                  "lg:col-span-2",
                  isFourth && "lg:col-start-2",
                  isFifth && "sm:col-span-2 sm:max-w-lg sm:mx-auto lg:col-span-2 lg:max-w-none lg:mx-0",
                )}
              >
                <div className="flex flex-col gap-4 h-full">
                  <div
                    className={cn(
                      "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0",
                      "bg-gradient-to-br from-brand-trust/15 to-brand-bronze/10",
                      "border border-brand-trust/20 shadow-sm",
                      "group-hover:scale-[1.03] transition-transform duration-200",
                    )}
                    aria-hidden
                  >
                    <Icon
                      className="w-7 h-7 sm:w-8 sm:h-8 text-brand-trust"
                      strokeWidth={2.25}
                    />
                  </div>

                  <div className="space-y-2 flex-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-brand-espresso leading-snug">
                      {card.headline}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed font-medium">
                      {card.support}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
