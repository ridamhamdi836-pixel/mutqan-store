import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لمتقن - كيف نتعامل مع بياناتك الشخصية.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl prose-like">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-8">سياسة الخصوصية</h1>

        <div className="space-y-6 text-brand-muted leading-relaxed">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-espresso mb-3">ما المعلومات التي نجمعها؟</h2>
            <p>عند إتمام طلبك، نجمع: الاسم الكامل، ورقم الجوال السعودي. قد نجمع أيضًا عنوان التوصيل عند التأكيد معك. لا نجمع بيانات بطاقات ائتمانية لأن الدفع عند الاستلام فقط.</p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-espresso mb-3">لماذا نجمع هذه المعلومات؟</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>معالجة طلبك وتأكيده قبل الشحن.</li>
              <li>التواصل معك لترتيب التوصيل.</li>
              <li>الرد على استفساراتك ومتابعة طلبك.</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-espresso mb-3">ملفات تتبع الأداء</h2>
            <p>نستخدم أدوات تحليل مثل Meta Pixel وTikTok Pixel وSnapchat Pixel وHotjar (تسجيلات الجلسات وخرائط الحرارة) لتحسين حملاتنا الإعلانية وفهم سلوك المستخدمين على الموقع. هذه الأدوات قد تجمع بيانات تقنية مجهولة الهوية.</p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-espresso mb-3">مشاركة البيانات</h2>
            <p>لا نبيع بياناتك لأطراف ثالثة. نشارك بيانات التوصيل مع شركات الشحن المرتبطة فقط لإتمام عملية التوصيل.</p>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-espresso mb-3">التواصل بشأن الخصوصية</h2>
            <p>لأي استفسار حول بياناتك، تواصل معنا عبر واتساب أو الهاتف المدون في صفحة التواصل.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
