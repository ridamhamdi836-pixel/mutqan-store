"use client";

import { Truck, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useStorefront } from "@/providers/storefront-provider";

export function ShippingPolicyContent() {
  const { shippingCities, shippingAllRegions, market, locale, t } = useStorefront();
  const majorCities = shippingCities.slice(0, 7).join(locale === "en" ? ", " : "، ");
  const otherRegionsLabel =
    market === "AE" ? t("otherRegionsAe") : t("otherRegionsSa");

  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-4">
            {t("shippingPolicyTitle")}
          </h1>
          <p className="text-brand-muted text-lg">{t("shippingPolicySubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6 border border-brand-border bg-white shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-brand-espresso" />
            </div>
            <h3 className="text-xl font-bold text-brand-espresso mb-2">{t("shippingMajorCities")}</h3>
            <p className="text-brand-bronze font-extrabold text-2xl mb-2">{t("shippingDays12")}</p>
            <p className="text-sm text-brand-muted">({majorCities})</p>
          </div>

          <div className="card p-6 border border-brand-border bg-white shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-brand-beige flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-brand-espresso" />
            </div>
            <h3 className="text-xl font-bold text-brand-espresso mb-2">{otherRegionsLabel}</h3>
            <p className="text-brand-bronze font-extrabold text-2xl mb-2">{t("shippingDays25")}</p>
            <p className="text-sm text-brand-muted">{shippingAllRegions}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-brand-trust" />
              <h2 className="text-xl font-bold text-brand-espresso">{t("shippingConfirmTitle")}</h2>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">{t("shippingConfirmDesc")}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-brand-trust" />
              <h2 className="text-xl font-bold text-brand-espresso">{t("shippingCostTitle")}</h2>
            </div>
            <p className="text-sm text-brand-muted leading-relaxed">{t("shippingCostDesc")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
