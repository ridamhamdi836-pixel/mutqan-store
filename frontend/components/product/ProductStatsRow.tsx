import { PDP_STATS } from "@/config/product-page";

export function ProductStatsRow() {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3">
      {PDP_STATS.map((s) => (
        <div
          key={s.label}
          className="rounded-xl bg-white border border-brand-border/60 py-3 px-2 text-center"
        >
          <p className="text-sm md:text-base font-black text-brand-espresso">
            {s.value}
          </p>
          <p className="text-[10px] md:text-xs text-brand-muted mt-0.5">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}
