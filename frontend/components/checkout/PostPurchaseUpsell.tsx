"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, Clock, Star, Flame, Truck, ShieldCheck, Gift } from "lucide-react";
import Image from "next/image";
import { formatSARCompact } from "@/lib/currency";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { CATALOG } from "@/config/catalog";
import { getProductImageSrc } from "@/lib/product-image";

interface UpsellProduct {
  slug: string;
  name_ar: string;
  hook_ar: string;
  image: string;
  original_price_sar: number;
  upsell_price_sar: number;
  savings_percent: number;
}

interface PostPurchaseUpsellProps {
  orderNumber: string;
  orderedSlugs: string[];
  onComplete: (addedItems: Array<{ slug: string; name_ar: string; price_sar: number }>) => void;
}

const ALL_UPSELL_PRODUCTS: UpsellProduct[] = CATALOG.filter((p) => p.upsell).map((p) => {
  const u = p.upsell!;
  const savings = Math.round(
    ((u.original_price_sar - u.upsell_price_sar) / u.original_price_sar) * 100,
  );
  return {
    slug: p.slug,
    name_ar: p.name_ar,
    hook_ar: u.hook_ar,
    image: getProductImageSrc(p.slug),
    original_price_sar: u.original_price_sar,
    upsell_price_sar: u.upsell_price_sar,
    savings_percent: savings,
  };
});

const TIMER_SECONDS = 180;

