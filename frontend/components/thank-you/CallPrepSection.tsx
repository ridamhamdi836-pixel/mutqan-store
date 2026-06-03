"use client";

import { MapPin, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import type { CallExpectation } from "@/lib/call-window";

type CallPrepSectionProps = {
  expectation: CallExpectation;
};

const STEPS = [
  {
    icon: MessageCircle,
    getLabel: (e: CallExpectation) => e.phoneStep,
  },
  {
    icon: MapPin,
    label: "جهّز عنوان التوصيل الدقيق (حي، شارع، رقم المنزل) — نثبته معك في الدقيقة.",
  },
  {
    icon: Truck,
    label: "بعد التأكيد: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام داخل المدن الرئيسية.",
  },
  {
    icon: ShieldCheck,
    label: "لم يعجبك المنتج؟ ضمان 30 يومًا — استرجاع أو استبدال بعد الاستلام.",
  },
] as const;

export function CallPrepSection({ expectation }: CallPrepSectionProps) {
  return (
    <div className="card p-5 text-start space-y-4">
      <h2 className="font-bold text-brand-espresso text-base">
        ماذا يحدث الآن؟
      </h2>
      <ol className="space-y-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const label =
            "getLabel" in step ? step.getLabel(expectation) : step.label;
          return (
            <li key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-trust/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand-trust" />
              </div>
              <p className="text-sm text-brand-muted leading-relaxed pt-1.5">
                <span className="font-bold text-brand-espresso ml-1">
                  {i + 1}.
                </span>{" "}
                {label}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
