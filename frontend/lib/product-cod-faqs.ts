import type { MarketId } from "@/config/markets";
import type { StoreLocale } from "@/lib/storefront-i18n";

type FaqItem = { question: string; answer: string };

const COD_FAQS: Record<
  MarketId,
  Record<StoreLocale, FaqItem[]>
> = {
  SA: {
    ar: [
      {
        question: "هل أدفع أي مبلغ الآن؟",
        answer:
          "لا. الطلب يُسجّل بدون دفع إلكتروني. تدفع فقط عند استلام الطلب من المندوب — الدفع عند الاستلام.",
      },
      {
        question: "لماذا يتصل بي فريق متقن؟",
        answer:
          "لتأكيد العنوان والكمية قبل الشحن — مكالمة قصيرة فقط، بدون أي دفع أو التزام إذا غيّرت رأيك قبل الشحن.",
      },
      {
        question: "يظهر الرقم «غير معروف» — أجيب؟",
        answer:
          "نعم، غالباً يكون فريق متقن. الرد يؤكد طلبك ويبدأ التجهيز. ساعات التأكيد: من 9 صباحاً إلى 9 مساءً بتوقيت الرياض.",
      },
      {
        question: "هل أستطيع رفض الطلب عند الاستلام؟",
        answer:
          "نعم. إذا لم يناسبك المنتج عند التسليم يمكنك الرفض دون دفع. ولديك ضمان 30 يوماً للاسترجاع أو الاستبدال بعد الاستلام.",
      },
      {
        question: "كم مدة التوصيل بعد التأكيد؟",
        answer:
          "تجهيز الطلب خلال 1–2 يوم عمل بعد مكالمة التأكيد، ثم توصيل 2–5 أيام عمل داخل المدن الرئيسية في المملكة.",
      },
    ],
    en: [
      {
        question: "Do I pay anything now?",
        answer:
          "No. Your order is placed without online payment. You only pay when the courier delivers — cash on delivery.",
      },
      {
        question: "Why does Mutqan call me?",
        answer:
          "To confirm your address and quantity before shipping — a short call only, with no payment or commitment if you change your mind before dispatch.",
      },
      {
        question: "The number shows as «unknown» — should I answer?",
        answer:
          "Yes, it's usually our team. Answering confirms your order and starts preparation. Confirmation hours: 9 AM to 9 PM Riyadh time.",
      },
      {
        question: "Can I refuse the order on delivery?",
        answer:
          "Yes. If the product isn't right at delivery you can refuse without paying. You also have a 30-day guarantee for return or exchange after receipt.",
      },
      {
        question: "How long is delivery after confirmation?",
        answer:
          "Order preparation takes 1–2 business days after the confirmation call, then 2–5 business days delivery in major Saudi cities.",
      },
    ],
  },
  AE: {
    ar: [
      {
        question: "هل أدفع أي مبلغ الآن؟",
        answer:
          "لا. الطلب يُسجّل بدون دفع إلكتروني. تدفع فقط عند استلام الطلب من المندوب — الدفع عند الاستلام.",
      },
      {
        question: "لماذا يتصل بي فريق متقن؟",
        answer:
          "لتأكيد العنوان والكمية قبل الشحن — مكالمة قصيرة فقط، بدون أي دفع أو التزام إذا غيّرت رأيك قبل الشحن.",
      },
      {
        question: "يظهر الرقم «غير معروف» — أجيب؟",
        answer:
          "نعم، غالباً يكون فريق متقن. الرد يؤكد طلبك ويبدأ التجهيز. ساعات التأكيد: من 9 صباحاً إلى 9 مساءً بتوقيت دبي.",
      },
      {
        question: "هل أستطيع رفض الطلب عند الاستلام؟",
        answer:
          "نعم. إذا لم يناسبك المنتج عند التسليم يمكنك الرفض دون دفع. ولديك ضمان 30 يوماً للاسترجاع أو الاستبدال بعد الاستلام.",
      },
      {
        question: "كم مدة التوصيل بعد التأكيد؟",
        answer:
          "تجهيز الطلب خلال 1–2 يوم عمل بعد مكالمة التأكيد، ثم توصيل 2–5 أيام عمل داخل المدن الرئيسية في الإمارات.",
      },
    ],
    en: [
      {
        question: "Do I pay anything now?",
        answer:
          "No. Your order is placed without online payment. You only pay when the courier delivers — cash on delivery.",
      },
      {
        question: "Why does Mutqan call me?",
        answer:
          "To confirm your address and quantity before shipping — a short call only, with no payment or commitment if you change your mind before dispatch.",
      },
      {
        question: "The number shows as «unknown» — should I answer?",
        answer:
          "Yes, it's usually our team. Answering confirms your order and starts preparation. Confirmation hours: 9 AM to 9 PM Dubai time.",
      },
      {
        question: "Can I refuse the order on delivery?",
        answer:
          "Yes. If the product isn't right at delivery you can refuse without paying. You also have a 30-day guarantee for return or exchange after receipt.",
      },
      {
        question: "How long is delivery after confirmation?",
        answer:
          "Order preparation takes 1–2 business days after the confirmation call, then 2–5 business days delivery in major UAE cities.",
      },
    ],
  },
};

/** Shared COD / trust FAQs — prepended on every product page */
export function getProductCodFaqs(
  locale: StoreLocale,
  market: MarketId,
): FaqItem[] {
  return COD_FAQS[market][locale];
}

/** @deprecated use getProductCodFaqs(locale, market) */
export const PRODUCT_COD_FAQS = COD_FAQS.SA.ar;
