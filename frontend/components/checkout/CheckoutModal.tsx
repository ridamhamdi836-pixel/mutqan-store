"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Loader2, ShieldCheck, Clock, Phone, CreditCard, CheckCircle, Star, Truck, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoreImage } from "@/components/ui/StoreImage";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { useCart } from "@/providers/cart-provider";
import { normalizePhone, validatePhone } from "@/lib/phone";
import { apiClient } from "@/lib/api-client";
import { getSessionTracking, generateEventId } from "@/lib/analytics";
import { formatSARCompact } from "@/lib/currency";
import type { CreateOrderResponse } from "@/types";
import { cn } from "@/lib/utils";
import { getProductCardImageSrc } from "@/lib/product-image";
import { trackStoreEvent } from "@/lib/store-analytics-client";
import { saveLastOrderSession } from "@/lib/last-order-session";

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
      setNameError("فضلاً أدخل الاسم الكامل.");
      valid = false;
    }
    if (!validatePhone(phone)) {
      setPhoneError("فضلاً أدخل رقم جوال صحيح.");
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
          if (ipResult.reason === "not_ksa") {
            setApiError("عذراً، هذه الخدمة متاحة فقط داخل المملكة العربية السعودية.");
          } else if (["vpn_detected", "proxy_detected", "tor_detected", "residential_proxy", "anonymous_ip", "hosting_provider"].includes(ipResult.reason)) {
            setApiError("يرجى إيقاف الـ VPN أو البروكسي للمتابعة. نقبل الطلبات فقط من داخل السعودية.");
          } else {
            setApiError("تعذر التحقق من موقعك حالياً. فضلاً حاول مرة أخرى بعد قليل.");
          }
          setSubmitting(false);
          return;
        }
      } catch {
        setApiError("تعذر التحقق من موقعك حالياً. فضلاً حاول مرة أخرى بعد قليل.");
        setSubmitting(false);
        return;
      }

      const tracking = getSessionTracking();
      const orderPayload = {
        customer: { full_name: name.trim(), phone: phone.trim() },
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

      const { e164: phoneE164 } = normalizePhone(phone);

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
        setApiError("تعذر الاتصال بالخادم. فضلاً تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      } else {
        setApiError(error.message || "تعذر تأكيد الطلب الآن. فضلاً حاول مرة أخرى أو تواصل معنا عبر واتساب.");
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

          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="إتمام الطلب"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">إتمام الطلب</h2>
                <button onClick={closeCheckout} aria-label="إغلاق" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Urgency bar */}
              <div className="px-5 py-2.5 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>آخر 48 ساعة على عرض الشحن المجاني</span>
                </div>
              </div>

              {/* Social proof */}
              <div className="px-5 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">+1,200 عميل طلبوا هذا الأسبوع</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-700">4.9</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                <form onSubmit={handleSubmit} noValidate className="p-5 space-y-5">
                  {/* Continue shopping */}
                  <Link
                    href="/collections"
                    onClick={closeCheckout}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-700 hover:border-[#1B4DDB]/40 hover:text-[#1B4DDB] hover:bg-[#1B4DDB]/5 transition-colors"
                  >
                    <Store className="w-5 h-5 shrink-0" />
                    الاستمرار في التسوق — اختر منتجات أخرى
                  </Link>

                  {/* Order items */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">طلبك</p>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.bundleId} className="flex items-center gap-3">
                          <ItemImage slug={item.productSlug} name={item.productNameAr} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 leading-snug truncate">{item.productNameAr}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.bundleLabelAr}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900 flex-shrink-0">{item.priceSar} ر.س</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-medium text-gray-600">الإجمالي</span>
                    <span className="font-black text-2xl text-gray-900">{totalSar} <span className="text-sm font-bold">ر.س</span></span>
                  </div>

                  {/* Free shipping + COD */}
                  <div className="flex items-center gap-2 text-xs text-[#10B981] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>شحن مجاني · الدفع عند الاستلام فقط</span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-bold text-gray-900 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="checkout-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setNameError(""); }}
                      placeholder="مثال: سارة محمد"
                      aria-invalid={!!nameError}
                      className={cn(
                        "w-full h-12 rounded-xl border bg-white px-4 text-gray-900 placeholder:text-gray-400 focus:border-[#1B4DDB] focus:ring-2 focus:ring-[#1B4DDB]/20 outline-none transition-all",
                        nameError ? "border-red-400" : "border-gray-200"
                      )}
                    />
                    {nameError && <p role="alert" className="text-xs text-red-500 mt-1.5 font-medium">{nameError}</p>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label htmlFor="checkout-phone" className="block text-sm font-bold text-gray-900 mb-2">
                      رقم الجوال
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError(""); }}
                      placeholder="05XXXXXXXX أو 01XXXXXXX"
                      aria-invalid={!!phoneError}
                      className={cn(
                        "w-full h-12 rounded-xl border bg-white px-4 text-gray-900 text-right placeholder:text-gray-400 focus:border-[#1B4DDB] focus:ring-2 focus:ring-[#1B4DDB]/20 outline-none transition-all",
                        phoneError ? "border-red-400" : "border-gray-200"
                      )}
                    />
                    {phoneError ? (
                      <p role="alert" className="text-xs text-red-500 mt-1.5 font-medium">{phoneError}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1.5">أدخل رقم جوال أو هاتف صحيح للتواصل وتأكيد الطلب</p>
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
                      "w-full h-14 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2",
                      "bg-[#10B981] hover:bg-[#059669] active:scale-[0.98]",
                      "transition-all duration-150 shadow-lg shadow-[#10B981]/25",
                      "disabled:opacity-60 disabled:cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جارٍ تأكيد الطلب...</span>
                      </>
                    ) : (
                      "تأكيد الطلب بالدفع عند الاستلام"
                    )}
                  </button>

                  {/* Trust footer */}
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      بدون دفع الآن
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      نتصل للتأكيد
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      ارفض بدون تكلفة
                    </span>
                  </div>

                  <p className="text-[10px] text-center text-gray-300">
                    بالمتابعة أنت توافق على الشروط والأحكام وسياسة الخصوصية
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
