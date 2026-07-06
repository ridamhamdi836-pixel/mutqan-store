"use client";

import { useStorefront } from "@/providers/storefront-provider";
import { getMarketConfig } from "@/config/markets";

export function TermsPageContent() {
  const { market, locale, t } = useStorefront();
  const cfg = getMarketConfig(market);
  const countryName = locale === "en" ? cfg.countryNameEn : cfg.countryNameAr;
  const currencyLabel =
    locale === "en" ? cfg.currencySymbolEn : cfg.currencySymbolAr;

  const sections = [
    {
      title: locale === "en" ? "Order & payment" : "الطلب والدفع",
      content:
        locale === "en"
          ? `All orders are cash on delivery in ${currencyLabel}. Prices include VAT unless stated otherwise. Orders are confirmed after our team contacts you.`
          : `جميع الطلبات تتم بالدفع عند الاستلام ب${currencyLabel}. الأسعار شاملة ضريبة القيمة المضافة ما لم يُذكر غير ذلك. يُؤكد الطلب بعد التواصل معك من فريق متقن.`,
    },
    {
      title: locale === "en" ? "Availability & pricing" : "التوافر والأسعار",
      content:
        locale === "en"
          ? "Stock is limited. Mutqan may adjust prices without prior notice. If an item sells out after ordering, we'll contact you with a suitable alternative."
          : "الكميات محدودة حسب المخزون المتاح. تحتفظ متقن بحق تعديل الأسعار دون إشعار مسبق. في حالة نفاد المنتج بعد الطلب، سيتم التواصل معك لإيجاد بديل مناسب.",
    },
    {
      title: t("deliverySectionTitle"),
      content:
        locale === "en"
          ? `We deliver within ${countryName} only. Delivery takes 2–5 business days in major cities. You must provide a correct address and mobile number.`
          : `نوصل داخل ${countryName} فقط حاليًا. مدة التوصيل 2-5 أيام عمل في المدن الرئيسية. العميل مسؤول عن تقديم عنوان ورقم جوال صحيحين لضمان التوصيل السليم.`,
    },
    {
      title: locale === "en" ? "Customer responsibility" : "مسؤولية العميل",
      content:
        locale === "en"
          ? "You are responsible for accurate information (name, mobile, address). Incorrect details may prevent delivery or incur extra fees."
          : "العميل مسؤول عن التأكد من صحة المعلومات المقدمة (الاسم، الجوال، العنوان). في حالة تعذر التوصيل بسبب معلومات خاطئة، قد تُطبق رسوم إضافية.",
    },
  ];

  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-8">
          {t("termsPageTitle")}
        </h1>

        <div className="space-y-6 text-brand-muted leading-relaxed">
          {sections.map((section) => (
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
