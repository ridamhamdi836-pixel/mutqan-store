"use client";

import { CreditCard, ShieldCheck, Truck, Phone, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const HERO_ITEMS = [
  { icon: CreditCard, label: "الدفع عند الاستلام" },
  { icon: ShieldCheck, label: "ضمان 30 يوم" },
  { icon: Truck, label: "شحن سريع" },
  { icon: Phone, label: "تأكيد قبل الشحن" },
] as const;

const BAR_ITEMS: Array<{
  icon: typeof Star;
  label: string;
  iconClass?: string;
}> = [
  { icon: Star, label: "منتجات مختارة لبيوت الخليج", iconClass: "text-amber-400 fill-amber-400" },
  { icon: ShieldCheck, label: "ضمان ذهبي للاستبدال والاسترجاع" },
  { icon: CreditCard, label: "ادفع براحتك عند الاستلام" },
];

type ProductTrustStripProps = {
  variant?: "hero" | "bar";
};

export function ProductTrustStrip({ variant = "hero" }: ProductTrustStripProps) {
  if (variant === "bar") {
    return (
      <div className="bg-brand-espresso text-brand-surface py-2.5 md:py-3">
        <div className="max-w-content mx-auto page-x flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-2 text-[11px] sm:text-xs md:text-sm font-bold text-brand-sand">
          {BAR_ITEMS.map((item, index) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-brand-bronze shrink-0 mx-0.5 sm:mx-1"
                  aria-hidden
                />
              ) : null}
              <item.icon
                className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-brand-trust", item.iconClass)}
              />
              <span>{item.label}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 max-md:w-full md:flex md:flex-wrap md:gap-3">
      {HERO_ITEMS.map((item) => (
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
