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

type Card = (typeof PAGE.cards)[number];

function ValueCard({
  card,
  index,
  className,
}: {
  card: Card;
  index: number;
  className?: string;
}) {
  const Icon = ICONS[card.icon];
  const isFeatured = "featured" in card && card.featured === true;
  const isAccent = "accent" in card && card.accent === true;
  const stat = "stat" in card ? card.stat : undefined;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl md:rounded-3xl border p-4 sm:p-5 md:p-6",
        "transition-[transform,box-shadow] duration-300",
        isFeatured
          ? "border-brand-trust/30 bg-gradient-to-br from-brand-espresso via-brand-espresso to-[#1a2838] text-white shadow-[0_16px_48px_rgba(27,77,219,0.18)]"
          : isAccent
            ? "border-brand-bronze/35 bg-gradient-to-br from-white via-brand-beige/40 to-brand-surface shadow-[0_12px_36px_rgba(184,115,51,0.12)]"
            : "border-brand-border/45 bg-white shadow-[0_10px_32px_rgba(45,36,32,0.07)]",
        className,
      )}
    >
      {!isFeatured ? (
        <div
          className="pointer-events-none absolute -top-10 -start-10 h-28 w-28 rounded-full bg-brand-trust/5 blur-2xl"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute -top-16 -end-8 h-40 w-40 rounded-full bg-brand-trust/20 blur-3xl"
          aria-hidden
        />
      )}

      <div
        className={cn(
          "relative flex h-full gap-3.5 sm:gap-4",
          isFeatured ? "flex-row items-center" : "flex-col",
        )}
      >
        <div className="flex items-start justify-between gap-3 shrink-0">
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-105",
              isFeatured
                ? "h-14 w-14 sm:h-16 sm:w-16 border-white/15 bg-white/10"
                : isAccent
                  ? "h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] border-brand-bronze/25 bg-gradient-to-br from-brand-bronze/15 to-brand-beige/80"
                  : "h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem] border-brand-trust/20 bg-gradient-to-br from-brand-trust/12 to-brand-surface",
            )}
            aria-hidden
          >
            <Icon
              className={cn(
                "h-7 w-7 sm:h-8 sm:w-8",
                isFeatured ? "text-brand-sand" : "text-brand-trust",
                isAccent && "text-brand-bronze",
              )}
              strokeWidth={2.25}
            />
          </div>

          {stat && !isFeatured ? (
            <span
              className={cn(
                "rounded-xl px-2.5 py-1 text-lg sm:text-xl font-black tabular-nums leading-none",
                isAccent
                  ? "bg-brand-bronze/15 text-brand-bronze"
                  : "bg-brand-trust/10 text-brand-trust",
              )}
            >
              {stat}
            </span>
          ) : null}
          {stat && isFeatured ? (
            <span className="sm:hidden rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-xl font-black text-white tabular-nums leading-none">
              {stat}
            </span>
          ) : null}
        </div>

        <div className={cn("relative min-w-0 flex-1 space-y-2", isFeatured && "space-y-2.5")}>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide",
                isFeatured
                  ? "bg-white/12 text-brand-sand/95"
                  : isAccent
                    ? "bg-brand-bronze/12 text-brand-bronze"
                    : "bg-brand-trust/10 text-brand-trust",
              )}
            >
              {card.tag}
            </span>
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums",
                isFeatured ? "text-brand-sand/50" : "text-brand-muted/70",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3
            className={cn(
              "font-extrabold leading-snug",
              isFeatured
                ? "text-base sm:text-lg md:text-xl text-white"
                : "text-[15px] sm:text-base md:text-lg text-brand-espresso",
            )}
          >
            {card.headline}
          </h3>

          <p
            className={cn(
              "text-sm leading-relaxed font-medium",
              isFeatured ? "text-brand-sand/80" : "text-brand-muted",
            )}
          >
            {card.support}
          </p>
        </div>

        {isFeatured && stat ? (
          <div
            className="hidden sm:flex shrink-0 flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/8 px-4 py-3 min-w-[5.5rem]"
            aria-hidden
          >
            <span className="text-3xl md:text-4xl font-black text-white leading-none tabular-nums">
              {stat}
            </span>
            <span className="mt-1 text-[10px] font-bold text-brand-sand/70 uppercase tracking-wider">
              تخزين
            </span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function SinkOrganizerValueJustification() {
  const featured = PAGE.cards.find((c) => "featured" in c && c.featured);
  const rest = PAGE.cards.filter((c) => !("featured" in c && c.featured));

  return (
    <section className="cv-section page-x py-8 md:py-12 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(27,77,219,0.07)_0%,_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(184,115,51,0.06)_0%,_transparent_50%)]"
        aria-hidden
      />

      <div className="relative max-w-content mx-auto space-y-5 md:space-y-7">
        {/* Premium header */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-brand-espresso/10 bg-brand-espresso px-5 py-6 sm:px-7 sm:py-8 md:px-10 md:py-9 shadow-[0_20px_50px_rgba(45,36,32,0.18)]">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(27,77,219,0.22)_0%,transparent_42%,rgba(184,115,51,0.12)_100%)]"
            aria-hidden
          />
          <div className="relative max-w-3xl mx-auto text-center space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-bronze/35 bg-brand-bronze/15 px-3 py-1 text-[11px] sm:text-xs font-bold text-brand-sand tracking-wide">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-bronze animate-pulse" aria-hidden />
              {PAGE.eyebrow}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-white leading-snug">
              {PAGE.title}
            </h2>
            <p className="text-sm sm:text-base text-brand-sand/85 font-medium leading-relaxed max-w-2xl mx-auto">
              {PAGE.summary}
            </p>
          </div>
        </div>

        {/* Featured hero card */}
        {featured ? (
          <ValueCard
            card={featured}
            index={PAGE.cards.indexOf(featured)}
            className="md:min-h-[9.5rem]"
          />
        ) : null}

        {/* Bento grid — varied rhythm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4">
          {rest.map((card) => {
            const index = PAGE.cards.indexOf(card);
            const isAccent = "accent" in card && card.accent;

            return (
              <ValueCard
                key={card.headline}
                card={card}
                index={index}
                className={cn(isAccent && "sm:col-span-2 lg:col-span-1 lg:max-w-none")}
              />
            );
          })}
        </div>

        {/* Value anchor strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 rounded-2xl border border-brand-trust/20 bg-gradient-to-r from-brand-trust/8 via-white to-brand-bronze/8 px-5 py-4 md:px-8 md:py-5 shadow-sm">
          <div className="flex items-center gap-2 text-brand-trust">
            <Sparkles className="h-5 w-5 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="text-sm sm:text-base font-extrabold text-brand-espresso text-center sm:text-start">
              {PAGE.footerLine}
            </span>
          </div>
          <span className="hidden sm:block h-8 w-px bg-brand-border/60" aria-hidden />
          <p className="text-xs sm:text-sm font-bold text-brand-muted text-center sm:text-start">
            مساحة · راحة · ترتيب يومي — يستحق السعر
          </p>
        </div>
      </div>
    </section>
  );
}
