import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Users,
  Sparkles,
  Check,
  Gift,
  Gem,
  Headset,
  type LucideIcon,
} from "lucide-react";
import { StoreImage, StoreImageFrame } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";
import { getProductPath } from "@/config/catalog";
import { cn } from "@/lib/utils";

const TRUST_ICONS = {
  users: Users,
  shield: ShieldCheck,
  "credit-card": CreditCard,
  message: MessageCircle,
  truck: Truck,
} as const;

type WhyCardTheme = {
  Icon: LucideIcon;
  accent: string;
  iconGradient: string;
  glowColor: string;
  borderHover: string;
};

const WHY_MUTQAN_THEMES: Record<string, WhyCardTheme> = {
  curated: {
    Icon: Gift,
    accent: "#C9A96A",
    iconGradient: "from-[#C9A96A]/25 via-[#C9A96A]/10 to-[#FAF8F5]",
    glowColor: "rgba(201,169,106,0.12)",
    borderHover: "group-hover:border-[#C9A96A]/25",
  },
  quality: {
    Icon: Gem,
    accent: "#10B981",
    iconGradient: "from-[#10B981]/28 via-[#10B981]/10 to-[#FAF8F6]",
    glowColor: "rgba(16,185,129,0.12)",
    borderHover: "group-hover:border-[#10B981]/25",
  },
  guarantee: {
    Icon: ShieldCheck,
    accent: "#2563EB",
    iconGradient: "from-[#2563EB]/28 via-[#2563EB]/10 to-[#FAF8F6]",
    glowColor: "rgba(37,99,235,0.12)",
    borderHover: "group-hover:border-[#2563EB]/25",
  },
  support: {
    Icon: Headset,
    accent: "#E8A4A4",
    iconGradient: "from-[#E8A4A4]/35 via-[#E8A4A4]/12 to-[#FAF8F6]",
    glowColor: "rgba(232,164,164,0.14)",
    borderHover: "group-hover:border-[#E8A4A4]/30",
  },
};

