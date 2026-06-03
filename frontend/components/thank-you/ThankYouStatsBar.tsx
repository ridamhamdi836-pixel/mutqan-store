import { Package, Star, PhoneCall } from "lucide-react";
import { THANK_YOU_STATS } from "@/config/thank-you";

const ICONS = [Package, Star, PhoneCall] as const;

export function ThankYouStatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {THANK_YOU_STATS.map((stat, i) => {
        const Icon = ICONS[i] ?? Package;
        return (
          <div
            key={stat.label}
            className="card card-lift p-4 md:p-5 text-center border-brand-border/80"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-bronze/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-brand-bronze" />
            </div>
            <p className="text-xl md:text-2xl font-black text-brand-espresso leading-none">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-brand-muted mt-2 font-medium">
              {stat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
