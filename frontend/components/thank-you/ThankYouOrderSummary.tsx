"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { formatSARCompact } from "@/lib/currency";
import { getProductCardImageSrc } from "@/lib/product-image";
import type { LastOrderLineItem } from "@/lib/last-order-session";
import { CreditCard, Package, User } from "lucide-react";

type ThankYouOrderSummaryProps = {
  orderNumber: string;
  totalSar: number;
  items: LastOrderLineItem[];
  customerName?: string;
  customerPhone?: string;
};

export function ThankYouOrderSummary({
  orderNumber,
  totalSar,
  items,
  customerName,
  customerPhone,
}: ThankYouOrderSummaryProps) {
  const showCustomer = customerName?.trim() || customerPhone?.trim();

  return (
    <div className="card p-5 md:p-6 text-start space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-brand-border/60">
        <div className="flex items-center gap-2 text-brand-muted">
          <Package className="w-4 h-4" />
          <span className="text-sm font-medium">ملخص الطلب</span>
        </div>
        {orderNumber ? (
          <span className="text-xs font-mono font-bold text-brand-espresso bg-brand-beige px-2.5 py-1 rounded-lg">
            {orderNumber}
          </span>
        ) : null}
      </div>

      {showCustomer ? (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-beige/50 border border-brand-border/50">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <User className="w-4 h-4 text-brand-bronze" />
          </div>
          <div className="min-w-0">
            {customerName?.trim() ? (
              <p className="font-bold text-base text-brand-espresso leading-snug">
                {customerName.trim()}
              </p>
            ) : null}
            {customerPhone?.trim() ? (
              <p
                className="text-sm font-semibold text-brand-muted tabular-nums mt-0.5"
                dir="ltr"
              >
                {customerPhone.trim()}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={`${item.productSlug}-${item.bundleLabelAr}`}
              className="flex gap-3 items-start"
            >
              <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0">
                <StoreImage
                  src={getProductCardImageSrc(item.productSlug)}
                  alt={item.productNameAr}
                  fill
                  fit="contain"
                  sizes={STORE_IMAGE_SIZES.thumbnail}
                  variant="thumbnail"
                  className="p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm md:text-base text-brand-espresso leading-snug">
                  {item.productNameAr}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed mt-0.5">
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
          <span className="text-2xl md:text-3xl font-black text-brand-espresso tabular-nums">
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
