/** COD confirmation call window — Asia/Riyadh, 9:00–21:00 */
export type CallExpectationVariant =
  | "business_hours"
  | "morning_today"
  | "morning_tomorrow";

export type CallExpectation = {
  variant: CallExpectationVariant;
  bannerHeadline: string;
  bannerSubline: string;
  phoneStep: string;
  etaLabel: string;
};

const CALL_OPEN_HOUR = 9;
const CALL_CLOSE_HOUR = 21;

function getRiyadhHour(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "numeric",
    hour12: false,
  }).formatToParts(now);
  const hour = parts.find((p) => p.type === "hour")?.value;
  return hour ? parseInt(hour, 10) : now.getHours();
}

export function getCallExpectation(now = new Date()): CallExpectation {
  const hour = getRiyadhHour(now);
  const inWindow = hour >= CALL_OPEN_HOUR && hour < CALL_CLOSE_HOUR;

  if (inWindow) {
    return {
      variant: "business_hours",
      bannerHeadline: "انتظر اتصال فريق متقن لتأكيد طلبك",
      bannerSubline:
        "قد يظهر الرقم «غير معروف» — هذا نحن. أبقِ جوالك قريباً؛ الرد يؤكد العنوان ويبدأ تجهيز الشحنة.",
      phoneStep:
        "عند وصول الاتصال نؤكد العنوان والكمية فقط — بدون أي دفع الآن، والدفع عند الاستلام.",
      etaLabel: "ساعات التأكيد: 9 ص – 9 م",
    };
  }

  if (hour < CALL_OPEN_HOUR) {
    return {
      variant: "morning_today",
      bannerHeadline: "ستتلقى اتصالنا صباحًا اليوم",
      bannerSubline:
        "طلبك مسجّل. نتصل من الساعة 9 صباحًا حتى 9 مساءً — قد يظهر الرقم غير محفوظ، وهذا فريق متقن للتأكيد قبل الشحن.",
      phoneStep:
        "احتفظ بجوالك قريبًا منك صباحًا — نؤكد العنوان والتفاصيل، والدفع عند الاستلام فقط.",
      etaLabel: "ابتداءً من 9 صباحًا",
    };
  }

  return {
    variant: "morning_tomorrow",
    bannerHeadline: "ستتلقى اتصالنا صباح الغد",
    bannerSubline:
      "طلبك محفوظ وسنتصل في أول فترة عمل (9 ص–9 م). الرقم قد يكون غير معروف — فريق متقن لتأكيد عنوانك قبل الشحن.",
    phoneStep:
      "غدًا صباحًا نؤكد معك العنوان على نفس رقم الطلب — لا دفع مقدّم، ويمكنك الإلغاء قبل الشحن.",
    etaLabel: "صباح الغد (من 9 ص)",
  };
}
