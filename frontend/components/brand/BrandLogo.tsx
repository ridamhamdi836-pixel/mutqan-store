"use client";

import { useEffect, useState } from "react";
import { MutqanLogoMark } from "@/components/brand/MutqanLogoMark";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** default = dark text (header). light = for dark backgrounds */
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
};

/** Consistent store logo — SVG only, fills its box (set h + w on className). */
export function BrandLogo({
  variant = "default",
  orientation = "horizontal",
  className,
}: BrandLogoProps) {
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/store-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        const brand = data?.settings?.brand;
        const nextLogo =
          variant === "light" ? brand?.logoSrcLight ?? brand?.logoSrc : brand?.logoSrc;
        if (typeof nextLogo === "string" && nextLogo.trim()) {
          setLogo(nextLogo.trim());
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [variant]);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-transparent",
        className,
      )}
    >
      {logo && orientation !== "icon" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="متقن" className="h-full w-full object-contain" />
      ) : (
        <MutqanLogoMark variant={variant} orientation={orientation} />
      )}
    </span>
  );
}
