"use client";

import { useEffect, useMemo, useState } from "react";
import { Circle } from "lucide-react";
import { useStorefront } from "@/providers/storefront-provider";

const MINUTES = [1, 3, 5, 8] as const;

export function ThankYouLiveActivity() {
  const { shippingCities, locale, t } = useStorefront();
  const [visible, setVisible] = useState(false);

  const orders = useMemo(
    () =>
      MINUTES.map((minutesAgo, index) => ({
        city: shippingCities[index] ?? shippingCities[0],
        minutesAgo,
      })),
    [shippingCities],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`card p-4 md:p-5 text-start border-brand-trust/20 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-trust opacity-60" />
          <Circle className="relative w-2.5 h-2.5 fill-brand-trust text-brand-trust" />
        </span>
        <h2 className="font-bold text-sm md:text-base text-brand-espresso">
          {t("thankYouLiveTitle")}
        </h2>
      </div>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li
            key={`${order.city}-${order.minutesAgo}`}
            className="flex items-center justify-between gap-3 text-sm py-2 border-b border-brand-border/40 last:border-0"
          >
            <span className="text-brand-espresso font-medium">
              {t("thankYouLiveOrderFrom")} {order.city}
            </span>
            <span className="text-xs text-brand-muted tabular-nums whitespace-nowrap">
              {locale === "en" ? (
                <>
                  {order.minutesAgo}{" "}
                  {order.minutesAgo === 1 ? t("thankYouMinute") : t("thankYouMinutes")} ago
                </>
              ) : (
                <>
                  {t("thankYouMinutesAgo")} {order.minutesAgo}{" "}
                  {order.minutesAgo === 1 ? t("thankYouMinute") : t("thankYouMinutes")}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
