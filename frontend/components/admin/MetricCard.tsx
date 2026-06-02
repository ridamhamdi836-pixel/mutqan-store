interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "default" | "green" | "amber" | "blue";
}

const accentBorder = {
  default: "border-slate-700",
  green: "border-emerald-600/50",
  amber: "border-amber-500/50",
  blue: "border-sky-500/50",
};

export function MetricCard({ label, value, hint, accent = "default" }: MetricCardProps) {
  return (
    <div
      className={`rounded-xl border bg-slate-900/60 p-5 ${accentBorder[accent]}`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
