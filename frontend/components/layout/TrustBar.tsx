"use client";

import { useEffect, useState } from "react";
import { Truck, CreditCard, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  { icon: ShieldCheck, text: "ضمان ذهبي 30 يوماً للاسترجاع" },
  { icon: CreditCard, text: "الدفع عند الاستلام وبدون مقدم" },
  { icon: Truck, text: "شحن سريع إلى المدن الرئيسية (1-2 يوم)" },
];

export function TrustBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-espresso text-brand-surface py-2 relative overflow-hidden">
      <div className="max-w-content mx-auto page-x h-6 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute flex items-center justify-center gap-2 text-xs md:text-sm font-bold text-brand-sand whitespace-nowrap"
          >
            {(() => {
              const Icon = MESSAGES[currentIndex].icon;
              return (
                <>
                  <Icon className="w-4 h-4 text-brand-bronze flex-shrink-0" />
                  <span>{MESSAGES[currentIndex].text}</span>
                </>
              );
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
