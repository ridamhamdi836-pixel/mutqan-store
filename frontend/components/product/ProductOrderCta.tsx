import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductOrderCtaProps = {
  priceSar: number;
  onOrder: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function ProductOrderCta({
  priceSar,
  onOrder,
  title = "جاهز تطلب؟",
  subtitle = "نؤكد معك هاتفياً قبل الشحن — بدون دفع الآن.",
  className,
}: ProductOrderCtaProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-border bg-white p-5 md:p-6 text-center space-y-3 shadow-sm",
        className,
      )}
    >
      <h3 className="text-lg md:text-xl font-extrabold text-brand-espresso">{title}</h3>
      <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
        {subtitle}
      </p>
      <button
        type="button"
        onClick={onOrder}
        className="btn-primary w-full max-w-md mx-auto min-h-[52px] rounded-2xl text-base font-bold flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-5 h-5" />
        اطلب الآن · {priceSar} ر.س
      </button>
      <p className="text-xs font-medium text-brand-muted">
        الدفع عند الاستلام فقط · ضمان 30 يوم
      </p>
    </div>
  );
}
