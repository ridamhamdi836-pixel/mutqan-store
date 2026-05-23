import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "شروط وأحكام الاستخدام والشراء من متقن.",
};

export default function TermsPage() {
  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-8">الشروط والأحكام</h1>

        <div className="space-y-6 text-brand-muted leading-relaxed">
          {[
            {
              title: "الطلب والدفع",
              content: "جميع الطلبات تتم بالدفع عند الاستلام بالريال السعودي. الأسعار شاملة ضريبة القيمة المضافة ما لم يُذكر غير ذلك. يُؤكد الطلب بعد التواصل معك من فريق متقن.",
            },
            {
              title: "التوافر والأسعار",
              content: "الكميات محدودة حسب المخزون المتاح. تحتفظ متقن بحق تعديل الأسعار دون إشعار مسبق. في حالة نفاد المنتج بعد الطلب، سيتم التواصل معك لإيجاد بديل مناسب.",
            },
            {
              title: "التوصيل",
              content: "نوصل داخل المملكة العربية السعودية فقط حاليًا. مدة التوصيل 2-5 أيام عمل في المدن الرئيسية. العميل مسؤول عن تقديم عنوان ورقم جوال صحيحين لضمان التوصيل السليم.",
            },
            {
              title: "مسؤولية العميل",
              content: "العميل مسؤول عن التأكد من صحة المعلومات المقدمة (الاسم، الجوال، العنوان). في حالة تعذر التوصيل بسبب معلومات خاطئة، قد تُطبق رسوم إضافية.",
            },
          ].map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="text-xl font-bold text-brand-espresso mb-3">{section.title}</h2>
              <p className="text-sm">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