export function HomeBeautyHero() {
  const { hero } = HOMEPAGE_BEAUTY;

  return (
    <section className="relative pt-8 pb-12 md:pt-14 md:pb-20 page-x overflow-hidden">
      <div
        className="absolute top-0 end-0 w-[420px] h-[420px] bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute bottom-0 start-0 w-[360px] h-[360px] bg-brand-secondary/50 rounded-full blur-3xl -z-10 pointer-events-none"
        aria-hidden
      />

      <div className="max-w-content mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 md:order-1 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-brand-espresso rounded-pill px-5 py-2.5 text-sm font-semibold mb-8 border border-brand-gold/25 shadow-sm">
              <span>{hero.badge}</span>
            </div>

            <h1 className="text-[2rem] md:text-5xl lg:text-[3.25rem] font-extrabold text-brand-espresso leading-[1.25] mb-6 tracking-tight">
              {hero.headline}
            </h1>

            <p className="text-base md:text-xl text-brand-muted leading-[1.85] mb-8 max-w-lg">
              {hero.subheadline}
            </p>

            <ul className="space-y-3 mb-10">
              {hero.trustBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-center gap-2.5 text-sm md:text-base font-medium text-brand-espresso/80"
                >
                  <Check className="w-4 h-4 text-brand-gold flex-shrink-0" strokeWidth={2.5} />
                  <span>{bullet.replace("✓ ", "")}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#best-sellers"
                className="btn-primary inline-flex items-center justify-center gap-2.5 w-full sm:w-auto py-4 px-9 text-base md:text-lg"
              >
                <span>{hero.primaryCta}</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="#why-mutqan"
                className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-9 text-base"
              >
                {hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <StoreImageFrame
              src={hero.image}
              alt={hero.imageAlt}
              className="rounded-[1.75rem] overflow-hidden shadow-[0_24px_64px_rgba(15,23,42,0.12)] border border-white/80 bg-gradient-to-br from-brand-secondary/30 to-white"
              variant="hero"
              priority
              sizes={STORE_IMAGE_SIZES.hero}
            />

            <div className="absolute -bottom-5 start-4 md:-bottom-6 md:-start-6 z-10 bg-white p-4 rounded-2xl shadow-xl border border-brand-border/40 flex items-center gap-3 animate-float">
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3, 4].map((id) => (
                  <div
                    key={id}
                    className="w-9 h-9 rounded-full bg-brand-secondary border-2 border-white overflow-hidden relative"
                  >
                    <StoreImage
                      src={`/images/customers/customer-${id}.png`}
                      alt="عميلة سعيدة"
                      fill
                      variant="thumbnail"
                      sizes={STORE_IMAGE_SIZES.tiny}
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-brand-gold gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-bold text-brand-espresso mt-1">+50,000 عميلة</p>
              </div>
            </div>

            <div className="absolute top-4 end-4 bg-brand-espresso text-white px-4 py-2.5 rounded-xl shadow-lg border border-brand-gold/30">
              <ShieldCheck className="w-5 h-5 mx-auto text-brand-gold" />
              <p className="text-[10px] font-bold mt-1 text-center leading-tight">ضمان 30 يوم</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyTrustBar() {
  return (
    <section className="py-5 md:py-6 bg-brand-espresso text-white border-y border-brand-gold/15">
      <div className="max-w-content mx-auto page-x">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-x-6 gap-y-4">
          {HOMEPAGE_BEAUTY.trustBar.map((item) => {
            const Icon = TRUST_ICONS[item.icon];
            return (
              <div
                key={item.label}
                className="flex items-center gap-2.5 text-sm md:text-[15px] font-medium text-white/90"
              >
                <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyWhyStartCare() {
  const { whyStartCare } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-white">
      <div className="max-w-content mx-auto text-center max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso leading-snug tracking-tight mb-5">
          {whyStartCare.headline}
        </h2>
        <p className="text-base md:text-lg text-brand-muted leading-[1.9] mb-8">
          {whyStartCare.description}
        </p>
        <ul className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
          {whyStartCare.points.map((point) => (
            <li
              key={point}
              className="inline-flex items-center gap-2 rounded-full border border-brand-border/60 bg-brand-background px-5 py-2.5 text-sm font-semibold text-brand-espresso"
            >
              <Check className="w-4 h-4 text-brand-gold" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeBeautyThreeSteps() {
  const { threeSteps } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-brand-background">
      <div className="max-w-content mx-auto">
        <div className="text-center section-title-gap max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso leading-snug tracking-tight">
            {threeSteps.headline}
          </h2>
          <p className="mt-3 text-brand-muted">{threeSteps.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {threeSteps.steps.map((step) => (
            <Link
              key={step.id}
              href={getProductPath(step.slug)}
              className="group rounded-[1.75rem] border border-white bg-white p-8 text-center shadow-[0_4px_28px_rgba(30,36,48,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(30,36,48,0.08)]"
            >
              <span
                className="inline-block text-[11px] font-bold tracking-[0.2em] uppercase mb-4"
                style={{ color: step.accent }}
              >
                {step.label}
              </span>
              <h3 className="text-xl font-extrabold text-brand-espresso mb-2 group-hover:text-brand-gold transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyBestSellers({
  products = HOMEPAGE_BEAUTY.bestSellers.products,
}: {
  products?: HomepageBeautyProduct[];
}) {
  const { skinGoals } = HOMEPAGE_BEAUTY;

  return (
    <section id="best-sellers" className="section-pad page-x bg-white scroll-mt-24">
      <div className="max-w-content mx-auto">
        <div className="text-center section-title-gap max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-brand-gold font-semibold text-sm mb-4 tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>متقن للعناية</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso leading-snug tracking-tight">
            {skinGoals.title}
          </h2>
          <p className="mt-3 text-brand-muted">{skinGoals.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {products.map((product) => (
            <BeautyProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyWhyMutqan() {
  const { whyMutqan } = HOMEPAGE_BEAUTY;

  return (
    <section
      id="why-mutqan"
      className="section-pad page-x bg-brand-background scroll-mt-24 relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl -z-10"
        aria-hidden
      />

      <div className="max-w-content mx-auto">
        <div className="text-center section-title-gap max-w-xl mx-auto mb-6 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-brand-espresso leading-snug tracking-tight">
            {whyMutqan.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {whyMutqan.cards.map((card) => {
            const theme = WHY_MUTQAN_THEMES[card.id];
            const { Icon, accent, iconGradient, glowColor, borderHover } = theme;

            return (
              <div
                key={card.id}
                className={cn(
                  "group relative rounded-[28px] p-5 sm:p-6 md:p-7 text-center",
                  "bg-white/75 backdrop-blur-xl",
                  "border border-white/90",
                  "shadow-[0_4px_28px_rgba(15,23,42,0.05)]",
                  "transition-all duration-500 ease-out",
                  "hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)]",
                  borderHover,
                )}
              >
                <div
                  className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none"
                  aria-hidden
                />
                <div
                  className="absolute -top-12 start-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: glowColor }}
                  aria-hidden
                />

                <div
                  className={cn(
                    "relative w-14 h-14 md:w-16 md:h-16 rounded-2xl mx-auto mb-4",
                    "bg-gradient-to-br flex items-center justify-center",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_18px_rgba(15,23,42,0.05)]",
                    "transition-transform duration-500 ease-out group-hover:rotate-6 group-hover:scale-105",
                    iconGradient,
                  )}
                >
                  <Icon
                    className="w-7 h-7 md:w-8 md:h-8"
                    style={{ color: accent }}
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="text-lg md:text-xl font-bold text-brand-espresso mb-2 md:mb-3 leading-snug tracking-tight">
                  {card.title}
                </h3>

                <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed max-w-[17rem] mx-auto">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyResults() {
  const { results } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-brand-background">
      <div className="max-w-content mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-brand-espresso mb-10 tracking-tight">
          {results.headline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {results.items.map((item) => (
            <div
              key={item.period}
              className="rounded-[1.5rem] border border-brand-border/50 bg-white p-8 text-center shadow-sm"
            >
              <p className="text-sm font-bold text-brand-gold tracking-wide mb-3">{item.period}</p>
              <p className="text-brand-espresso font-semibold leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyBeforeAfter() {
  const { beforeAfter } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-white">
      <div className="max-w-content mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-brand-espresso mb-10">
          {beforeAfter.headline}
        </h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="rounded-[1.75rem] border border-brand-border/60 bg-brand-background p-8 md:p-10">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">قبل</p>
            <p className="text-lg font-semibold text-brand-espresso/80 leading-relaxed">
              {beforeAfter.before}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-brand-gold/30 bg-gradient-to-br from-white to-brand-secondary/40 p-8 md:p-10 shadow-sm">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-widest mb-3">بعد</p>
            <p className="text-lg font-semibold text-brand-espresso leading-relaxed">
              {beforeAfter.after}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyRoutine() {
  const { routine } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x bg-brand-background">
      <div className="max-w-content mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-brand-espresso mb-10">
          {routine.headline}
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {[routine.morning, routine.night].map((block) => (
            <div
              key={block.title}
              className="rounded-[1.75rem] border border-white bg-white p-8 shadow-[0_4px_24px_rgba(30,36,48,0.04)]"
            >
              <h3 className="text-xl font-extrabold text-brand-espresso mb-5">{block.title}</h3>
              <ol className="space-y-3">
                {block.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-3 text-sm text-brand-muted">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-xs font-bold text-brand-gold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyLifestyle() {
  const { lifestyle } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x relative overflow-hidden">
      <div className="max-w-content mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center rounded-[2rem] bg-gradient-to-br from-brand-secondary/60 via-white to-brand-background p-8 md:p-14 border border-brand-border/40 shadow-[0_8px_40px_rgba(15,23,42,0.06)]">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso leading-snug mb-6 tracking-tight">
              {lifestyle.headline}
            </h2>
            <p className="text-lg text-brand-muted leading-[1.9] max-w-md">
              {lifestyle.description}
            </p>
            <Link
              href="#best-sellers"
              className="btn-primary inline-flex items-center gap-2 mt-8 py-3.5 px-8"
            >
              <span>اكتشفي المجموعة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="order-1 md:order-2 relative">
            <StoreImageFrame
              src={lifestyle.image}
              alt={lifestyle.imageAlt}
              className="rounded-[1.5rem] overflow-hidden shadow-xl border border-white/60"
              variant="hero"
              sizes={STORE_IMAGE_SIZES.hero}
            />
          </div>
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
        <div className="text-center section-title-gap max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso leading-snug tracking-tight">
            {testimonials.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.items.map((review) => (
            <article
              key={review.name}
              className="bg-white rounded-[1.5rem] p-8 border border-brand-border/40 shadow-sm"
            >
              <div className="flex text-brand-gold gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[15px] text-brand-espresso leading-[1.85] mb-5 font-medium">
                {review.text}
              </p>
              <div className="pt-4 border-t border-brand-border/40">
                <p className="font-bold text-brand-espresso text-sm">{review.name}</p>
                <p className="text-xs text-brand-muted mt-0.5">{review.city}</p>
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
    <section className="section-pad page-x bg-brand-espresso text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.08),transparent_60%)]" />

      <div className="max-w-content mx-auto relative z-10">
        <div className="text-center section-title-gap">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug tracking-tight">
            {orderSteps.headline}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {orderSteps.steps.map((step, index) => (
            <div key={step.title} className="text-center relative group">
              {index < orderSteps.steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 start-0 w-full h-px bg-gradient-to-l from-brand-gold/40 to-transparent -z-10" />
              )}
              <div
                className={cn(
                  "w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full flex items-center justify-center mx-auto mb-6",
                  "bg-brand-gold/15 border border-brand-gold/40 text-brand-gold font-extrabold text-xl",
                  "group-hover:scale-105 transition-transform duration-300",
                )}
              >
                {index + 1}
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-white/65 leading-relaxed max-w-[14rem] mx-auto">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBeautyFaq() {
  return (
    <section className="section-pad page-x bg-brand-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center section-title-gap">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-espresso leading-snug">
            أسئلتك الشائعة
          </h2>
        </div>
        <FAQAccordion items={[...HOMEPAGE_BEAUTY.faq]} />
      </div>
    </section>
  );
}

export function HomeBeautyFinalCta() {
  const { finalCta } = HOMEPAGE_BEAUTY;

  return (
    <section className="section-pad page-x">
      <div className="max-w-content mx-auto">
        <div className="relative text-center rounded-[2rem] overflow-hidden p-10 md:p-16 lg:p-20 bg-gradient-to-br from-brand-espresso via-[#1a2744] to-brand-espresso shadow-[0_24px_64px_rgba(15,23,42,0.2)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.12),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-brand-gold via-brand-gold/50 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-6 leading-snug tracking-tight">
              {finalCta.headline}
            </h2>
            <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-[1.85]">
              {finalCta.description}
            </p>

            <div className="flex flex-wrap justify-center gap-5 mb-10 text-sm font-medium text-white/80">
              {finalCta.trustBadges.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-brand-gold" strokeWidth={2.5} />
                  {badge.replace("✓ ", "")}
                </span>
              ))}
            </div>

            <Link
              href="#best-sellers"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-white text-brand-espresso font-extrabold text-lg shadow-xl hover:bg-brand-secondary transition-colors duration-200"
            >
              <span>{finalCta.button}</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
