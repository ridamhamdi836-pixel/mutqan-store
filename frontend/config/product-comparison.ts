export type ComparisonRow = {
  label: string;
  us: boolean;
  alternative: boolean;
};

export const PRODUCT_COMPARISON_ROWS: ComparisonRow[] = [
  { label: "الدفع عند الاستلام بدون مقدم", us: true, alternative: false },
  { label: "تأكيد هاتفي قبل الشحن", us: true, alternative: false },
  { label: "ضمان استرجاع 30 يوم", us: true, alternative: false },
  { label: "منتجات مختارة لبيوت الخليج", us: true, alternative: false },
  { label: "دعم واتساب سريع", us: true, alternative: false },
  { label: "أسعار شفافة بدون رسوم مخفية", us: true, alternative: false },
];
