import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Gem,
  Sparkles,
  Heart,
  Shield,
  Truck,
  CreditCard,
  ShieldCheck,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { ABOUT_BEAUTY, ABOUT_NAVY } from "@/config/about-beauty";
import { WHATSAPP_URL } from "@/config/brand";
import { cn } from "@/lib/utils";

type CardTheme = {
  Icon: LucideIcon;
  accent: string;
  gradient: string;
  borderHover: string;
};

const DIFFERENTIATOR_THEMES: Record<string, CardTheme> = {
  quality: {
    Icon: Gem,
    accent: "#D4AF37",
    gradient: "from-[#D4AF37]/28 via-[#D4AF37]/10 to-white",
    borderHover: "hover:border-[#D4AF37]/30",
  },
  elegance: {
    Icon: Sparkles,
    accent: "#C9A87C",
    gradient: "from-[#EADBC8]/80 via-[#FAF8F6] to-white",
    borderHover: "hover:border-[#C9A87C]/35",
  },
  comfort: {
    Icon: Heart,
    accent: "#E8A4A4",
    gradient: "from-[#E8A4A4]/30 via-[#E8A4A4]/8 to-white",
    borderHover: "hover:border-[#E8A4A4]/35",
  },
  trust: {
    Icon: Shield,
    accent: "#2563EB",
    gradient: "from-[#2563EB]/22 via-[#2563EB]/8 to-white",
    borderHover: "hover:border-[#2563EB]/30",
  },
};

const EXPERIENCE_THEMES: Record<string, CardTheme> = {
  shipping: {
    Icon: Truck,
    accent: "#10B981",
    gradient: "from-[#10B981]/22 via-[#10B981]/8 to-white",
    borderHover: "hover:border-[#10B981]/30",
  },
  cod: {
    Icon: CreditCard,
    accent: ABOUT_NAVY,
    gradient: "from-[#07152F]/12 via-[#07152F]/4 to-white",
    borderHover: "hover:border-[#07152F]/20",
  },
  guarantee: {
    Icon: ShieldCheck,
    accent: "#D4AF37",
    gradient: "from-[#D4AF37]/22 via-[#D4AF37]/8 to-white",
    borderHover: "hover:border-[#D4AF37]/30",
  },
  support: {
    Icon: MessageCircle,
    accent: "#25D366",
    gradient: "from-[#25D366]/18 via-[#25D366]/6 to-white",
    borderHover: "hover:border-[#25D366]/25",
  },
};

function PremiumBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-5 py-2 text-sm font-medium tracking-wide",
        className,
      )}
    >
      {children}
    </span>
  );
}

function GlassCard({
  children,
  className,
  borderHover,
}: {
  children: ReactNode;
  className?: string;
  borderHover?: string;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-[32px] bg-white/80 backdrop-blur-xl",
        "border border-white/90 shadow-[0_4px_32px_rgba(7,21,47,0.06)]",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(7,21,47,0.10)]",
        borderHover,
        className,
      )}
    >
      <div
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none"
        aria-hidden
      />
      {children}
    </div>
  );
}

function IconTile({ theme }: { theme: CardTheme }) {
  const { Icon, accent, gradient } = theme;
  return (
    <div
      className={cn(
        "w-14 h-14 md:w-16 md:h-16 rounded-2xl mx-auto mb-5",
        "bg-gradient-to-br flex items-center justify-center",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_6px_20px_rgba(7,21,47,0.05)]",
        "transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105",
        gradient,
      )}
    >
      <Icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: accent }} strokeWidth={1.5} />
    </div>
  );
}

