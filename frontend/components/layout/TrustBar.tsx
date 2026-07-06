"use client";

import { useEffect, useState } from "react";
import { Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { useStorefront } from "@/providers/storefront-provider";

const ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  heart: HeartHandshake,
} as const;

export function TrustBar() {
  const { t } = useStorefront();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const messages = [
    { id: "cod-shipping", icon: "truck" as const, text: t("trustCodShipping") },
    { id: "korean-actives", icon: "shield" as const, text: t("trustActives") },
    { id: "guarantee", icon: "heart" as const, text: t("trustGuarantee") },
  ];

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 250);
    }, 4500);
    return () => {
      clearInterval(interval);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [messages.length]);

  const message = messages[currentIndex];
  const Icon = ICONS[message.icon];

  return (
    <div className="bg-brand-forest text-white py-2.5 border-b border-brand-forest/80">
      <div className="max-w-content mx-auto page-x">
        <div
          className={`flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-center transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <Icon className="w-4 h-4 shrink-0 text-white/90" strokeWidth={2} />
          <span>{message.text}</span>
        </div>
      </div>
    </div>
  );
}
