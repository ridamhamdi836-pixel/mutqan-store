interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "default" | "green" | "amber" | "blue";
}

const accentBorder = {
  default: "border-brand-border",
  green: "border-emerald-200 ring-1 ring-emerald-100",
  amber: "border-amber-200 ring-1 ring-amber-100",
  blue: "border-brand-bronze/30 ring-1 ring-brand-bronze/10",
};

const accentValue = {
  default: "text-brand-espresso",
  green: "text-emerald-700",
  amber: "text-amber-700",
  blue: "text-brand-bronze",
};

export function MetricCard({ label, value, hint, accent = "default" }: MetricCardProps) {
  return (
    <div className={`admin-metric-card ${accentBorder[accent]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accentValue[accent]}`}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}
