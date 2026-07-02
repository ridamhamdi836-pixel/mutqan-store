import { cn } from "@/lib/utils";

type MutqanLogoMarkProps = {
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
  title?: string;
};

const COLORS = {
  default: {
    primary: "#1E2430",
    gold: "#C9A96A",
    ivory: "#FAF8F5",
    latin: "#6B7280",
  },
  light: {
    primary: "#FFFFFF",
    gold: "#C9A96A",
    ivory: "#FAF8F5",
    latin: "rgba(255,255,255,0.72)",
  },
  gold: {
    primary: "#C9A96A",
    gold: "#C9A96A",
    ivory: "#FAF8F5",
    latin: "rgba(201,169,106,0.72)",
  },
} as const;

/**
 * Premium Korean skincare identity — drop, glow, and minimal luxury mark.
 */
export function MutqanLogoMark({
  variant = "default",
  orientation = "horizontal",
  className,
  title = "متقن — عناية كورية فاخرة",
}: MutqanLogoMarkProps) {
  const c = COLORS[variant];
  const viewBox =
    orientation === "icon"
      ? "0 0 96 96"
      : orientation === "stacked"
        ? "0 0 148 172"
        : "0 0 320 96";
  const iconTransform =
    orientation === "horizontal"
      ? "translate(236 18)"
      : orientation === "stacked"
        ? "translate(50 12)"
        : "translate(18 18)";
  const arabicX = orientation === "horizontal" ? "145" : "74";
  const arabicY = orientation === "horizontal" ? "42" : "116";
  const latinX = orientation === "horizontal" ? "144" : "74";
  const latinY = orientation === "horizontal" ? "69" : "146";

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

      <g transform={iconTransform}>
        {/* Soft glow ring */}
        <circle cx="30" cy="30" r="26" stroke={c.gold} strokeWidth="1" opacity="0.35" />
        {/* Drop — skincare essence */}
        <path
          d="M30 8C30 8 44 24 44 36C44 46.493 37.732 54 30 54C22.268 54 16 46.493 16 36C16 24 30 8 30 8Z"
          stroke={c.primary}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={c.ivory}
          fillOpacity="0.5"
        />
        {/* Inner glow highlight */}
        <path
          d="M26 32C26 28.5 28 24 30 20C32 24 34 28.5 34 32C34 35.5 32.2 38 30 38C27.8 38 26 35.5 26 32Z"
          fill={c.gold}
          opacity="0.45"
        />
        {/* Spark — subtle luxury accent */}
        <path
          d="M48 12L49.2 15.2L52.4 16.4L49.2 17.6L48 20.8L46.8 17.6L43.6 16.4L46.8 15.2L48 12Z"
          fill={c.gold}
        />
        {/* Leaf whisper */}
        <path
          d="M10 40C14 36 18 36 20 40C18 44 14 44 10 40Z"
          stroke={c.gold}
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {orientation !== "icon" && (
        <g>
          <text
            x={arabicX}
            y={arabicY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.primary}
            style={{
              fontFamily:
                "'Aref Ruqaa', 'Noto Nastaliq Urdu', 'IBM Plex Sans Arabic', 'Tajawal', 'Noto Sans Arabic', sans-serif",
              fontSize: orientation === "horizontal" ? "38px" : "40px",
              fontWeight: 700,
              letterSpacing: "-0.055em",
            }}
          >
            متقن
          </text>
          <text
            x={latinX}
            y={latinY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={c.latin}
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: orientation === "horizontal" ? "8px" : "7.5px",
              fontWeight: 500,
              letterSpacing: "0.38em",
            }}
          >
            KOREAN SKINCARE
          </text>
        </g>
      )}
    </svg>
  );
}
