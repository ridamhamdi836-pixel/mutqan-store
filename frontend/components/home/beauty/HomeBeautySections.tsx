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
  Banknote,
  type LucideIcon,
} from "lucide-react";
import { StoreImage, StoreImageFrame } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";

const WHY_ICONS: Record<string, LucideIcon> = {
  formulas: Microscope,
  actives: FlaskConical,
  guarantee: HeartHandshake,
  korean: Leaf,
};

const TRUST_FOOTER_ICONS: Record<string, LucideIcon> = {
  shipping: Truck,
  cod: Banknote,
  guarantee: ShieldCheck,
  actives: FlaskConical,
};

const CTA_TRUST_ICONS = {
  shield: ShieldCheck,
  truck: Truck,
  card: CreditCard,
  leaf: Leaf,
} as const;

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] md:text-xs font-bold tracking-[0.28em] uppercase text-brand-gold mb-4">
      {children}
    </p>
  );
}

export function HomeBeautyHero() {
  const { hero } = HOMEPAGE_BEAUTY;

  return (
    <section className="relative pt-10 pb-14 md:pt-16 md:pb-20 page-x bg-brand-background overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Image — Nama style white rounded frame */}
          <div className="order-1 md:order-1 relative">
            <div className="rounded-[1.5rem] bg-white p-6 md:p-8 shadow-[0_8px_40px_rgba(47,69,56,0.08)] border border-brand-border/30">
              <StoreImageFrame
                src={hero.image}
                alt={hero.imageAlt}
                className="rounded-xl overflow-hidden"
                variant="hero"
                priority
                sizes={STORE_IMAGE_SIZES.hero}
              />
            </div>

            <div className="absolute -bottom-4 start-6 md:-bottom-5 md:start-8 z-10 bg-white px-4 py-3 rounded-xl shadow-lg border border-brand-border/40 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-forest/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-forest" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                  {hero.imageBadge}
                </p>
                <p className="text-xs font-bold text-brand-espresso">متقن للعناية</p>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-2 md:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-forest/15 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-brand-forest mb-6 shadow-sm">
              <FlaskConical className="w-4 h-4" />
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-[1.85rem] md:text-[2.75rem] lg:text-[3rem] font-extrabold text-brand-forest leading-[1.2] mb-5 tracking-tight">
              {hero.headline}
            </h1>

            <p className="text-base md:text-lg text-brand-muted leading-[1.9] mb-8 max-w-lg">
              {hero.subheadline}
            </p>

            {/* Trust pills — 4 icons like Nama */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {hero.trustPills.map((pill) => (
                <div
                  key={pill.id}
                  className="text-center rounded-xl bg-white border border-brand-border/40 py-3 px-2 shadow-sm"
                >
                  <p className="text-sm font-extrabold text-brand-forest">{pill.label}</p>
                  <p className="text-[10px] text-brand-muted mt-0.5 font-medium">{pill.sub}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center gap-2.5 bg-brand-forest text-white font-bold rounded-xl px-8 py-4 text-base shadow-[0_4px_20px_rgba(47,69,56,0.25)] hover:bg-brand-forest/90 transition-colors"
              >
                <span>{hero.primaryCta}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="inline-flex items-center gap-2 rounded-xl bg-brand-gold/10 border border-brand-gold/25 px-4 py-3 text-sm font-semibold text-brand-forest">
                <ShieldCheck className="w-4 h-4 text-brand-gold" />
                <span>{hero.guaranteeBadge}</span>
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
      className="section-pad page-x bg-brand-cream scroll-mt-24"
    >
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <SectionLabel>{whyMutqan.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest leading-snug tracking-tight mb-4">
            {whyMutqan.headline}
          </h2>
          <p className="text-sm md:text-base text-brand-muted leading-relaxed">
            {whyMutqan.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {whyMutqan.cards.map((card) => {
            const Icon = WHY_ICONS[card.id] ?? ShieldCheck;
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-6 md:p-7 text-center border border-brand-border/30 shadow-[0_2px_16px_rgba(47,69,56,0.04)] hover:shadow-[0_8px_32px_rgba(47,69,56,0.08)] transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-brand-forest text-white flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="text-base md:text-lg font-bold text-brand-forest mb-3 leading-snug">
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
    <section className="section-pad page-x bg-brand-background">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
          <SectionLabel>{testimonials.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest leading-snug tracking-tight mb-3">
            {testimonials.headline}
          </h2>
          <p className="text-sm text-brand-muted">{testimonials.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {testimonials.items.map((review) => (
            <article
              key={review.name}
              className="bg-brand-cream rounded-2xl p-7 md:p-8 border border-brand-border/25 relative"
            >
              <div className="flex items-start justify-between mb-5">
                <Quote className="w-8 h-8 text-brand-gold/40" />
                <div className="flex text-brand-gold gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-[15px] text-brand-espresso leading-[1.85] mb-6 font-medium">
                {review.text}
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-brand-border/30">
                <div className="w-10 h-10 rounded-full bg-brand-forest text-white flex items-center justify-center text-sm font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-brand-forest text-sm">{review.name}</p>
                  <p className="text-xs text-brand-muted">
                    {review.age} سنة · {review.city}
                    {review.verified && (
                      <span className="text-brand-gold font-semibold"> · شراء موثّق</span>
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

  return (
    <section className="section-pad page-x bg-brand-cream">
      <div className="max-w-content mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
          <SectionLabel>{orderSteps.label}</SectionLabel>
          <h2 className="text-2xl md:text-4xl font-extrabold text-brand-forest leading-snug tracking-tight mb-3">
            {orderSteps.headline}
          </h2>
          <p className="text-sm text-brand-muted">{orderSteps.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto relative">
          <div
            className="hidden md:block absolute top-12 inset-x-[16%] h-px bg-brand-border/60"
            aria-hidden
          />
          {orderSteps.steps.map((step, index) => (
            <div key={step.title} className="text-center relative bg-brand-cream">
              <div className="w-14 h-14 rounded-full bg-brand-forest text-white flex items-center justify-center mx-auto mb-5 text-lg font-extrabold shadow-md relative z-10">
                {index + 1}
              </div>
              <h3 className="font-bold text-brand-forest text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-brand-muted leading-relaxed max-w-[16rem] mx-auto">
                {step.desc}
              </p>
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
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden
      />

      <div className="max-w-content mx-auto text-center relative z-10">
        <SectionLabel>
          <span className="text-brand-gold/90">{finalCta.label}</span>
        </SectionLabel>

        <h2 className="text-2xl md:text-4xl lg:text-[2.5rem] font-extrabold text-white leading-snug tracking-tight mb-5 max-w-2xl mx-auto">
          {finalCta.headline}
        </h2>

        <p className="text-white/75 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          {finalCta.description}
        </p>

        <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-10 text-sm text-white/80">
          {finalCta.trustBadges.map((badge) => {
            const Icon = CTA_TRUST_ICONS[badge.icon];
            return (
              <span key={badge.label} className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4 text-brand-gold" />
                {badge.label}
              </span>
            );
          })}
        </div>

        <Link
          href="#products"
          className="inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-xl bg-brand-gold text-brand-forest font-extrabold text-base md:text-lg shadow-lg hover:bg-[#d4b87a] transition-colors"
        >
          <span>{finalCta.button}</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>
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
  const { trustFooter } = HOMEPAGE_BEAUTY;

  return (
    <section className="py-10 md:py-12 page-x bg-brand-cream border-t border-brand-border/30">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFooter.map((item) => {
            const Icon = TRUST_FOOTER_ICONS[item.id] ?? ShieldCheck;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-forest/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-forest" />
                </div>
                <div>
                  <p className="font-bold text-brand-forest text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
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
