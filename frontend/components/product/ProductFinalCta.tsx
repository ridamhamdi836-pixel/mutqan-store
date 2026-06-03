"use client";

import { ShoppingBag, ShieldCheck, CreditCard } from "lucide-react";
import { BundleSelector } from "@/components/product/BundleSelector";
import type { ProductBundle } from "@/types";

type ProductFinalCtaProps = {
  productName: string;
  bundles: ProductBundle[];
  selectedBundle: ProductBundle;
  onSelectBundle: (b: ProductBundle) => void;
  onAddToCart: () => void;
};

export function ProductFinalCta({
  productName,
  bundles,
  selectedBundle,
  onSelectBundle,
  onAddToCart,
}: ProductFinalCtaProps) {
  return (
    <section className="page-x py-12 md:py-16 bg-brand-espresso text-white">
      <div className="max-w-content mx-auto max-w-lg text-center space-y-6">
        <div>
          <span className="inline-block bg-brand-bronze text-white text-xs font-bold px-3 py-1 rounded-pill mb-3">
            جاهز للطلب؟
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">
            اطلب {productName} اليوم
          </h2>
          <p className="text-brand-sand/90 text-sm md:text-base leading-relaxed">
            نتصل لتأكيد العنوان — لا دفع الآن. بعد التأكيد نجهّز ونشحن لك.
          </p>
        </div>
        <div className="text-start bg-white/5 rounded-2xl p-4 border border-white/10">
          <BundleSelector
            bundles={bundles}
            selectedId={selectedBundle.id}
            onSelect={onSelectBundle}
          />
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full h-14 md:h-16 rounded-2xl bg-brand-bronze hover:bg-brand-sand hover:text-brand-espresso font-extrabold text-lg flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
        >
          <ShoppingBag className="w-6 h-6" />
          اطلب الآن · {selectedBundle.price_sar} ر.س
        </button>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-brand-sand/80">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            دفع عند الاستلام
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            ضمان 30 يوم
          </span>
        </div>
      </div>
    </section>
  );
}
