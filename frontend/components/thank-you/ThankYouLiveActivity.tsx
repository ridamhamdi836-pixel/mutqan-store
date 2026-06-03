"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { THANK_YOU_LIVE_ORDERS } from "@/config/thank-you";

export function ThankYouLiveActivity() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
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
          آخر الطلبات المؤكدة اليوم
        </h2>
      </div>
      <ul className="space-y-3">
        {THANK_YOU_LIVE_ORDERS.map((order) => (
          <li
            key={order.city}
            className="flex items-center justify-between gap-3 text-sm py-2 border-b border-brand-border/40 last:border-0"
          >
            <span className="text-brand-espresso font-medium">
              طلب من {order.city}
            </span>
            <span className="text-xs text-brand-muted tabular-nums whitespace-nowrap">
              قبل {order.minutesAgo}{" "}
              {order.minutesAgo === 1 ? "دقيقة" : "دقائق"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
