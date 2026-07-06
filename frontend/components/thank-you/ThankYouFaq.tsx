"use client";

import { FAQAccordion } from "@/components/product/FAQAccordion";
import {
  THANK_YOU_FAQ_MORE,
  THANK_YOU_FAQ_PRIORITY,
} from "@/config/thank-you";
import { useStorefront } from "@/providers/storefront-provider";
import { HelpCircle } from "lucide-react";

export function ThankYouFaq() {
  const { t } = useStorefront();

  const moreItems = THANK_YOU_FAQ_MORE.map((item) =>
    item.question === "كم مدة التوصيل؟"
      ? { ...item, answer: t("thankYouDeliveryFaqAnswer") }
      : item,
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-brand-bronze" />
        <h2 className="font-bold text-brand-espresso text-base md:text-lg">
          أسئلة سريعة قبل الاتصال
        </h2>
      </div>

      <div className="space-y-3">
        {THANK_YOU_FAQ_PRIORITY.map((item) => (
          <div
            key={item.question}
            className="card p-4 md:p-5 text-start border-brand-bronze/20 bg-gradient-to-l from-brand-bronze/5 to-white"
          >
            <h3 className="text-sm md:text-base font-bold text-brand-espresso">
              {item.question}
            </h3>
            <p className="text-sm text-brand-muted mt-2 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      <FAQAccordion items={moreItems} />
    </section>
  );
}
