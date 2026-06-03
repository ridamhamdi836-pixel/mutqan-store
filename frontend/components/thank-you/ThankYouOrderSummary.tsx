"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import { formatSARCompact } from "@/lib/currency";
import { getProductMainImageSrc } from "@/lib/product-image";
import type { LastOrderLineItem } from "@/lib/last-order-session";
import { CreditCard, Package } from "lucide-react";

type ThankYouOrderSummaryProps = {
  orderNumber: string;
  totalSar: number;
  items: LastOrderLineItem[];
};

export function ThankYouOrderSummary({
  orderNumber,
  totalSar,
  items,
}: ThankYouOrderSummaryProps) {
  return (
    <div className="card p-5 text-start space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-brand-border/60">
        <div className="flex items-center gap-2 text-brand-muted">
          <Package className="w-4 h-4" />
          <span className="text-sm font-medium">ملخص الطلب</span>
        </div>
        <span className="text-xs font-mono font-bold text-brand-espresso bg-brand-beige px-2.5 py-1 rounded-lg">
          {orderNumber}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={`${item.productSlug}-${item.bundleLabelAr}`}
              className="flex gap-3 items-start"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0">
                <StoreImage
                  src={getProductMainImageSrc(item.productSlug)}
                  alt={item.productNameAr}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 grid grid-cols-1 gap-1">
                <p className="font-bold text-sm text-brand-espresso leading-snug">
                  {item.productNameAr}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {item.bundleLabelAr}
                  {item.quantity > 1 ? ` · ×${item.quantity}` : ""}
                </p>
              </div>
              <p className="text-sm font-black text-brand-espresso tabular-nums flex-shrink-0 pt-0.5">
                {formatSARCompact(item.priceSar)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-brand-muted">
          تم تسجيل طلبك. التفاصيل ستُراجع معك في مكالمة التأكيد.
        </p>
      )}

      <div className="pt-3 border-t border-brand-border/60 space-y-2">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm font-medium text-brand-muted">الإجمالي</span>
          <span className="text-2xl font-black text-brand-espresso tabular-nums">
            {formatSARCompact(totalSar)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-trust">
          <CreditCard className="w-3.5 h-3.5" />
          الدفع عند الاستلام — لا تدفع شيئًا الآن
        </div>
      </div>
    </div>
  );
}
