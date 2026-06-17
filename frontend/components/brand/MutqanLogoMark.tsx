import { cn } from "@/lib/utils";

type MutqanLogoMarkProps = {
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
  title?: string;
};

const COLORS = {
  default: {
    primary: "#07152F",
    gold: "#D4AF37",
    rose: "#E8C7B7",
    latin: "#64748B",
  },
  light: {
    primary: "#FFFFFF",
    gold: "#D4AF37",
    rose: "#E8C7B7",
    latin: "rgba(255,255,255,0.72)",
  },
  gold: {
    primary: "#D4AF37",
    gold: "#D4AF37",
    rose: "#E8C7B7",
    latin: "rgba(212,175,55,0.72)",
  },
} as const;

/**
 * Luxury beauty identity mark — one SVG source for header, footer, admin, and brand assets.
 */
export function MutqanLogoMark({
  variant = "default",
  orientation = "horizontal",
  className,
  title = "متقن — Mutqan",
}: MutqanLogoMarkProps) {
  const c = COLORS[variant];
  const gradientId = `mutqan-icon-gold-${variant}-${orientation}`;
  const viewBox =
    orientation === "icon"
      ? "0 0 96 96"
      : orientation === "stacked"
        ? "0 0 148 164"
        : "0 0 300 96";

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("block h-full w-full", className)}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradientId} x1="18" y1="14" x2="78" y2="82" gradientUnits="userSpaceOnUse">
          <stop stopColor={c.rose} />
          <stop offset="0.48" stopColor={c.gold} />
          <stop offset="1" stopColor="#B89124" />
        </linearGradient>
      </defs>

      <g
        transform={
          orientation === "horizontal"
            ? "translate(204 0)"
            : orientation === "stacked"
              ? "translate(26 0)"
              : "translate(0 0)"
        }
      >
        <path
          d="M48 8L82 28V68L48 88L14 68V28L48 8Z"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M27 54C33 37 42 29 48 29C54 29 63 37 69 54"
          stroke={c.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 62V42L48 58L64 42V62"
          stroke={c.primary}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M48 23C44 31 44 38 48 45C52 38 52 31 48 23Z"
          fill={c.rose}
          opacity="0.9"
        />
        <path
          d="M73 18L75 23L80 25L75 27L73 32L71 27L66 25L71 23L73 18Z"
          fill={c.gold}
        />
      </g>

      {orientation !== "icon" && (
        <g transform={orientation === "horizontal" ? "translate(0 0)" : "translate(0 94)"}>
          <text
            x={orientation === "horizontal" ? "138" : "74"}
            y={orientation === "horizontal" ? "43" : "28"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.primary}
            style={{
              fontFamily:
                "'IBM Plex Sans Arabic', 'Tajawal', 'Noto Sans Arabic', sans-serif",
              fontSize: orientation === "horizontal" ? "34px" : "32px",
              fontWeight: 800,
              letterSpacing: "-0.035em",
            }}
          >
            متقن
          </text>
          <text
            x={orientation === "horizontal" ? "137" : "74"}
            y={orientation === "horizontal" ? "69" : "54"}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.latin}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: orientation === "horizontal" ? "10px" : "9px",
              fontWeight: 600,
              letterSpacing: "0.42em",
            }}
          >
            MUTQAN
          </text>
        </g>
      )}
    </svg>
  );
}
