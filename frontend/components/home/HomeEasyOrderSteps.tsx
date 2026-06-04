import Link from "next/link";
import {
  ArrowLeft,
  MousePointerClick,
  Phone,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "اختر واطلب",
    text: "اختر المنتج واضغط «تسوق الآن» — اسمك ورقم جوالك فقط، بدون بطاقة بنكية.",
  },
  {
    icon: Phone,
    title: "نتصل ونؤكد",
    text: "فريق متقن يتصل لتأكيد طلبك — الرد ضروري لبدء تجهيز الشحنة (قد يظهر الرقم غير معروف).",
  },
  {
    icon: Banknote,
    title: "استلم وادفع",
    text: "نوصّل لبابك وتدفع نقداً للمندوب فقط عند الاستلام — بدون دفع مقدّم.",
  },
] as const;

type HomeEasyOrderStepsProps = {
  variant?: "hero" | "featured";
  className?: string;
};

export function HomeEasyOrderSteps({
  variant = "featured",
  className,
}: HomeEasyOrderStepsProps) {
  if (variant === "hero") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-brand-border/70 bg-gradient-to-l from-brand-beige/90 to-white p-4 md:p-5",
          className,
        )}
      >
        <p className="text-xs md:text-sm font-bold text-brand-bronze mb-3">
          طلبك في 3 خطوات — بدون بطاقة بنكية
        </p>
        <ol className="space-y-2.5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-bronze text-white text-xs font-black flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-xs md:text-sm text-brand-espresso font-medium leading-snug pt-0.5">
                {step.text.split(" — ")[0]}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "py-10 md:py-14 page-x bg-gradient-to-b from-brand-beige/50 via-white to-white border-y border-brand-border/50",
        className,
      )}
    >
      <div className="max-w-content mx-auto">
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-8 md:gap-12 items-center">
          {/* Visual — أيقونات الخطوات */}
          <div className="order-2 md:order-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-xs md:max-w-sm">
              <div
                className="absolute top-8 bottom-8 end-7 w-0.5 bg-brand-bronze/20 hidden sm:block"
                aria-hidden
              />
              <ul className="space-y-4 sm:space-y-5">
                {STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    className="flex items-center gap-4 rounded-2xl border border-brand-border/60 bg-white p-4 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-bronze/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-brand-bronze" />
                    </div>
                    <div className="min-w-0 text-start">
                      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wide">
                        الخطوة {i + 1}
                      </p>
                      <p className="text-sm font-extrabold text-brand-espresso">
                        {step.title}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 justify-center md:justify-end text-xs font-bold text-brand-trust">
                <ShieldCheck className="w-4 h-4" />
                ضمان 30 يوم · دفع عند الاستلام فقط
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="order-1 md:order-2 text-start space-y-5">
            <div>
              <p className="text-sm font-bold text-brand-bronze mb-2">
                لماذا يختارون متقن؟
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-espresso leading-snug">
                طلبك أسهل مما تتخيل —
                <span className="text-brand-bronze"> 3 خطوات فقط</span>
              </h2>
              <p className="text-base md:text-lg text-brand-muted leading-relaxed mt-3 max-w-lg">
                بدون حساب معقد، بدون دفع إلكتروني، وبدون مفاجآت. متقن صُمم
                لبيوت الخليج اللي تبي تطلب براحة وتثق.
              </p>
            </div>

            <ol className="space-y-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-bronze text-white text-sm font-black flex items-center justify-center shadow-md shadow-brand-bronze/20">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-brand-espresso text-sm md:text-base">
                      {step.text.split(" — ")[0]}
                    </p>
                    <p className="text-xs md:text-sm text-brand-muted leading-relaxed mt-1">
                      {step.text.includes(" — ")
                        ? step.text.split(" — ").slice(1).join(" — ")
                        : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <Link
              href="/collections"
              className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[52px] px-8 text-base font-bold shadow-lg"
            >
              ابدأ طلبك الآن — بدون بطاقة
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
