"use client";

export type PresetRange = "today" | "7d" | "30d" | "custom";

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function getRangeFromPreset(preset: PresetRange, customFrom?: string, customTo?: string) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date();
  if (preset === "today") {
    from.setHours(0, 0, 0, 0);
  } else if (preset === "7d") {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  } else if (preset === "30d") {
    from.setDate(from.getDate() - 29);
    from.setHours(0, 0, 0, 0);
  } else if (preset === "custom" && customFrom) {
    return {
      from: new Date(`${customFrom}T00:00:00`).toISOString(),
      to: customTo
        ? new Date(`${customTo}T23:59:59`).toISOString()
        : to.toISOString(),
      fromInput: customFrom,
      toInput: customTo || toDateInput(to),
    };
  } else {
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);
  }
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    fromInput: toDateInput(from),
    toInput: toDateInput(to),
  };
}

interface DateRangeControlsProps {
  preset: PresetRange;
  fromInput: string;
  toInput: string;
  onPresetChange: (p: PresetRange) => void;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

export function DateRangeControls({
  preset,
  fromInput,
  toInput,
  onPresetChange,
  onFromChange,
  onToChange,
}: DateRangeControlsProps) {
  const presets: { id: PresetRange; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7d", label: "7 days" },
    { id: "30d", label: "30 days" },
    { id: "custom", label: "Custom" },
  ];

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex rounded-lg border border-slate-700 overflow-hidden">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPresetChange(p.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              preset === p.id
                ? "bg-slate-700 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromInput}
            onChange={(e) => onFromChange(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
          <span className="text-slate-500">→</span>
          <input
            type="date"
            value={toInput}
            onChange={(e) => onToChange(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          />
        </div>
      )}
    </div>
  );
}
