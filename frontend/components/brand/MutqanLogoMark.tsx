import { cn } from "@/lib/utils";

type MutqanLogoMarkProps = {
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
  title?: string;
};

const COLORS = {
  default: {
    forest: "#1A4731",
    gold: "#C8942E",
    cream: "#F9F8F3",
    muted: "#5A6578",
  },
  light: {
    forest: "#FFFFFF",
    gold: "#E8C06A",
    cream: "#FFFFFF",
    muted: "rgba(255,255,255,0.78)",
  },
  gold: {
    forest: "#C8942E",
    gold: "#C8942E",
    cream: "#F9F8F3",
    muted: "rgba(200,148,46,0.75)",
  },
} as const;

function LogoIcon({
  c,
  size = 60,
}: {
  c: (typeof COLORS)[keyof typeof COLORS];
  size?: number;
}) {
  const r = size / 2;
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={size}
        height={size}
        rx={size * 0.22}
        fill={c.forest}
      />
      <circle cx={r} cy={r} r={r * 0.78} stroke={c.gold} strokeWidth={1.2} opacity={0.45} fill="none" />
      <path
        d={`M${r} ${r * 0.28}C${r} ${r * 0.28} ${r + r * 0.38} ${r * 0.72} ${r + r * 0.38} ${r * 1.05}C${r + r * 0.38} ${r * 1.34} ${r + r * 0.12} ${r * 1.52} ${r} ${r * 1.52}C${r - r * 0.12} ${r * 1.52} ${r - r * 0.38} ${r * 1.34} ${r - r * 0.38} ${r * 1.05}C${r - r * 0.38} ${r * 0.72} ${r} ${r * 0.28} ${r} ${r * 0.28}Z`}
        fill={c.cream}
        fillOpacity={0.95}
      />
      <path
        d={`M${r - r * 0.08} ${r * 0.98}C${r - r * 0.08} ${r * 0.82} ${r} ${r * 0.68} ${r} ${r * 0.68}C${r} ${r * 0.68} ${r + r * 0.08} ${r * 0.82} ${r + r * 0.08} ${r * 0.98}C${r + r * 0.08} ${r * 1.08} ${r} ${r * 1.12} ${r - r * 0.08} ${r * 1.08}Z`}
        fill={c.gold}
        opacity={0.55}
      />
      <circle cx={r + r * 0.42} cy={r * 0.38} r={r * 0.07} fill={c.gold} />
    </g>
  );
}

/**
 * Mutqan — memorable Korean skincare mark: green square + cream drop + gold accent.
 */
export function MutqanLogoMark({
  variant = "default",
  orientation = "horizontal",
  className,
  title = "متقن — بوسترات كورية",
}: MutqanLogoMarkProps) {
  const c = COLORS[variant];
  const viewBox =
    orientation === "icon"
      ? "0 0 96 96"
      : orientation === "stacked"
        ? "0 0 160 176"
        : "0 0 300 96";

  const iconSize = orientation === "icon" ? 60 : 60;
  const iconX =
    orientation === "horizontal" ? 8 : orientation === "stacked" ? 50 : 18;
  const iconY =
    orientation === "horizontal" ? 18 : orientation === "stacked" ? 12 : 18;

  const arabicX = orientation === "horizontal" ? 168 : 80;
  const arabicY = orientation === "horizontal" ? 40 : 118;
  const tagX = orientation === "horizontal" ? 168 : 80;
  const tagY = orientation === "horizontal" ? 66 : 148;

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

      <g transform={`translate(${iconX} ${iconY})`}>
        <LogoIcon c={c} size={iconSize} />
      </g>

      {orientation !== "icon" && (
        <g>
          <text
            x={arabicX}
            y={arabicY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.forest}
            style={{
              fontFamily:
                "'Tajawal', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', sans-serif",
              fontSize: orientation === "horizontal" ? "36px" : "38px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
            }}
          >
            متقن
          </text>
          <text
            x={tagX}
            y={tagY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.muted}
            style={{
              fontFamily: "'Tajawal', 'IBM Plex Sans Arabic', sans-serif",
              fontSize: orientation === "horizontal" ? "11px" : "10px",
              fontWeight: 600,
              letterSpacing: "0.12em",
            }}
          >
            بوسترات كورية
          </text>
        </g>
      )}
    </svg>
  );
}
