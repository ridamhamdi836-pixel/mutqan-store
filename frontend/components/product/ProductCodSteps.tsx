import { ClipboardList, Phone, Truck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "١. سجّل طلبك",
    desc: "اضغط «اطلب الآن» وأدخل اسمك ورقم جوالك — بدون بطاقة بنكية.",
  },
  {
    icon: Phone,
    title: "٢. مكالمة التأكيد",
    desc: "سيتصل بك فريق متقن على رقم الطلب لتأكيد العنوان والكمية. قد يظهر الرقم «غير معروف» — هذا نحن.",
  },
  {
    icon: Truck,
    title: "٣. التوصيل والدفع",
    desc: "بعد التأكيد نجهّز طلبك ونوصّله لبابك. تدفع للمندوب فقط عند الاستلام.",
  },
] as const;

export function ProductCodSteps() {
  return (
    <div className="rounded-2xl border border-brand-border/70 bg-gradient-to-l from-brand-beige/90 to-white p-4 space-y-3">
      <p className="text-xs font-bold text-brand-bronze">ماذا يحدث بعد الطلب؟</p>
      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li key={step.title} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-trust/10 flex items-center justify-center shrink-0">
              <step.icon className="w-4 h-4 text-brand-trust" />
            </div>
            <div className="min-w-0 text-start">
              <p className="text-sm font-bold text-brand-espresso">{step.title}</p>
              <p className="text-xs text-brand-muted leading-relaxed mt-0.5">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
