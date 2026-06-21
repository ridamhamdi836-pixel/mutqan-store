"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShoppingBag, Trash2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StoreImage } from "@/components/ui/StoreImage";
import { useCart } from "@/providers/cart-provider";
import { PRODUCTS_CONFIG } from "@/config/products";
import { formatSARCompact } from "@/lib/currency";
import { CrossSellCard } from "./CrossSellCard";
import { cn } from "@/lib/utils";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { getProductCardImageSrc } from "@/lib/product-image";
import { STORE_IMAGE_SIZES } from "@/lib/image-display";
import { buildCartDisplayLines } from "@/lib/cart-bundles";

function CartItemImage({ slug, name }: { slug: string; name: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-20 aspect-square rounded-2xl overflow-hidden bg-brand-surface flex-shrink-0 border border-brand-gold/15">
      {!err ? (
        <StoreImage
          src={getProductCardImageSrc(slug)}
          alt={name}
          fill
          fit="contain"
          variant="thumbnail"
          sizes={STORE_IMAGE_SIZES.thumbnail}
          className="p-1.5"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-surface text-[10px] text-brand-muted px-1 text-center">
          {name}
        </div>
      )}
    </div>
  );
}

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, totalSar, itemCount, openCheckout } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const cartDisplayLines = buildCartDisplayLines(items);

  useEffect(() => {
    if (isOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const mainSlugs = items.filter((i) => i.itemType === "main").map((i) => i.productSlug);
  const cartSlugSet = new Set(items.map((i) => i.productSlug));
  const crossSellSlugs = mainSlugs.flatMap((slug) => PRODUCTS_CONFIG[slug]?.crossSellSlugs || [])
    .filter((slug, i, arr) => !cartSlugSet.has(slug) && arr.indexOf(slug) === i)
    .slice(0, 2);

  const handleCheckout = () => {
    firePixelEvent({
      eventId: generateEventId("initiate_checkout"),
      eventName: "InitiateCheckout",
      value: totalSar,
      currency: "SAR",
    });
    closeCart();
    setTimeout(() => openCheckout(), 150);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="drawer-backdrop z-[60]"
            onClick={closeCart}
            aria-hidden="true"
          />

          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="سلة المشتريات"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-y-0 start-0 z-[70] w-full max-w-[430px] bg-[#FAF8F6] shadow-2xl flex flex-col outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-brand-gold/15 bg-white/95">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-brand-espresso">سلة المشتريات</h2>
                  {itemCount > 0 && (
                    <p className="text-xs font-medium text-brand-muted">{itemCount} منتج</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="إغلاق السلة"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-brand-surface transition-colors"
              >
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>

            {/* Trust Bar */}
            <div className="px-5 py-3 bg-white border-b border-brand-gold/10">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-700 font-bold">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span>الدفع عند الاستلام · نؤكد قبل الشحن · ضمان 30 يوم</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-white border border-brand-gold/15 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="w-10 h-10 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-brand-espresso mb-1">سلتك فارغة</p>
                    <p className="text-sm text-brand-muted">تصفح منتجات متقن وأضف ما يناسبك</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 rounded-2xl bg-brand-espresso text-white font-bold text-sm hover:bg-brand-espresso/90 transition-colors shadow-md shadow-brand-espresso/15"
                  >
                    تصفح المنتجات
                  </button>
                </div>
              ) : (
                <div className="p-4 md:p-5 space-y-4">
                  {cartDisplayLines.map((line) =>
                    line.kind === "bundle" ? (
                      <div
                        key={line.id}
                        className="rounded-[24px] bg-white border border-brand-gold/20 shadow-sm p-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex -space-x-5 space-x-reverse shrink-0">
                            {line.items.map((item) => (
                              <CartItemImage
                                key={item.bundleId}
                                slug={item.productSlug}
                                name={item.productNameAr}
                              />
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-sm text-brand-espresso leading-snug">
                              {line.title}
                            </p>
                            <p className="text-xs font-semibold text-brand-gold mt-0.5">
                              {line.subtitle}
                            </p>
                            <ul className="mt-2 space-y-1 text-xs font-medium text-brand-muted">
                              {line.items.map((item) => (
                                <li key={item.bundleId}>• {item.productNameAr}</li>
                              ))}
                            </ul>
                            <p className="font-black text-brand-gold text-base mt-2">
                              {formatSARCompact(line.totalSar)}
                            </p>
                          </div>
                          <button
                            onClick={() => line.items.forEach((item) => removeItem(item.bundleId))}
                            aria-label="إزالة المجموعة الكاملة من متقن"
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={line.id}
                        className="flex items-center gap-3 p-3 rounded-[22px] bg-white border border-brand-gold/10 shadow-sm"
                      >
                        <CartItemImage slug={line.item.productSlug} name={line.item.productNameAr} />
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-sm text-brand-espresso leading-snug">
                            {line.item.productNameAr}
                          </p>
                          <p className="text-xs text-brand-muted mt-0.5">{line.item.bundleLabelAr}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="font-black text-brand-gold text-base">
                              {formatSARCompact(line.totalSar)}
                            </span>
                            {line.item.quantity > 1 && (
                              <span className="text-xs text-brand-muted">× {line.item.quantity}</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(line.item.bundleId)}
                          aria-label={`إزالة ${line.item.productNameAr}`}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  )}

                  {crossSellSlugs.length > 0 && (
                    <div className="pt-4 border-t border-brand-gold/15">
                      <h3 className="font-extrabold text-sm text-brand-espresso mb-3">أكملي تجربة متقن</h3>
                      <div className="space-y-3">
                        {crossSellSlugs.map((slug) => (
                          <CrossSellCard key={slug} productSlug={slug} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-brand-gold/15 px-4 py-3.5 space-y-2 bg-white shrink-0 shadow-[0_-10px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <span className="text-brand-muted font-bold text-sm">الإجمالي</span>
                  <span className="font-black text-2xl text-brand-espresso">
                    {formatSARCompact(totalSar)}
                  </span>
                </div>

                <p className="text-[11px] text-emerald-700 font-bold">
                  ✓ الشحن مجاني لجميع الطلبات
                </p>

                <button
                  onClick={handleCheckout}
                  className={cn(
                    "w-full h-12 rounded-2xl font-extrabold text-sm text-white",
                    "bg-brand-espresso hover:bg-brand-espresso/90 active:scale-[0.98]",
                    "transition-all duration-150 shadow-md shadow-brand-espresso/20",
                  )}
                >
                  أكمل الطلب · الدفع عند الاستلام
                </button>

                <p className="text-[10px] text-center text-brand-muted leading-snug">
                  لا حاجة لبطاقة دفع — ادفع نقدًا عند استلام طلبك
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
