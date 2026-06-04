import { CreditCard, ShieldCheck, Phone } from "lucide-react";

const ITEMS = [
  { icon: CreditCard, label: "دفع عند الاستلام" },
  { icon: ShieldCheck, label: "ضمان 30 يوم" },
  { icon: Phone, label: "تأكيد قبل الشحن" },
] as const;

/** Compact in-flow trust row — no grid layers (mobile-safe) */
export function ProductHeroTrust() {
  return (
    <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
      {ITEMS.map((item) => (
        <li
          key={item.label}
          className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-brand-espresso"
        >
          <item.icon className="w-3.5 h-3.5 text-brand-trust shrink-0" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
