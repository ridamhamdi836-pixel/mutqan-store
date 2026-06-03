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
      viewBox="0 0 100 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("block h-full w-full", className)}
    >
      <title>{title}</title>
      <circle cx="50" cy="13" r="7.5" fill={c.dot} />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.arabic}
        style={{
          fontFamily:
            "'IBM Plex Sans Arabic', 'Tajawal', 'Noto Sans Arabic', sans-serif",
          fontSize: "30px",
          fontWeight: 700,
        }}
      >
        مُتقن
      </text>
      <text
        x="50"
        y="88"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={c.latin}
        style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "0.28em",
        }}
      >
        MUTQAN
      </text>
    </svg>
  );
}
