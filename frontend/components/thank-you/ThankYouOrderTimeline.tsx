import { Phone, Package, Truck } from "lucide-react";

const STEPS = [
  {
    icon: Phone,
    title: "نؤكد الطلب خلال دقائق",
    desc: "ردّ على الاتصال لنثبت العنوان والكمية",
  },
  {
    icon: Package,
    title: "نجهّز الشحنة",
    desc: "تجهيز خلال 1–2 يوم عمل بعد التأكيد",
  },
  {
    icon: Truck,
    title: "يصل الطلب خلال 2–5 أيام",
    desc: "توصيل للمدن الرئيسية — الدفع عند الاستلام",
  },
] as const;

export function ThankYouOrderTimeline() {
  return (
    <div className="card p-5 md:p-6 text-start">
      <h2 className="font-bold text-brand-espresso text-base md:text-lg mb-5">
        ماذا يحدث الآن؟
      </h2>
      <ol className="relative space-y-0">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === STEPS.length - 1;
          return (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast ? (
                <span
                  className="absolute top-10 bottom-0 start-[1.125rem] w-0.5 bg-brand-border"
                  aria-hidden
                />
              ) : null}
              <div className="relative z-10 w-9 h-9 rounded-full bg-brand-bronze text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-brand-bronze/20">
                <Icon className="w-4 h-4" />
              </div>
              <div className="pt-0.5 min-w-0">
                <p className="font-bold text-sm md:text-base text-brand-espresso">
                  {step.title}
                </p>
                <p className="text-xs md:text-sm text-brand-muted mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
