import { CreditCard, ShieldCheck, Truck } from "lucide-react";

const CHIPS = [
  { icon: CreditCard, label: "دفع عند الاستلام" },
  { icon: Truck, label: "شحن سريع للسعودية" },
  { icon: ShieldCheck, label: "ضمان 30 يوم" },
] as const;

export function ProductTrustChips() {
  return (
    <div className="flex flex-wrap gap-2">
      {CHIPS.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 rounded-pill bg-brand-beige/80 border border-brand-border/60 px-3 py-1.5 text-xs font-bold text-brand-espresso"
        >
          <Icon className="w-3.5 h-3.5 text-brand-trust shrink-0" />
          {label}
        </span>
      ))}
    </div>
  );
}
