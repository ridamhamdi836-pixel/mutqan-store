"use client";

import { useEffect, useState } from "react";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";

const MESSAGES = [
  { icon: ShieldCheck, text: "ضمان ذهبي 30 يوماً للاسترجاع" },
  { icon: CreditCard, text: "الدفع عند الاستلام وبدون مقدم" },
  { icon: Truck, text: "شحن سريع إلى المدن الرئيسية (1-2 يوم)" },
] as const;

export function TrustBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [rotateMessages, setRotateMessages] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setRotateMessages(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!rotateMessages) return;
    let fadeTimeout: ReturnType<typeof setTimeout> | undefined;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
        setVisible(true);
      }, 200);
    }, 4000);
    return () => {
      clearInterval(interval);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [rotateMessages]);

  const { icon: Icon, text } = MESSAGES[currentIndex];

  return (
    <div className="bg-brand-espresso text-brand-surface py-2 overflow-hidden relative z-20">
      <div className="max-w-content mx-auto page-x min-h-6 flex items-center justify-center">
        <div
          className={`flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-brand-sand whitespace-nowrap max-md:transition-none md:transition-opacity md:duration-200 ${
            visible || !rotateMessages ? "opacity-100" : "opacity-0"
          }`}
          aria-live="polite"
        >
          <Icon className="w-4 h-4 text-brand-bronze shrink-0" />
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
