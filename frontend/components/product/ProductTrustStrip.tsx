import { CreditCard, ShieldCheck, Truck, Phone, MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/config/brand";

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
  if (variant === "bar") {
    return (
      <div className="hidden lg:block bg-brand-espresso text-brand-surface py-3">
        <div className="max-w-content mx-auto page-x flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-bold">
          {ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <item.icon className="w-4 h-4 text-brand-trust" />
              {item.label}
            </span>
          ))}
          <a
            href={WHATSAPP_URL("مرحباً، عندي استفسار عن منتج في متقن")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-trust hover:text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            دعم واتساب
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {ITEMS.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-brand-espresso bg-brand-beige/80 border border-brand-border/50 px-2.5 py-1.5 rounded-lg"
        >
          <item.icon className="w-3.5 h-3.5 text-brand-trust shrink-0" />
          {item.label}
        </span>
      ))}
      <a
        href={WHATSAPP_URL("مرحباً، عندي استفسار عن منتج في متقن")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-brand-bronze bg-brand-bronze/10 border border-brand-bronze/20 px-2.5 py-1.5 rounded-lg hover:bg-brand-bronze/15 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
        دعم واتساب
      </a>
    </div>
  );
}
