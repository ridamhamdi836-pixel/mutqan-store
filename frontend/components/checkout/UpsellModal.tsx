"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { apiClient } from "@/lib/api-client";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import type { UpsellOffer, OrderSummary } from "@/types";
import { formatSARCompact } from "@/lib/currency";
import { getProductImageSrc } from "@/lib/product-image";

interface UpsellModalProps {
  isOpen: boolean;
  upsell: UpsellOffer;
  orderId: string;
  orderNumber: string;
  onComplete: (updatedOrder?: OrderSummary) => void;
}

export function UpsellModal({ isOpen, upsell, orderId, orderNumber, onComplete }: UpsellModalProps) {
  const [timeLeft, setTimeLeft] = useState(upsell.expires_in_seconds);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    firePixelEvent({
      eventId: generateEventId("upsell_viewed"),
      eventName: "upsell_viewed",
      productSlug: upsell.product_slug,
      value: upsell.offered_price_sar,
      currency: "SAR",
      orderNumber,
    });

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleExpired();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleExpired = useCallback(async () => {
    try {
      await apiClient.declineUpsell(orderId, upsell.offer_id);
    } catch {}
    onComplete();
  }, [orderId, upsell.offer_id, onComplete]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const result = await apiClient.acceptUpsell(orderId, upsell.offer_id);
      firePixelEvent({
        eventId: generateEventId("upsell_accepted"),
        eventName: "upsell_accepted",
        productSlug: upsell.product_slug,
        value: upsell.offered_price_sar,
        currency: "SAR",
        orderNumber,
      });
      onComplete(result.order as OrderSummary);
    } catch {
      onComplete();
    }
  };

  const handleDecline = async () => {
    setDeclining(true);
    try {
      await apiClient.declineUpsell(orderId, upsell.offer_id);
      firePixelEvent({
        eventId: generateEventId("upsell_declined"),
        eventName: "upsell_declined",
        productSlug: upsell.product_slug,
        orderNumber,
      });
    } catch {}
    onComplete();
  };

  const progress = (timeLeft / upsell.expires_in_seconds) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="عرض خاص"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto bg-brand-surface rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Progress bar */}
            <div className="h-1 bg-brand-beige">
              <motion.div
                className="h-full bg-brand-bronze"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 bg-brand-trust/10 text-brand-trust rounded-pill px-3 py-1 text-xs font-semibold mb-3">
                  <Check className="w-3.5 h-3.5" />
                  <span>تم استلام طلبك بنجاح</span>
                </div>
                <h2 className="font-bold text-xl text-brand-espresso leading-tight">عرض خاص قبل تأكيد الطلب</h2>
                <p className="text-sm text-brand-muted mt-2">
                  أضيفي هذا المنتج لطلبك الآن بسعر أقل، ويوصل مع نفس الشحنة.
                </p>
              </div>

              {/* Product */}
              <div className="card p-4 flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-beige flex-shrink-0">
                  <Image
                    src={getProductImageSrc(upsell.product_slug)}
                    alt={upsell.name_ar}
                    fill
                    unoptimized
                    className="object-cover"
                    onError={() => { if (!imgError) setImgError(true); }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-brand-espresso text-sm leading-snug">{upsell.name_ar}</p>
                  <p className="text-xs text-brand-muted mt-0.5">إضافة خاصة مع الطلب</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-lg text-brand-espresso">{formatSARCompact(upsell.offered_price_sar)}</span>
                    <span className="text-xs text-brand-muted line-through">السعر العادي أعلى</span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <p className="text-center text-xs text-brand-muted mb-4">
                ينتهي العرض خلال <span className="font-bold text-brand-bronze">{timeLeft}</span> ثانية
              </p>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={handleAccept}
                  disabled={accepting || declining}
                  className="btn-primary w-full h-12 flex items-center justify-center gap-2"
                >
                  {accepting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  أضف العرض لطلبي
                </button>

                <button
                  onClick={handleDecline}
                  disabled={accepting || declining}
                  className="w-full py-2.5 text-sm text-brand-muted hover:text-brand-espresso transition-colors"
                >
                  لا شكرًا، أكمل الطلب
                </button>
              </div>

              <p className="text-center text-xs text-brand-muted/70 mt-3">
                بدون رسوم توصيل إضافية إذا شُحن مع نفس الطلب
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
