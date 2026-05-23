import type { Metadata } from "next";
import { MessageCircle, Mail, Clock } from "lucide-react";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";
import { BRAND, WHATSAPP_URL } from "@/config/brand";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق متقن عبر واتساب أو الهاتف. نحن هنا لمساعدتك.",
};

export default function ContactPage() {
  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-3">تواصل معنا</h1>
          <p className="text-brand-muted">فريق متقن في خدمتك. نجيب على جميع استفساراتك بسرعة.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-[#25D366]" />
            </div>
            <h3 className="font-bold text-brand-espresso mb-1">واتساب</h3>
            <p className="text-xs text-brand-muted mb-3">الطريقة الأسرع للتواصل معنا</p>
            <a
              href={WHATSAPP_URL()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#25D366] font-medium hover:underline"
            >
              ابدأ المحادثة
            </a>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-bronze/10 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-brand-bronze" />
            </div>
            <h3 className="font-bold text-brand-espresso mb-1">البريد الإلكتروني</h3>
            <p className="text-xs text-brand-muted mb-3">للتواصل المباشر مع فريقنا</p>
            <a
              href={`mailto:${BRAND.supportEmail}`}
              className="text-sm text-brand-bronze font-medium hover:underline"
              dir="ltr"
            >
              {BRAND.supportEmail}
            </a>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-brand-trust/10 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-brand-trust" />
            </div>
            <h3 className="font-bold text-brand-espresso mb-1">أوقات الدعم</h3>
            <p className="text-xs text-brand-muted">طوال أيام الأسبوع</p>
            <p className="text-xs text-brand-muted">على مدار الساعة (24/7)</p>
          </div>
        </div>

        <div className="card p-6 text-center">
          <h2 className="font-bold text-brand-espresso mb-2">لديك سؤال عن طلبك؟</h2>
          <p className="text-sm text-brand-muted mb-4">
            أرسل لنا رقم طلبك عبر واتساب وسنساعدك فورًا.
          </p>
          <WhatsAppButton label="تواصل عبر واتساب الآن" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
