export const THANK_YOU_STATS = [
  { value: "12,000+", label: "طلب تم تسليمه" },
  { value: "4.9/5", label: "تقييم العملاء" },
  { value: "93%", label: "يردون على أول اتصال" },
] as const;

export const THANK_YOU_REVIEWS = [
  {
    name: "ريم الحربي",
    city: "الرياض",
    rating: 5,
    text: "بشرتي صارت أكثر إشراقاً من أول أسبوع — والدفع عند الاستلام مريح جداً.",
  },
  {
    name: "سارة العنزي",
    city: "جدة",
    rating: 5,
    text: "كنت مترددة من الرقم الغير معروف، لكنه فعلاً متقن. التأكيد سريع والمنتج لطيف على بشرتي.",
  },
  {
    name: "هنوف الشهري",
    city: "الدمام",
    rating: 5,
    text: "أفضل تجربة COD — تأكيد واضح، توصيل سريع، وبشرتي تشعر أنها أكثر راحة.",
  },
] as const;

/** Shown expanded at top of FAQ */
export const THANK_YOU_FAQ_PRIORITY = [
  {
    question: "لماذا يتصل بي رقم غير معروف؟",
    answer:
      "أنظمة الاتصال لدينا تظهر أحيانًا كرقم عام — الرد يفتح شحن طلبك. نؤكد العنوان والكمية فقط ولا نطلب أي دفع الآن.",
  },
  {
    question: "متى أدفع؟",
    answer:
      "عند استلام الطلب من المندوب فقط — الدفع عند الاستلام 100%، بدون مقدم ولا بطاقة.",
  },
] as const;

export const THANK_YOU_FAQ_MORE = [
  {
    question: "ماذا يحدث في مكالمة التأكيد؟",
    answer:
      "نراجع المنتجات والكمية ونثبت عنوان التوصيل. يمكنك التعديل أو الإلغاء قبل الشحن بدون أي رسوم.",
  },
  {
    question: "كم مدة التوصيل؟",
    answer:
      "بعد التأكيد: تجهيز 1–2 يوم عمل، ثم توصيل 2–5 أيام داخل المدن الرئيسية في السعودية.",
  },
  {
    question: "هل يمكنني إلغاء الطلب؟",
    answer:
      "نعم قبل الشحن — أخبرنا في مكالمة التأكيد أو عبر واتساب، بدون أي رسوم.",
  },
] as const;

/** Mock live activity — no backend */
export const THANK_YOU_LIVE_ORDERS = [
  { city: "الرياض", minutesAgo: 1 },
  { city: "جدة", minutesAgo: 3 },
  { city: "الدمام", minutesAgo: 5 },
  { city: "مكة", minutesAgo: 8 },
] as const;

/** Upsell cards: show «الأكثر مبيعاً» */
export const THANK_YOU_BESTSELLER_SLUGS = new Set([
  "vitamin-c-booster",
  "ceramide-booster",
]);