export function AboutBeautyPage() {
  const { hero, philosophy, story, differentiators, promise, experience, finalCta } =
    ABOUT_BEAUTY;

  return (
    <div className="bg-white">
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden page-x py-16 md:py-24 lg:py-28"
        style={{ backgroundColor: ABOUT_NAVY }}
      >
        <div
          className="absolute top-0 end-0 w-[480px] h-[480px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 start-0 w-[360px] h-[360px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }}
          aria-hidden
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" aria-hidden />

        <div className="max-w-content mx-auto text-center relative z-10 animate-fade-in">
          <PremiumBadge className="bg-white/10 text-white/95 border border-[#D4AF37]/30 mb-8 md:mb-10">
            {hero.badge}
          </PremiumBadge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 md:mb-8 tracking-tight leading-tight">
            {hero.title}
          </h1>

          <p className="text-base md:text-xl lg:text-[1.35rem] text-white/75 max-w-2xl mx-auto leading-[1.95] font-light">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="section-pad page-x bg-white">
        <div className="max-w-3xl mx-auto text-center animate-slide-up">
          <PremiumBadge className="bg-[#D4AF37]/10 text-[#07152F] border border-[#D4AF37]/25 mb-6 md:mb-8">
            {philosophy.badge}
          </PremiumBadge>

          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-[#07152F] mb-8 md:mb-10 leading-snug tracking-tight">
            {philosophy.title}
          </h2>

          <div className="space-y-6 md:space-y-7">
            {philosophy.paragraphs.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "text-base md:text-lg lg:text-xl text-brand-muted leading-[2]",
                  i === philosophy.paragraphs.length - 1 && "text-[#07152F]/80 font-medium",
                )}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="section-pad page-x bg-brand-background">
        <div className="max-w-content mx-auto">
          <GlassCard className="p-8 md:p-12 lg:p-16 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#07152F] mb-8 md:mb-10 text-center tracking-tight">
              {story.title}
            </h2>
            <div className="space-y-6 md:space-y-7">
              {story.paragraphs.map((p, i) => (
                <p key={i} className="text-base md:text-lg text-brand-muted leading-[1.95] text-center">
                  {p}
                </p>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── DIFFERENTIATORS ── */}
      <section className="section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#07152F] text-center mb-10 md:mb-14 tracking-tight">
            {differentiators.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {differentiators.items.map((item) => {
              const theme = DIFFERENTIATOR_THEMES[item.id];
              return (
                <GlassCard
                  key={item.id}
                  borderHover={theme.borderHover}
                  className="p-6 md:p-8 text-center"
                >
                  <IconTile theme={theme} />
                  <h3 className="text-lg md:text-xl font-bold text-[#07152F] mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-[15px] text-brand-muted leading-relaxed">
                    {item.desc}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROMISE ── */}
      <section className="section-pad page-x bg-brand-background">
        <div className="max-w-3xl mx-auto">
          <GlassCard
            className="p-10 md:p-14 lg:p-16 text-center border-[#D4AF37]/15"
            borderHover="hover:border-[#D4AF37]/25"
          >
            <PremiumBadge className="bg-[#D4AF37]/10 text-[#07152F] border border-[#D4AF37]/20 mb-6 md:mb-8">
              {promise.badge}
            </PremiumBadge>

            <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-extrabold text-[#07152F] mb-8 md:mb-10 leading-snug tracking-tight">
              {promise.title}
            </h2>

            <div className="space-y-5 md:space-y-6">
              {promise.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-base md:text-lg text-brand-muted leading-[1.95]",
                    i === promise.paragraphs.length - 1 &&
                      "text-[#07152F] font-semibold text-lg md:text-xl",
                  )}
                >
                  {p}
                </p>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── CUSTOMER EXPERIENCE ── */}
      <section className="section-pad page-x bg-white">
        <div className="max-w-content mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#07152F] text-center mb-10 md:mb-14 tracking-tight">
            {experience.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
            {experience.items.map((item) => {
              const theme = EXPERIENCE_THEMES[item.id];
              return (
                <GlassCard
                  key={item.id}
                  borderHover={theme.borderHover}
                  className="p-6 md:p-8 text-center"
                >
                  <IconTile theme={theme} />
                  <h3 className="text-base md:text-lg font-bold text-[#07152F] leading-snug">
                    {item.title}
                  </h3>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section-pad page-x pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative rounded-[32px] overflow-hidden p-10 md:p-14 lg:p-16 text-center shadow-[0_24px_64px_rgba(7,21,47,0.18)]"
            style={{ backgroundColor: ABOUT_NAVY }}
          >
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 70% 20%, rgba(212,175,55,0.18) 0%, transparent 55%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" aria-hidden />

            <div className="relative z-10">
              <PremiumBadge className="bg-white/10 text-white/90 border border-[#D4AF37]/30 mb-6 md:mb-8">
                {finalCta.badge}
              </PremiumBadge>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 md:mb-6 tracking-tight leading-snug">
                {finalCta.title}
              </h2>

              <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-[1.9] mb-9 md:mb-11">
                {finalCta.paragraph}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href={finalCta.primaryHref}
                  className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-[#07152F] font-bold text-base shadow-lg hover:bg-[#EADBC8] transition-colors duration-300"
                >
                  <span>{finalCta.primaryLabel}</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <a
                  href={WHATSAPP_URL("مرحباً، أود التواصل مع فريق مُتقن")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 rounded-2xl border-2 border-white/25 text-white font-semibold text-base hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                  <span>{finalCta.secondaryLabel}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
