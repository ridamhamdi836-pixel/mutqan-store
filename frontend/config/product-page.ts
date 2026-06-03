/** Shared PDP copy & FAQs for COD / cold traffic (TikTok, Snapchat) */

export const COD_FAQ_ITEMS = [
  {
    question: "كيف أدفع؟ وهل فيه دفع أونلاين؟",
    answer:
      "الدفع عند الاستلام فقط — لا تدفع ولا ريال الآن. تدفع للمندوب لما يوصلك الطلب بيدك داخل السعودية.",
  },
  {
    question: "ليش يتصلون من رقم ما يظهر عندي؟",
    answer:
      "أحياناً يظهر الرقم «غير معروف» — هذا فريق متقن. الرد يفتح شحن طلبك: نؤكد العنوان والكمية فقط.",
  },
  {
    question: "ماذا يحدث بعد ما أضغط «اطلب الآن»؟",
    answer:
      "نسجّل طلبك، ثم نتصل خلال ~10 دقائق (9 ص–9 م) لتأكيد العنوان. بعد التأكيد نجهّز ونشحن — تقدر تلغي قبل الشحن بدون رسوم.",
  },
  {
    question: "كم يوصل الطلب؟",
    answer: "بعد تأكيد الطلب: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام عمل للمدن الرئيسية.",
  },
  {
    question: "الضمان الذهبي 30 يوم — كيف؟",
    answer:
      "لم يعجبك المنتج؟ استرجاع أو استبدال خلال 30 يوماً — تواصل معنا عبر واتساب بعد الاستلام.",
  },
] as const;

export function mergeProductFaqs(
  productFaqs: Array<{ question: string; answer: string }>,
): Array<{ question: string; answer: string }> {
  const seen = new Set<string>();
  const out: Array<{ question: string; answer: string }> = [];
  for (const item of [...COD_FAQ_ITEMS, ...productFaqs]) {
    if (seen.has(item.question)) continue;
    seen.add(item.question);
    out.push(item);
  }
  return out;
}

export const PDP_STATS = [
  { value: "+12,000", label: "طلب مُسلّم" },
  { value: "4.9/5", label: "تقييم العملاء" },
  { value: "93%", label: "يردّون على أول اتصال" },
] as const;

export const DEFAULT_PAIN_HEADLINE = "تعرفين هالموقف في البيت؟";
