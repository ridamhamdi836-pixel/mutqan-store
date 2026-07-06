"use client";

import { useState } from "react";
import { Loader2, Package, CheckCircle2, Truck, MapPin } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { validatePhone } from "@/lib/phone";
import { WhatsAppButton } from "@/components/trust/WhatsAppButton";
import { useStorefront } from "@/providers/storefront-provider";
import { cn } from "@/lib/utils";

interface TrackResult {
  public_order_number: string;
  status: string;
  status_label_ar: string;
  estimated_delivery_ar: string;
  items: Array<{ name_ar: string; quantity: number }>;
  total_sar: number;
}

export default function TrackOrderPage() {
  const { formatMoney, t, phonePlaceholder, locale } = useStorefront();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhoneError("");
    setResult(null);

    if (!orderNumber.trim()) {
      setError(t("trackOrderErrorEmpty"));
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError(t("trackOrderErrorPhone"));
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.trackOrder(orderNumber.trim(), phone.trim()) as TrackResult;
      setResult(data);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || t("trackOrderNotFound"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-pad page-x">
      <div className="max-w-content mx-auto max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-espresso mb-3">{t("trackOrderPageTitle")}</h1>
          <p className="text-brand-muted">{t("trackOrderFormDesc")}</p>
        </div>

        <form onSubmit={handleTrack} className="card p-6 space-y-5 mb-6">
          <div>
            <label htmlFor="order-number" className="block text-sm font-semibold text-brand-espresso mb-1.5">{t("trackOrderNumber")}</label>
            <input
              id="order-number"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="MQN-XXXXXX-XXXX"
              className="input-base"
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="track-phone" className="block text-sm font-semibold text-brand-espresso mb-1.5">{t("trackOrderPhone")}</label>
            <input
              id="track-phone"
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
              placeholder={phonePlaceholder}
              className={cn("input-base", phoneError && "border-brand-error")}
              dir="ltr"
            />
            {phoneError && <p className="text-xs text-brand-error mt-1.5">{phoneError}</p>}
          </div>

          {error && <p role="alert" className="text-xs text-brand-error bg-brand-error/8 rounded-xl p-3">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full h-12 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? t("trackOrderLoading") : t("trackOrderSubmit")}
          </button>
        </form>

        {result && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-brand-trust" />
              <h2 className="font-bold text-brand-espresso">{t("trackOrderStatus")}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">{t("trackOrderNumber")}</span>
                <span className="font-bold">{result.public_order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">{locale === "en" ? "Status" : "الحالة"}</span>
                <span className="font-semibold text-brand-trust">{result.status_label_ar}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-muted">{t("trackOrderTotal")}</span>
                <span className="font-bold">{formatMoney(result.total_sar)}</span>
              </div>
            </div>

            <div className="border-t border-brand-border pt-3">
              <p className="text-xs text-brand-muted font-medium mb-2">{t("trackOrderProducts")}</p>
              {result.items.map((item, i) => (
                <p key={i} className="text-sm text-brand-espresso">{item.name_ar} × {item.quantity}</p>
              ))}
            </div>

            <div className="flex items-start gap-2 text-xs text-brand-muted bg-brand-beige rounded-xl p-3">
              <Truck className="w-4 h-4 text-brand-trust flex-shrink-0 mt-0.5" />
              <span>{result.estimated_delivery_ar}</span>
            </div>

            <WhatsAppButton
              message={`مرحبًا، لدي استفسار عن طلبي من متقن رقم ${result.public_order_number}`}
              label={t("trackOrderSupport")}
              className="w-full justify-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
