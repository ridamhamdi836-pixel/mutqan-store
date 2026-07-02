import Link from "next/link";
import {
  ArrowLeft,
  Award,
  FlaskConical,
  Heart,
  Leaf,
  Sparkles,
  Target,
  Truck,
  Banknote,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { ABOUT_BEAUTY } from "@/config/about-beauty";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  korean: FlaskConical,
  actives: Leaf,
  simple: Target,
  experience: Heart,
};

const TRUST_ICONS: Record<string, LucideIcon> = {
  shipping: Truck,
  cod: Banknote,
  guarantee: ShieldCheck,
  actives: Sparkles,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
      {children}
    </p>
  );
}

function PillarIcon({ id }: { id: string }) {
  const Icon = PILLAR_ICONS[id] ?? Sparkles;
  return (
    <div className="mx-auto mb-5 w-[72px] h-[72px] rounded-full bg-brand-forest border-2 border-brand-gold/40 flex items-center justify-center shadow-[0_4px_16px_rgba(26,71,49,0.12)]">
      <Icon className="w-8 h-8 text-white" strokeWidth={1.75} />
    </div>
  );
}

export function AboutBeautyPage() {
  const { hero, story, pillars, promise, finalCta, trust } = ABOUT_BEAUTY;

  return (
    <div className="bg-white">
      {/* Hero — Nama-style cream with decorative circles */}
      <section className="relative overflow-hidden page-x py-16 md:py-24 bg-[#F9F8F3]">
        <div
          className="absolute top-8 start-[8%] w-48 h-48 md:w-72 md:h-72 rounded-full border border-brand-forest/8 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute bottom-4 end-[5%] w-64 h-64 md:w-96 md:h-96 rounded-full border border-brand-gold/15 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-3xl aspect-square rounded-full border border-brand-forest/5 pointer-events-none"
          aria-hidden
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-forest/8 border border-brand-forest/12 px-4 py-2 text-sm font-semibold text-brand-forest mb-6 md:mb-8">
            <FlaskConical className="w-4 h-4 text-brand-gold" />
            {hero.badge}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-extrabold text-brand-forest leading-[1.25] mb-2 tracking-tight">
            {hero.titleLine1}
          </h1>
          <p className="text-xl md:text-3xl lg:text-[2rem] font-extrabold text-brand-forest/85 leading-snug mb-6 md:mb-8">
            {hero.titleLine2}
          </p>

          <p className="text-base md:text-lg text-brand-muted leading-[1.95] max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="page-x py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>{story.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-espresso leading-snug mb-8 md:mb-10">
            {story.title}
          </h2>

          <div className="space-y-6 text-base md:text-lg text-brand-muted leading-[1.95]">
            {story.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <blockquote className="mt-10 md:mt-12 border-s-4 border-brand-gold ps-5 md:ps-6 py-1">
            <p className="text-lg md:text-xl font-bold text-brand-forest leading-relaxed">
              {story.quote}
            </p>
          </blockquote>
        </div>
      </section>

      {/* Four pillars */}
      <section className="page-x py-14 md:py-20 bg-[#F9F8F3]">
        <div className="max-w-content mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <SectionLabel>{pillars.label}</SectionLabel>
            <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest mb-3">
              {pillars.title}
            </h2>
            <p className="text-sm md:text-base text-brand-muted">{pillars.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {pillars.items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white border border-brand-border/20 p-6 md:p-7 text-center shadow-[0_4px_24px_rgba(26,71,49,0.05)]"
              >
                <PillarIcon id={item.id} />
                <h3 className="text-lg font-extrabold text-brand-forest mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="page-x py-14 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>{promise.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest mb-8 md:mb-10">
            {promise.title}
          </h2>

          <div className="rounded-3xl bg-[#F5F0E8] border border-brand-border/15 p-6 md:p-10 space-y-5">
            {promise.items.map((item) => (
              <div key={item} className="flex items-start gap-3 md:gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-forest">
                  <Award className="w-4 h-4 text-brand-gold" strokeWidth={2} />
                </span>
                <p className="text-sm md:text-base text-brand-espresso leading-relaxed pt-1.5">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA + trust */}
      <section className="relative overflow-hidden bg-brand-forest page-x py-14 md:py-20">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,148,46,0.25) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div
          className="absolute top-8 end-8 w-40 h-40 rounded-full border border-brand-gold/20 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute bottom-4 start-4 w-56 h-56 rounded-full border border-white/10 pointer-events-none"
          aria-hidden
        />

        <div className="max-w-3xl mx-auto text-center relative z-10 mb-12 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-8 md:mb-10">
            {finalCta.title}
          </h2>
          <Link
            href={finalCta.buttonHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest font-extrabold text-base md:text-lg px-8 md:px-10 py-4 shadow-[0_4px_20px_rgba(200,148,46,0.35)] hover:bg-[#d4a035] transition-colors"
          >
            {finalCta.buttonLabel}
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        <div className="max-w-content mx-auto relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {trust.map((item) => {
            const Icon = TRUST_ICONS[item.id] ?? ShieldCheck;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-2xl bg-white/95 p-4 md:p-5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-forest/8 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-forest" strokeWidth={2} />
                </div>
                <div className="min-w-0 text-start">
                  <p className="font-bold text-sm text-brand-forest leading-snug">{item.title}</p>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
