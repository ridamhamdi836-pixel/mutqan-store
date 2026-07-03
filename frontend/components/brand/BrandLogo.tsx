"use client";

import { useEffect, useState } from "react";
import { MutqanLogoMark } from "@/components/brand/MutqanLogoMark";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  /** default = dark text (header). light = for dark backgrounds */
  variant?: "default" | "light" | "gold";
  orientation?: "horizontal" | "stacked" | "icon";
  className?: string;
};

function defaultLogoSrc(variant: BrandLogoProps["variant"]) {
  return variant === "light" ? BRAND.logoSrcLight : BRAND.logoSrc;
}

/** Consistent store logo — transparent PNG from brand config; API can override. */
export function BrandLogo({
  variant = "default",
  orientation = "horizontal",
  className,
}: BrandLogoProps) {
  const [logo, setLogo] = useState(defaultLogoSrc(variant));

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
        } else {
          setLogo(defaultLogoSrc(variant));
        }
      })
      .catch(() => {
        if (active) setLogo(defaultLogoSrc(variant));
      });

    return () => {
      active = false;
    };
  }, [variant]);

  if (orientation === "icon") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center bg-transparent",
          className,
        )}
      >
        <MutqanLogoMark variant={variant} orientation="icon" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center bg-transparent",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={`${BRAND.nameEn} Beauty`}
        className="h-full w-full object-contain object-left"
      />
    </span>
  );
}
