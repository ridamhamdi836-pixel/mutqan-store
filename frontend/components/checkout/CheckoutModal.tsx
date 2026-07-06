"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Loader2, ShieldCheck, Clock, Phone, CreditCard, CheckCircle, Star, Truck, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { useCart } from "@/providers/cart-provider";
import { useStorefront } from "@/providers/storefront-provider";
import { normalizePhone, validatePhone } from "@/lib/phone";
import { apiClient } from "@/lib/api-client";
import { getSessionTracking, generateEventId } from "@/lib/analytics";
import type { CreateOrderResponse } from "@/types";
import { cn } from "@/lib/utils";
import { getProductCardImageSrc } from "@/lib/product-image";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { saveLastOrderSession } from "@/lib/last-order-session";
import { buildCartDisplayLines } from "@/lib/cart-bundles";

interface CheckoutModalProps {
  onOrderSuccess: (response: CreateOrderResponse) => void;
}

function ItemImage({ slug, name }: { slug: string; name: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
      <StoreImage
        src={getProductCardImageSrc(slug)}
        alt={name}
        fill
        sizes={STORE_IMAGE_SIZES.thumbnail}
        variant="thumbnail"
        onError={() => { if (!err) setErr(true); }}
      />
    </div>
  );
}

export function CheckoutModal({ onOrderSuccess }: CheckoutModalProps) {
  const { isCheckoutOpen, closeCheckout, items, totalSar, clearCart } = useCart();
  const { t, formatMoney, market, phonePlaceholder } = useStorefront();
  const cartDisplayLines = buildCartDisplayLines(items);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCheckoutOpen && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current?.focus(), 200);
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (isCheckoutOpen) {
      trackStoreEvent({ event_type: "initiate_checkout" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isCheckoutOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCheckoutOpen) closeCheckout();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isCheckoutOpen, closeCheckout]);

  const validate = (): boolean => {
    let valid = true;
    setNameError("");
    setPhoneError("");
    setApiError("");

    if (!name.trim() || name.trim().length < 2) {
      setNameError(t("checkoutNameError"));
      valid = false;
    }
    if (!validatePhone(phone)) {
      setPhoneError(t("checkoutPhoneError"));
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const eventId = generateEventId("purchase");

    try {
      try {
        const ipCheck = await fetch("/api/verify-ip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: phone.trim() }),
        });
        const ipResult = await ipCheck.json();

        if (!ipResult.allowed) {
          if (ipResult.reason === "not_supported_country" || ipResult.reason === "not_ksa") {
            setApiError(t("checkoutGeoError"));
          } else if (["vpn_detected", "proxy_detected", "tor_detected", "residential_proxy", "anonymous_ip", "hosting_provider"].includes(ipResult.reason)) {
            setApiError(t("checkoutVpnError"));
          } else {
            setApiError(t("checkoutVerifyError"));
          }
          setSubmitting(false);
          return;
        }
      } catch {
        setApiError(t("checkoutVerifyError"));
        setSubmitting(false);
        return;
      }

      const tracking = getSessionTracking();
      const orderPayload = {
        customer: { full_name: name.trim(), phone: phone.trim() },
        market,
        items: items.map((item) => ({
          product_slug: item.productSlug,
          bundle_id: item.bundleId,
          quantity: item.quantity,
          item_type: item.itemType,
          price_sar: item.priceSar,
          name_ar: item.productNameAr,
        })),
        tracking: { ...tracking, client_event_id: eventId },
      };

      const response = await apiClient.createOrder(orderPayload);

      const { e164: phoneE164 } = normalizePhone(phone, market);

      saveLastOrderSession({
        purchaseEventId: eventId,
        orderNumber: response.order.public_order_number,
        totalSar: response.order.total_sar,
        customerName: name.trim(),
        phoneE164,
        items: items.map((item) => ({
          productSlug: item.productSlug,
          productNameAr: item.productNameAr,
          bundleLabelAr: item.bundleLabelAr,
          quantity: item.quantity,
          priceSar: item.priceSar,
        })),
        orderedSlugs:
          response.order_slugs ?? items.map((i) => i.productSlug),
      });

      closeCheckout();
      clearCart();
      onOrderSuccess(response);
    } catch (err: unknown) {
      const error = err as Error & { code?: string; field?: string };
      if (error.code === "INVALID_PHONE" || error.code === "INVALID_SAUDI_PHONE" || error.field === "phone") {
        setPhoneError(error.message || "رقم الجوال غير صحيح.");
      } else if (error.message === "Failed to fetch" || error.message?.includes("fetch")) {
        setApiError(t("checkoutNetworkError"));
      } else {
        setApiError(error.message || t("checkoutGenericError"));
      }
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-backdrop z-50"
            onClick={closeCheckout}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("checkoutTitle")}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="pointer-events-auto w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[min(82dvh,680px)] sm:max-h-[min(88dvh,720px)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 shrink-0">
                <h2 className="font-bold text-base sm:text-lg text-gray-900">{t("checkoutTitle")}</h2>
                <button onClick={closeCheckout} aria-label={t("checkoutClose")} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Urgency bar */}
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-amber-50 border-b border-amber-100 shrink-0">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-amber-700">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t("checkoutUrgency")}</span>
                </div>
              </div>

              {/* Social proof */}
              <div className="px-4 py-1.5 sm:px-5 sm:py-2 border-b border-gray-100 flex items-center justify-between shrink-0">
                <span className="text-xs text-gray-500">{t("checkoutSocialProof")}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-700">4.9</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0 overscroll-contain">
                <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-5 space-y-4">
                  {/* Continue shopping */}
                  <Link
                    href="/collections"
                    onClick={closeCheckout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs sm:text-sm font-bold text-gray-700 hover:border-[#1B4DDB]/40 hover:text-[#1B4DDB] hover:bg-[#1B4DDB]/5 transition-colors"
                  >
                    <Store className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    {t("checkoutContinueShopping")}
                  </Link>

                  {/* Order items */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">{t("checkoutYourOrder")}</p>
                    <div className="space-y-3">
                      {cartDisplayLines.map((line) =>
                        line.kind === "bundle" ? (
                          <div
                            key={line.id}
                            className="rounded-2xl border border-amber-200 bg-amber-50/45 p-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex -space-x-3 space-x-reverse shrink-0">
                                {line.items.map((item) => (
                                  <ItemImage
                                    key={item.bundleId}
                                    slug={item.productSlug}
                                    name={item.productNameAr}
                                  />
                                ))}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-gray-900 leading-snug">
                                  {line.title}
                                </p>
                                <ul className="mt-2 space-y-1 text-xs font-semibold text-gray-600">
                                  {line.items.map((item) => (
                                    <li key={item.bundleId}>• {item.productNameAr}</li>
                                  ))}
                                </ul>
                              </div>
                              <span className="text-sm font-black text-gray-900 shrink-0">
                                {formatMoney(line.totalSar)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div key={line.id} className="flex items-center gap-3">
                            <ItemImage slug={line.item.productSlug} name={line.item.productNameAr} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 leading-snug truncate">{line.item.productNameAr}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{line.item.bundleLabelAr}</p>
                            </div>
                            <span className="text-sm font-bold text-gray-900 flex-shrink-0">{formatMoney(line.totalSar)}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-medium text-sm text-gray-600">{t("checkoutTotal")}</span>
                    <span className="font-black text-xl sm:text-2xl text-gray-900">{formatMoney(totalSar)}</span>
                  </div>

                  {/* Free shipping + COD */}
                  <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{t("checkoutFreeCod")}</span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-bold text-gray-900 mb-1.5">
                      {t("checkoutFullName")}
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="checkout-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError(""); }}
                      placeholder={t("checkoutNamePlaceholder")}
                      aria-invalid={!!nameError}
                      className={cn(
                        "w-full h-11 sm:h-12 rounded-xl border bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:border-[#1B4DDB] focus:ring-2 focus:ring-[#1B4DDB]/20 outline-none transition-all",
                        nameError ? "border-red-400" : "border-gray-200"
                      )}
                    />
                    {nameError && <p role="alert" className="text-xs text-red-500 mt-1 font-medium">{nameError}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-bold text-gray-900 mb-1.5">
                      {t("checkoutPhone")}
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                      placeholder={phonePlaceholder}
                      aria-invalid={!!phoneError}
                      className={cn(
                        "w-full h-11 sm:h-12 rounded-xl border bg-white px-4 text-gray-900 text-right placeholder:text-gray-400 focus:border-[#1B4DDB] focus:ring-2 focus:ring-[#1B4DDB]/20 outline-none transition-all",
                        phoneError ? "border-red-400" : "border-gray-200"
                      )}
                    />
                    {phoneError ? (
                      <p role="alert" className="text-xs text-red-500 mt-1.5 font-medium">{phoneError}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1.5">{t("checkoutPhoneHint")}</p>
                    )}
                  </div>

                  {/* API Error */}
                  {apiError && (
                    <p role="alert" className="text-xs text-red-600 font-medium bg-red-50 rounded-xl p-3 border border-red-100">{apiError}</p>
                  )}

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className={cn(
                      "w-full h-11 sm:h-12 rounded-xl font-bold text-sm sm:text-base text-white flex items-center justify-center gap-2",
                      "bg-[#10B981] hover:bg-[#059669] active:scale-[0.98]",
                      "transition-all duration-150 shadow-md shadow-[#10B981]/20",
                      "disabled:opacity-60 disabled:cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t("checkoutSubmitting")}</span>
                      </>
                    ) : (
                      t("checkoutSubmit")
                    )}
                  </button>

                  {/* Trust footer */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {t("checkoutTrustNoPay")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {t("checkoutTrustCall")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      {t("checkoutTrustRefuse")}
                    </span>
                  </div>

                  <p className="text-[10px] text-center text-gray-300">
                    {t("checkoutTerms")}
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
