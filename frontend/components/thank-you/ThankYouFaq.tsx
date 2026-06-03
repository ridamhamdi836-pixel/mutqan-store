"use client";

import { THANK_YOU_FAQ } from "@/config/thank-you";

export function ThankYouFaq() {
  return (
    <div className="card p-5 text-start space-y-4">
      <h2 className="font-bold text-brand-espresso text-base">
        أسئلة سريعة قبل الاتصال
      </h2>
      <dl className="space-y-4">
        {THANK_YOU_FAQ.map((item) => (
          <div key={item.q}>
            <dt className="text-sm font-bold text-brand-espresso">{item.q}</dt>
            <dd className="text-sm text-brand-muted mt-1 leading-relaxed">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
