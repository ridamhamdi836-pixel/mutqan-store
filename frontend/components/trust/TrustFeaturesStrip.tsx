"use client";

import {
  Banknote,
  FlaskConical,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { getHomepageBeauty } from "@/config/homepage-beauty-i18n";
import { useStorefront } from "@/providers/storefront-provider";
import { cn } from "@/lib/utils";

const TRUST_ICONS: Record<string, LucideIcon> = {
  shipping: Truck,
  cod: Banknote,
  guarantee: ShieldCheck,
  actives: FlaskConical,
};

type TrustFeaturesStripProps = {
  className?: string;
};

export function TrustFeaturesStrip({ className }: TrustFeaturesStripProps) {
  const { locale, t } = useStorefront();
  const { trustFooter } = getHomepageBeauty(locale);

  return (
    <section
      className={cn(
        "bg-white border-t border-brand-border/20 py-10 md:py-12 page-x",
        className,
      )}
    >
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustFooter.map((item) => {
            const Icon = TRUST_ICONS[item.id] ?? ShieldCheck;
            const title =
              item.id === "shipping" ? t("homeTrustShippingTitle") : item.title;
            return (
              <div key={item.id} className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-brand-cream/70 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-forest" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-brand-forest text-sm leading-tight mb-0.5">
                    {title}
                  </p>
                  <p className="text-xs text-brand-muted leading-snug">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
