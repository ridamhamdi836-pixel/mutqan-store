"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Package, Truck } from "lucide-react";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";
import { Suspense } from "react";

function ThankYouContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order") || "MQN-XXXXXX-XXXX";
  const total = params.get("total") || "0";

  const whatsappMessage = `مرحبًا، لدي استفسار عن طلبي من متقن رقم ${orderNumber}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 page-x">
      <div className="max-w-lg w-full text-center space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-brand-trust/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-brand-trust" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-3">
            شكرًا لك، تم استلام طلبك بنجاح
          </h1>
          <p className="text-brand-muted leading-relaxed">
            سيتواصل معك فريق متقن لتأكيد الطلب قبل الشحن.
          </p>
        </div>

        {/* Order details */}
        <div className="card p-5 text-start space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">رقم الطلب</span>
            <span className="font-bold text-brand-espresso">{orderNumber}</span>
          </div>
          {parseInt(total) > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-muted">الإجمالي</span>
              <span className="font-bold text-brand-espresso">{total} ر.س</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-muted">طريقة الدفع</span>
            <span className="font-semibold text-brand-espresso">الدفع عند الاستلام</span>
          </div>
        </div>

        {/* Next steps */}
        <div className="card p-5 text-start space-y-4">
          <h2 className="font-bold text-brand-espresso text-base">الخطوات القادمة</h2>
          {[
            { icon: MessageCircle, label: "سيتواصل فريق متقن معك خلال فترة وجيزة لتأكيد الطلب." },
            { icon: Package, label: "بعد التأكيد، يُجهّز الطلب ويُرسل خلال 1-2 يوم عمل." },
            { icon: Truck, label: "التوصيل خلال 2-5 أيام عمل داخل المدن الرئيسية." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-trust/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-brand-trust" />
              </div>
              <p className="text-sm text-brand-muted leading-relaxed mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <WhatsAppButton message={whatsappMessage} label="تواصل معنا عبر واتساب" className="flex-1 justify-center" />
          <Link href="/track-order" className="btn-secondary flex-1 text-center">
            تتبع الطلب
          </Link>
        </div>

        <Link href="/collections" className="block text-sm text-brand-bronze hover:text-brand-espresso font-medium transition-colors">
          مواصلة التسوق
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-brand-muted">جارٍ التحميل...</p></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
