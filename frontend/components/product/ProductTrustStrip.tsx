"use client";

import { CreditCard, ShieldCheck, Truck, Phone } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";

const ITEMS = [
  { icon: CreditCard, label: "الدفع عند الاستلام" },
  { icon: ShieldCheck, label: "ضمان 30 يوم" },
  { icon: Truck, label: "شحن سريع" },
  { icon: Phone, label: "تأكيد قبل الشحن" },
] as const;

type ProductTrustStripProps = {
  variant?: "hero" | "bar";
};

export function ProductTrustStrip({ variant = "hero" }: ProductTrustStripProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (variant === "bar") {
    if (!isDesktop) return null;

    return (
      <div className="bg-brand-espresso text-brand-surface py-3">
        <div className="max-w-content mx-auto page-x flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-bold">
          {ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <item.icon className="w-4 h-4 text-brand-trust" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-md:w-full md:flex md:flex-wrap md:gap-3">
      {ITEMS.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 min-h-[40px] w-full text-[10px] leading-snug md:text-xs font-bold text-brand-espresso bg-brand-beige/80 border border-brand-border/50 px-2.5 py-2 md:py-1.5 rounded-lg"
        >
          <item.icon className="w-3.5 h-3.5 text-brand-trust shrink-0" />
          <span className="min-w-0">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
