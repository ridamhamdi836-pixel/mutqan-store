import { cn } from "@/lib/utils";

type MutqanLogoMarkProps = {
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
  title?: string;
};

const COLORS = {
  default: {
    primary: "#08152D",
    gold: "#D4AF37",
    ivory: "#FAF8F1",
    latin: "#5F6675",
  },
  light: {
    primary: "#FFFFFF",
    gold: "#D4AF37",
    ivory: "#FAF8F1",
    latin: "rgba(255,255,255,0.72)",
  },
  gold: {
    primary: "#D4AF37",
    gold: "#D4AF37",
    ivory: "#FAF8F1",
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
        <path
          d="M30 2C33 18 42 27 58 30C42 33 33 42 30 58C27 42 18 33 2 30C18 27 27 18 30 2Z"
          stroke={c.gold}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30 20L40 30L30 40L20 30L30 20Z"
          stroke={c.primary}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46 8L47.5 12.5L52 14L47.5 15.5L46 20L44.5 15.5L40 14L44.5 12.5L46 8Z"
          fill={c.gold}
        />
        <path
          d="M12 44L13.2 47.8L17 49L13.2 50.2L12 54L10.8 50.2L7 49L10.8 47.8L12 44Z"
          fill={c.gold}
          opacity="0.72"
        />
        <path
          d="M30 2C30 16 30 44 30 58"
          stroke={c.ivory}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.65"
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
              fontSize: orientation === "horizontal" ? "9.5px" : "9px",
              fontWeight: 400,
              letterSpacing: "0.5em",
            }}
          >
            MUTQAN
          </text>
        </g>
      )}
    </svg>
  );
}
