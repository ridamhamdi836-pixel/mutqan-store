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
      title: t("orderSectionTitle"),
      items: [
        {
          question:
            locale === "en" ? "How do I order from Mutqan?" : "كيف أطلب من متقن؟",
          answer:
            locale === "en"
              ? `Choose a product and bundle, add to cart, then enter your name and ${phoneLabel}. Our team will contact you shortly to confirm.`
              : `اختر المنتج والباقة المناسبة، أضفه للسلة، ثم أدخل اسمك و${phoneLabel}. سيتواصل معك فريقنا خلال فترة قصيرة لتأكيد الطلب.`,
        },
        {
          question: locale === "en" ? "Can I cancel my order?" : "هل يمكنني إلغاء الطلب؟",
          answer:
            locale === "en"
              ? "Yes — cancel before shipping via WhatsApp. After shipping, you can refuse on delivery."
              : "نعم، يمكنك إلغاء الطلب قبل الشحن عبر التواصل معنا على واتساب. بعد الشحن، يمكن الرفض عند الاستلام.",
        },
        {
          question:
            market === "AE"
              ? locale === "en"
                ? "Can I order from any emirate?"
                : "هل يمكنني الطلب من أي إمارة؟"
              : locale === "en"
                ? "Can I order from anywhere in Saudi Arabia?"
                : "هل يمكنني الطلب من أي منطقة في السعودية؟",
          answer:
            locale === "en"
              ? `Yes — we deliver across ${countryName}.`
              : `نعم، نوصل لجميع مناطق ومدن ${countryName}.`,
        },
      ],
    },
    {
      title: t("paymentSectionTitle"),
      items: [
        {
          question: locale === "en" ? "What payment methods are available?" : "ما طرق الدفع المتاحة؟",
          answer:
            locale === "en"
              ? "Cash on delivery only. Pay in cash when your order arrives."
              : "الدفع عند الاستلام فقط حاليًا. ادفع نقدًا عند وصول الطلب إليك.",
        },
        {
          question: locale === "en" ? "Are there delivery fees?" : "هل هناك رسوم توصيل؟",
          answer: t("faqFreeShippingAnswer"),
        },
        {
          question:
            locale === "en"
              ? "Do I pay the full amount on delivery?"
              : "هل المبلغ يُدفع بالكامل عند الاستلام؟",
          answer:
            locale === "en"
              ? "Yes — the full amount is paid to the courier on delivery."
              : "نعم، يُدفع المبلغ كاملًا عند استلام الطلب من مندوب الشحن.",
        },
      ],
    },
    {
      title: t("deliverySectionTitle"),
      items: [
        {
          question: locale === "en" ? "How long is delivery?" : "كم مدة التوصيل؟",
          answer: t("thankYouDeliveryFaqAnswer"),
        },
        {
          question: locale === "en" ? "How do I track my order?" : "كيف أتتبع طلبي؟",
          answer:
            locale === "en"
              ? "Go to Track Order and enter your order number and mobile. You can also contact us on WhatsApp."
              : "توجه لصفحة تتبع الطلب وأدخل رقم الطلب ورقم جوالك. يمكنك أيضًا التواصل معنا عبر واتساب.",
        },
        {
          question:
            locale === "en"
              ? "What if I'm not home for delivery?"
              : "ماذا لو لم أجد في المنزل عند التوصيل؟",
          answer:
            locale === "en"
              ? "The courier will try to reach you. You can reschedule delivery with them."
              : "سيحاول المندوب التواصل معك. يمكنك التنسيق معه لإعادة جدولة التوصيل.",
        },
      ],
    },
    {
      title: t("returnsSectionTitle"),
      items: [
        {
          question: locale === "en" ? "What is the return policy?" : "ما سياسة الإرجاع؟",
          answer:
            locale === "en"
              ? "Return within 7 days for manufacturing defects or if the product differs from the description. Contact us on WhatsApp."
              : "يمكن إرجاع المنتج خلال 7 أيام من الاستلام في حالة وجود عيب مصنعي أو اختلاف عن الوصف. تواصل معنا عبر واتساب.",
        },
        {
          question: locale === "en" ? "How do I return a product?" : "كيف أُرجع منتجًا؟",
          answer:
            locale === "en"
              ? "Contact us on WhatsApp with your order number and a product photo — we'll arrange the return."
              : "تواصل معنا عبر واتساب مع رقم الطلب وصورة للمنتج، وسنرتب معك عملية الإرجاع.",
        },
      ],
    },
  ];

  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-3">
            {t("faqPageTitle")}
          </h1>
          <p className="text-brand-muted">{t("faqPageSubtitle")}</p>
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
          <p className="text-brand-muted mb-4">{t("faqContactCta")}</p>
          <WhatsAppButton label={t("faqWhatsapp")} className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
