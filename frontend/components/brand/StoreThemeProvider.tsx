import type { CSSProperties, ReactNode } from "react";
import type { StoreSettingsOverride, StoreThemeSettings } from "@/types/store-dashboard";

const THEME_KEYS: Array<keyof StoreThemeSettings> = [
  "background",
  "surface",
  "beige",
  "espresso",
  "gold",
  "secondary",
  "text",
  "muted",
  "border",
  "trust",
];

function kebab(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function hexToRgb(value: string): string | null {
  const hex = value.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return `${red} ${green} ${blue}`;
}

function themeStyle(theme?: StoreThemeSettings): CSSProperties {
  if (!theme) return {};
  const style: Record<string, string> = {};

  for (const key of THEME_KEYS) {
    const value = theme[key];
    if (!value) continue;
    const cssKey = kebab(key);
    const rgb = hexToRgb(value);
    style[`--brand-${cssKey}`] = value;
    if (rgb) style[`--brand-${cssKey}-rgb`] = rgb;
    if (key === "gold") {
      style["--brand-bronze"] = value;
      if (rgb) style["--brand-bronze-rgb"] = rgb;
    }
  }

  return style as CSSProperties;
}

export function StoreThemeProvider({
  settings,
  children,
}: {
  settings: StoreSettingsOverride;
  children: ReactNode;
}) {
  return <div style={themeStyle(settings.theme)}>{children}</div>;
}
