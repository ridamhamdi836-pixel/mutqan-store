"use client";

import { Truck, CreditCard, CheckCircle, MessageCircle } from "lucide-react";
import { useStorefront } from "@/providers/storefront-provider";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  compact?: boolean;
  className?: string;
}

export function TrustBadges({ compact = false, className }: TrustBadgesProps) {
  const { t, locale } = useStorefront();
  const en = locale === "en";

  const BADGES = [
    {
      icon: CreditCard,
      label: t("footerCod"),
      sub: en ? "No online payment now" : "بدون دفع إلكتروني الآن",
    },
    {
      icon: CheckCircle,
      label: en ? "Confirm before shipping" : "تأكيد قبل الشحن",
      sub: en ? "We contact you before dispatch" : "نتواصل معك قبل التجهيز",
    },
    {
      icon: Truck,
      label: t("deliveryBadge"),
      sub: en ? "2–5 business days" : "2-5 أيام عمل",
    },
    {
      icon: MessageCircle,
      label: t("footerWhatsapp"),
      sub: en ? "Mutqan team at your service" : "فريق متقن في خدمتك",
    },
  ];

  if (compact) {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        {BADGES.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5 text-xs text-brand-muted font-medium">
            <b.icon className="w-3.5 h-3.5 text-brand-trust flex-shrink-0" />
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {BADGES.map((b) => (
        <div key={b.label} className="card p-4 text-center flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-trust/10 flex items-center justify-center">
            <b.icon className="w-5 h-5 text-brand-trust" />
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-espresso">{b.label}</p>
            <p className="text-xs text-brand-muted mt-0.5">{b.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
