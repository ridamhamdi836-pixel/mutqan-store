"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  FlaskConical,
  Leaf,
  Microscope,
  HeartHandshake,
  Quote,
  Award,
  type LucideIcon,
} from "lucide-react";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { HeroProductShowcase } from "@/components/home/beauty/HeroProductShowcase";
import { TrustFeaturesStrip } from "@/components/trust/TrustFeaturesStrip";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";
import { cn } from "@/lib/utils";

const WHY_ICONS: Record<string, LucideIcon> = {
  formulas: Microscope,
  actives: FlaskConical,
  guarantee: HeartHandshake,
  korean: Leaf,
};

const CTA_TRUST_ICONS = {
  shield: ShieldCheck,
  truck: Truck,
  card: CreditCard,
  leaf: Leaf,
} as const;

function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-brand-gold mb-2",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function HomeBeautyHero() {
  const { hero } = HOMEPAGE_BEAUTY;

  return (
    <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 page-x bg-brand-background overflow-hidden">
      {/* Nama-style soft background rings */}
      <div
        className="absolute top-1/2 start-0 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-brand-forest/5 pointer-events-none hidden md:block"
        aria-hidden
      />
      <div
        className="absolute top-1/3 end-0 w-[420px] h-[420px] rounded-full border border-brand-forest/5 pointer-events-none hidden lg:block"
        aria-hidden
      />

      <div className="max-w-content mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Copy — يمين في RTL */}
          <div className="order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-forest/20 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-brand-forest mb-5 md:mb-6 shadow-sm">
              <FlaskConical className="w-4 h-4 shrink-0" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-[1.75rem] md:text-[2.65rem] lg:text-[2.85rem] font-extrabold text-brand-forest leading-[1.18] mb-4 md:mb-5 tracking-tight">
              {hero.headline}
            </h1>

            <p className="text-[15px] md:text-base text-brand-muted leading-[1.9] mb-7 md:mb-8 max-w-lg">
              {hero.subheadline}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 md:gap-3 mb-7 md:mb-8">
              {hero.trustPills.map((pill) => (
                <div
                  key={pill.id}
                  className="text-center rounded-lg bg-white border border-brand-border/50 py-3 px-2 shadow-[0_1px_4px_rgba(26,71,49,0.04)]"
                >
                  <p className="text-sm md:text-[15px] font-extrabold text-brand-forest leading-none">
                    {pill.label}
                  </p>
                  <p className="text-[10px] md:text-[11px] text-brand-muted mt-1.5 font-medium leading-tight">
                    {pill.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-forest text-white font-bold rounded-xl px-7 md:px-8 py-3.5 md:py-4 text-sm md:text-base shadow-[0_4px_20px_rgba(26,71,49,0.28)] hover:bg-[#143d2a] transition-colors order-1 sm:order-1"
              >
                <span>{hero.primaryCta}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F0E0C8] border border-brand-gold/35 px-4 py-3 text-xs md:text-sm font-bold text-brand-forest order-2 sm:order-2">
                <Award className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{hero.guaranteeBadge}</span>
              </div>
            </div>
          </div>

          {/* Visual — نفس الصورة والإطار على الجوال والحاسوب */}
          <div className="order-2 relative w-full">
            <div className="w-full rounded-2xl overflow-hidden shadow-[0_12px_48px_rgba(26,71,49,0.1)] border border-brand-border/20">
              <HeroProductShowcase />
            </div>

            <div className="absolute -bottom-4 start-4 z-10 bg-white px-4 py-3 rounded-xl shadow-[0_8px_24px_rgba(26,71,49,0.12)] border border-brand-border/40 flex items-center gap-2.5 max-w-[85%]">
              <div className="w-9 h-9 rounded-full bg-brand-forest flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-brand-forest leading-tight">
                  {hero.imageBadgeTitle}
                </p>
                <p className="text-[10px] text-brand-muted font-medium leading-tight mt-0.5">
                  {hero.imageBadgeSub}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyFormulations({
  products = HOMEPAGE_BEAUTY.bestSellers.products,
}: {
  products?: HomepageBeautyProduct[];
}) {
  const { formulations } = HOMEPAGE_BEAUTY;

  return (
    <section id="products" className="section-pad page-x bg-white scroll-mt-24">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <SectionLabel>{formulations.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl lg:text-[2.5rem] font-extrabold text-brand-forest leading-snug tracking-tight mb-4">
            {formulations.headline}
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            {formulations.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <BeautyProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** @deprecated use HomeBeautyFormulations — kept for import compatibility */
export function HomeBeautyBestSellers(props: { products?: HomepageBeautyProduct[] }) {
  return <HomeBeautyFormulations {...props} />;
}

export function HomeBeautyWhyMutqan() {
  const { whyMutqan } = HOMEPAGE_BEAUTY;

  return (
    <section
      id="why-mutqan"
      className="section-pad page-x bg-[#F5F0E8] scroll-mt-24"
    >
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <SectionLabel>{whyMutqan.label}</SectionLabel>
          <h2 className="text-2xl md:text-[2.35rem] font-extrabold text-brand-forest leading-snug tracking-tight mb-2">
            {whyMutqan.headline}
          </h2>
          <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed">
            {whyMutqan.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {whyMutqan.cards.map((card) => {
            const Icon = WHY_ICONS[card.id] ?? ShieldCheck;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-6 md:p-7 text-start shadow-[0_2px_20px_rgba(26,71,49,0.06)] hover:shadow-[0_8px_32px_rgba(26,71,49,0.1)] transition-shadow duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-forest flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-brand-gold" strokeWidth={1.75} />
                </div>
                <h3 className="text-[15px] md:text-base font-bold text-brand-forest mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyTestimonials() {
  const { testimonials } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-white">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <SectionLabel>{testimonials.label}</SectionLabel>
          <h2 className="text-2xl md:text-[2.35rem] font-extrabold text-brand-forest leading-snug tracking-tight mb-2">
            {testimonials.headline}
          </h2>
          <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed">
            {testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {testimonials.items.map((review) => (
            <article
              key={review.name}
              className="bg-[#F7EFE5] rounded-2xl p-7 md:p-8 flex flex-col min-h-[280px]"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <Quote
                  className="w-9 h-9 text-brand-gold/45 shrink-0"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="flex text-brand-gold gap-0.5 shrink-0">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-[15px] md:text-base text-brand-forest leading-[1.85] font-medium flex-1 mb-6">
                {review.text}
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-brand-forest text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-brand-forest text-sm leading-tight">
                    {review.name}
                  </p>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    {review.age} سنة · {review.city}
                    {review.verified && (
                      <>
                        {" · "}
                        <span className="text-brand-gold font-semibold">مشتري مؤكد</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyOrderSteps() {
  const { orderSteps } = HOMEPAGE_BEAUTY;
  const stepNumbers = ["١", "٢", "٣"];

  return (
    <section className="section-pad page-x bg-[#F5F0E8]">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-12">
          <SectionLabel>{orderSteps.label}</SectionLabel>
          <h2 className="text-2xl md:text-[2.35rem] font-extrabold text-brand-forest leading-snug tracking-tight mb-2">
            {orderSteps.headline}
          </h2>
          <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed">
            {orderSteps.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-4xl mx-auto relative">
          <div
            className="hidden md:block absolute top-[2.35rem] inset-x-[18%] h-px bg-brand-gold/35 z-0"
            aria-hidden
          />
          {orderSteps.steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white rounded-2xl px-6 pt-7 pb-8 text-center relative z-10 shadow-[0_2px_20px_rgba(26,71,49,0.06)]"
            >
              <div className="w-[3.25rem] h-[3.25rem] rounded-full bg-brand-forest text-brand-gold flex items-center justify-center mx-auto mb-5 text-lg font-extrabold border-[3px] border-[#F5F0E8]">
                {stepNumbers[index]}
              </div>
              <h3 className="font-bold text-brand-forest text-base md:text-lg mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyFinalCta() {
  const { finalCta } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-brand-forest text-white relative overflow-hidden">
      <div
        className="absolute -top-16 -end-16 w-56 h-56 rounded-full border border-white/10 pointer-events-none hidden md:block"
        aria-hidden
      />
      <div
        className="absolute -bottom-20 -start-12 w-72 h-72 rounded-full border border-white/10 pointer-events-none hidden md:block"
        aria-hidden
      />
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,640px)] h-[min(90vw,640px)] rounded-full border border-white/[0.04] pointer-events-none"
        aria-hidden
      />

      <div className="max-w-content mx-auto text-center relative z-10">
        <SectionLabel className="text-brand-gold/90">{finalCta.label}</SectionLabel>

        <h2 className="text-2xl md:text-[2.35rem] lg:text-[2.5rem] font-extrabold text-white leading-snug tracking-tight mb-3 max-w-2xl mx-auto">
          {finalCta.headline}
        </h2>

        <p className="text-white/75 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
          {finalCta.description}
        </p>

        <Link
          href="#products"
          className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full bg-brand-gold text-brand-forest font-extrabold text-base md:text-lg shadow-[0_4px_24px_rgba(200,148,46,0.35)] hover:bg-[#d4a84a] transition-colors mb-8"
        >
          <span>{finalCta.button}</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs md:text-sm text-brand-gold/90">
          {finalCta.trustBadges.map((badge) => {
            const Icon = CTA_TRUST_ICONS[badge.icon];
            return (
              <span key={badge.label} className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                {badge.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyFaq() {
  const { faq } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <SectionLabel>{faq.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest leading-snug mb-3">
            {faq.headline}
          </h2>
          <p className="text-sm text-brand-muted">{faq.subtitle}</p>
        </div>
        <FAQAccordion items={[...faq.items]} />
      </div>
    </section>
  );
}

export function HomeBeautyTrustFooter() {
  return <TrustFeaturesStrip />;
}

/* Legacy exports — no longer used on homepage but kept to avoid breaking imports */
export function HomeBeautyTrustBar() {
  return null;
}
export function HomeBeautyWhyStartCare() {
  return null;
}
export function HomeBeautyThreeSteps() {
  return null;
}
export function HomeBeautyResults() {
  return null;
}
export function HomeBeautyBeforeAfter() {
  return null;
}
export function HomeBeautyRoutine() {
  return null;
}
export function HomeBeautyLifestyle() {
  return null;
}