export function PostPurchaseUpsell({ orderNumber, orderedSlugs, onComplete }: PostPurchaseUpsellProps) {
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  const availableProducts = ALL_UPSELL_PRODUCTS.filter(
    (p) => !orderedSlugs.includes(p.slug)
  ).slice(0, 3);

  useEffect(() => {
    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_viewed"),
      eventName: "post_purchase_upsell_viewed",
      orderNumber,
    });
  }, [orderNumber]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      firePixelEvent({
        eventId: generateEventId("post_purchase_upsell_expired"),
        eventName: "post_purchase_upsell_expired",
        orderNumber,
      });
      onComplete([]);
    }
  }, [timeLeft, orderNumber, onComplete]);

  const toggleProduct = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const handleImgError = useCallback((slug: string) => {
    setImgErrors((prev) => new Set(prev).add(slug));
  }, []);

  const totalSavings = availableProducts
    .filter((p) => selectedSlugs.has(p.slug))
    .reduce((sum, p) => sum + (p.original_price_sar - p.upsell_price_sar), 0);

  const totalPrice = availableProducts
    .filter((p) => selectedSlugs.has(p.slug))
    .reduce((sum, p) => sum + p.upsell_price_sar, 0);

  const handleAddItems = async () => {
    if (selectedSlugs.size === 0) return;
    setAdding(true);

    const addedItems = availableProducts
      .filter((p) => selectedSlugs.has(p.slug))
      .map((p) => ({ slug: p.slug, name_ar: p.name_ar, price_sar: p.upsell_price_sar }));

    try {
      await fetch("/api/orders/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber, items: addedItems }),
      });
    } catch {
      // fail silently
    }

    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_accepted"),
      eventName: "post_purchase_upsell_accepted",
      orderNumber,
      value: totalPrice,
      currency: "SAR",
    });

    onComplete(addedItems);
  };

  const handleSkip = () => {
    firePixelEvent({
      eventId: generateEventId("post_purchase_upsell_skipped"),
      eventName: "post_purchase_upsell_skipped",
      orderNumber,
    });
    onComplete([]);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (availableProducts.length === 0) {
    onComplete([]);
    return null;
  }

  const timerUrgent = timeLeft < 60;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
      />

      {/* Centered modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="عرض خاص بعد الطلب"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="w-full max-w-md bg-brand-surface rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ── Urgency timer bar ── */}
          <div className={`relative px-4 py-2.5 text-center text-sm font-bold text-white ${timerUrgent ? "bg-red-600" : "bg-gradient-to-l from-brand-bronze to-amber-600"}`}>
            <div className="flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 animate-pulse" />
              <span>هذا العرض ينتهي خلال</span>
              <span className="bg-white/20 rounded-md px-2 py-0.5 tabular-nums font-mono text-base">{formatTime(timeLeft)}</span>
            </div>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10">
              <motion.div
                className="h-full bg-white/50"
                style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          {/* ── Success confirmation ── */}
          <div className="px-5 pt-4 pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-700 text-sm">تم تأكيد طلبك بنجاح</p>
                <p className="text-[11px] text-brand-muted">طلب #{orderNumber} · الدفع عند الاستلام</p>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center space-y-1.5">
              <h2 className="font-black text-xl text-brand-espresso leading-tight">
                🎁 عرض لمرة واحدة فقط
              </h2>
              <p className="text-sm text-brand-espresso font-semibold leading-snug">
                أضف لطلبك الحالي بسعر خاص لن يتكرر — <span className="text-brand-trust">توصيل مجاني</span> مع نفس الشحنة
              </p>
              <p className="text-xs text-red-500 font-bold">
                ⚠️ هذا السعر متاح الآن فقط ولن يظهر مرة أخرى
              </p>
            </div>
          </div>

          {/* ── Products ── */}
          <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2.5">
            {availableProducts.map((product) => {
              const isSelected = selectedSlugs.has(product.slug);
              const hasImgError = imgErrors.has(product.slug);

              return (
                <motion.button
                  key={product.slug}
                  type="button"
                  onClick={() => toggleProduct(product.slug)}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-start gap-3 rounded-xl border-2 p-3 transition-all duration-200 text-start relative ${
                    isSelected
                      ? "border-brand-trust bg-brand-trust/5 shadow-md shadow-brand-trust/10"
                      : "border-brand-border bg-white hover:border-brand-bronze/30 hover:shadow-sm"
                  }`}
                >
                  {/* Discount badge */}
                  <span className="absolute -top-2.5 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    خصم {product.savings_percent}%
                  </span>

                  {/* Checkbox */}
                  <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected ? "bg-brand-trust border-brand-trust scale-110" : "border-brand-muted/30 bg-white"
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Image */}
                  <div className="relative w-[60px] h-[60px] rounded-lg overflow-hidden bg-brand-beige flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name_ar}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => handleImgError(product.slug)}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-brand-espresso leading-snug">{product.name_ar}</p>
                    <p className="text-[11px] text-brand-muted leading-relaxed mt-0.5">{product.hook_ar}</p>

                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      ))}
                      <span className="text-[9px] text-brand-muted mr-1">(+1,000 طلب)</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-black text-lg text-brand-espresso leading-none">{product.upsell_price_sar} <span className="text-xs font-bold">ر.س</span></span>
                      <span className="text-xs text-red-400 line-through font-medium">{product.original_price_sar} ر.س</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div className="border-t-2 border-brand-border px-4 py-3.5 space-y-2.5 bg-gradient-to-t from-brand-beige/50 to-brand-surface">
            {/* Savings summary */}
            {selectedSlugs.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2"
              >
                <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  وفّرت {totalSavings} ر.س
                </span>
                <span className="font-black text-green-800 text-lg">{formatSARCompact(totalPrice)}</span>
              </motion.div>
            )}

            {/* Main CTA */}
            <button
              onClick={selectedSlugs.size > 0 ? handleAddItems : undefined}
              disabled={adding || selectedSlugs.size === 0}
              className={`w-full h-14 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                selectedSlugs.size > 0
                  ? "btn-primary shadow-lg shadow-brand-bronze/25 hover:shadow-xl hover:-translate-y-0.5 animate-pulse-slow"
                  : "bg-brand-muted/10 text-brand-muted cursor-not-allowed"
              }`}
            >
              {adding ? (
                <span className="animate-pulse">جارٍ الإضافة لطلبك...</span>
              ) : selectedSlugs.size > 0 ? (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  نعم، أضف لطلبي الآن
                </>
              ) : (
                "اختر منتج واحد على الأقل"
              )}
            </button>

            {/* Trust badges row */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-brand-muted">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                توصيل مجاني
              </span>
              <span className="text-brand-border">|</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                ضمان 30 يوم
              </span>
              <span className="text-brand-border">|</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                الدفع عند الاستلام
              </span>
            </div>

            {/* Skip link */}
            <button
              onClick={handleSkip}
              disabled={adding}
              className="w-full py-1.5 text-[11px] text-brand-muted/60 hover:text-brand-muted transition-colors"
            >
              لا شكرًا، لا أريد التوفير
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
