import type { Config } from "tailwindcss";

const brandColor = (name: string) => `rgb(var(--brand-${name}-rgb) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-arabic)",
          "var(--font-latin)",
          "Tajawal",
          "Noto Sans Arabic",
          "system-ui",
          "sans-serif",
        ],
        arabic: ["var(--font-arabic)", "Tajawal", "Noto Sans Arabic", "sans-serif"],
        inter: ["var(--font-latin)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          background: brandColor("background"),
          surface: brandColor("surface"),
          beige: brandColor("beige"),
          sand: brandColor("sand"),
          espresso: brandColor("espresso"),
          olive: brandColor("olive"),
          bronze: brandColor("bronze"),
          gold: brandColor("gold"),
          secondary: brandColor("secondary"),
          text: brandColor("text"),
          muted: brandColor("muted"),
          border: brandColor("border"),
          trust: brandColor("trust"),
          forest: brandColor("forest"),
          cream: brandColor("cream"),
          error: brandColor("error"),
        },
      },
      borderRadius: {
        card: "18px",
        "card-lg": "24px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 8px 32px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04)",
        "btn": "0 4px 14px rgba(15, 23, 42, 0.18)",
        "btn-lg": "0 8px 24px rgba(15, 23, 42, 0.22)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
