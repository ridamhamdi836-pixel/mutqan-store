import { cn } from "@/lib/utils";

type MutqanLogoMarkProps = {
  variant?: "default" | "light";
  className?: string;
  title?: string;
};

const COLORS = {
  default: {
    dot: "#22D3EE",
    arabic: "#0F172A",
    latin: "#64748B",
  },
  light: {
    dot: "#22D3EE",
    arabic: "#FFFFFF",
    latin: "#CBD5E1",
  },
} as const;

/**
 * Vector Mutqan mark — one source for header, footer, admin (no raster edges).
 */
export function MutqanLogoMark({
  variant = "default",
  className,
  title = "مُتقن — Mutqan",
}: MutqanLogoMarkProps) {
  const c = COLORS[variant];

  return (
    <svg
      viewBox="0 8 100 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("block h-full w-full", className)}
    >
      <title>{title}</title>
      <circle cx="50" cy="24" r="7" fill={c.dot} />
      <text
        x="50"
        y="42"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.arabic}
        style={{
          fontFamily:
            "'IBM Plex Sans Arabic', 'Tajawal', 'Noto Sans Arabic', sans-serif",
          fontSize: "28px",
          fontWeight: 700,
        }}
      >
        مُتقن
      </text>
      <text
        x="50"
        y="64"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.latin}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.26em",
        }}
      >
        MUTQAN
      </text>
    </svg>
  );
}
