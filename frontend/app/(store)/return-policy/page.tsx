import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";

export const metadata: Metadata = {
  title: "سياسة الإرجاع",
  description: "سياسة الإرجاع والاستبدال لمتقن. نضمن رضاك عن تجربتك.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-8">سياسة الإرجاع</h1>

        <div className="space-y-6">
          {[
            {
              title: "مدة الإرجاع",
              content: "يمكن طلب إرجاع المنتج خلال 7 أيام من تاريخ الاستلام.",
            },
            {
              title: "شروط الإرجاع",
              content: "يجب أن يكون المنتج في حالته الأصلية غير المستخدمة مع جميع محتوياته. يُقبل الإرجاع في حالة: وجود عيب مصنعي، أو اختلاف المنتج عن الوصف، أو تلف التوصيل.",
            },
            {
              title: "منتجات لا يمكن إرجاعها",
              content: "المنتجات المستخدمة، أو التي فُقدت تغليفها الأصلي دون سبب مشروع.",
            },
            {
              title: "رفض الاستلام",
              content: "يحق لك رفض الاستلام عند وصول الطلب إذا لم يكن مطابقًا. في هذه الحالة، تواصل معنا فورًا لمتابعة الأمر.",
            },
            {
              title: "كيفية طلب الإرجاع",
              content: "تواصل معنا عبر واتساب مع رقم الطلب وصورة للمنتج، وسيتواصل معك فريقنا خلال 24 ساعة لترتيب الإرجاع.",
            },
          ].map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="text-xl font-bold text-brand-espresso mb-3">{section.title}</h2>
              <p className="text-sm text-brand-muted leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-6 text-center">
          <p className="text-brand-muted mb-4">للإرجاع أو الاستفسار، تواصل معنا مباشرة:</p>
          <WhatsAppButton label="تواصل معنا عبر واتساب" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
