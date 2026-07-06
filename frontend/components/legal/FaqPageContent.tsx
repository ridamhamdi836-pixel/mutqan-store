"use client";

import { FAQAccordion } from "@/components/product/FAQAccordion";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";
import { useStorefront } from "@/providers/storefront-provider";
import { getMarketConfig } from "@/config/markets";

export function FaqPageContent() {
  const { market, locale, t } = useStorefront();
  const country = getMarketConfig(market);
  const countryName = locale === "en" ? country.countryNameEn : country.countryNameAr;
  const phoneLabel =
    market === "AE"
      ? locale === "en"
        ? "your UAE mobile number"
        : "رقم جوالك الإماراتي"
      : locale === "en"
        ? "your Saudi mobile number"
        : "رقم جوالك السعودي";

  const sections = [
    {
      title: "الطلب والشراء",
      items: [
        {
          question: "كيف أطلب من متقن؟",
          answer: `اختر المنتج والباقة المناسبة، أضفه للسلة، ثم أدخل اسمك و${phoneLabel}. سيتواصل معك فريقنا خلال فترة قصيرة لتأكيد الطلب.`,
        },
        {
          question: "هل يمكنني إلغاء الطلب؟",
          answer:
            "نعم، يمكنك إلغاء الطلب قبل الشحن عبر التواصل معنا على واتساب. بعد الشحن، يمكن الرفض عند الاستلام.",
        },
        {
          question:
            market === "AE"
              ? "هل يمكنني الطلب من أي إمارة؟"
              : "هل يمكنني الطلب من أي منطقة في السعودية؟",
          answer: `نعم، نوصل لجميع مناطق ومدن ${countryName}.`,
        },
      ],
    },
    {
      title: "الدفع",
      items: [
        {
          question: "ما طرق الدفع المتاحة؟",
          answer: "الدفع عند الاستلام فقط حاليًا. ادفع نقدًا عند وصول الطلب إليك.",
        },
        {
          question: "هل هناك رسوم توصيل؟",
          answer: t("faqFreeShippingAnswer"),
        },
        {
          question: "هل المبلغ يُدفع بالكامل عند الاستلام؟",
          answer: "نعم، يُدفع المبلغ كاملًا عند استلام الطلب من مندوب الشحن.",
        },
      ],
    },
    {
      title: "التوصيل",
      items: [
        {
          question: "كم مدة التوصيل؟",
          answer: t("thankYouDeliveryFaqAnswer"),
        },
        {
          question: "كيف أتتبع طلبي؟",
          answer:
            "توجه لصفحة تتبع الطلب وأدخل رقم الطلب ورقم جوالك. يمكنك أيضًا التواصل معنا عبر واتساب.",
        },
        {
          question: "ماذا لو لم أجد في المنزل عند التوصيل؟",
          answer: "سيحاول المندوب التواصل معك. يمكنك التنسيق معه لإعادة جدولة التوصيل.",
        },
      ],
    },
    {
      title: "الإرجاع والاستبدال",
      items: [
        {
          question: "ما سياسة الإرجاع؟",
          answer:
            "يمكن إرجاع المنتج خلال 7 أيام من الاستلام في حالة وجود عيب مصنعي أو اختلاف عن الوصف. تواصل معنا عبر واتساب.",
        },
        {
          question: "كيف أُرجع منتجًا؟",
          answer:
            "تواصل معنا عبر واتساب مع رقم الطلب وصورة للمنتج، وسنرتب معك عملية الإرجاع.",
        },
      ],
    },
  ];

  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-3">الأسئلة الشائعة</h1>
          <p className="text-brand-muted">
            إجابات على أكثر الأسئلة شيوعًا. لم تجد ما تبحث عنه؟ تواصل معنا.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-bold text-xl text-brand-espresso mb-4">{section.title}</h2>
              <FAQAccordion items={section.items} />
            </div>
          ))}
        </div>

        <div className="mt-10 card p-6 text-center">
          <p className="text-brand-muted mb-4">لم تجد إجابة على سؤالك؟</p>
          <WhatsAppButton label="تواصل معنا عبر واتساب" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
