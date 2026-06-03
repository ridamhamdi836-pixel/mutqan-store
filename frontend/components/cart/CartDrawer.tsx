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

function CartItemImage({ slug, name }: { slug: string; name: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="relative w-20 aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
      {!err ? (
        <StoreImage
          src={getProductCardImageSrc(slug)}
          alt={name}
          fill
          variant="thumbnail"
          sizes={STORE_IMAGE_SIZES.thumbnail}
          onError={() => setErr(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-[10px] text-gray-400 px-1 text-center">
          {name}
        </div>
      )}
    </div>
  );
}

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, totalSar, itemCount, openCheckout } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

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
            className="fixed inset-y-0 start-0 z-[70] w-full max-w-[420px] bg-white shadow-2xl flex flex-col outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4DDB]/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#1B4DDB]" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">سلة المشتريات</h2>
                  {itemCount > 0 && (
                    <p className="text-xs text-gray-500">{itemCount} منتج</p>
                  )}
                </div>
              </div>
              <button
                onClick={closeCart}
                aria-label="إغلاق السلة"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Trust Bar */}
            <div className="px-6 py-3 bg-[#10B981]/8 border-b border-[#10B981]/15">
              <div className="flex items-center gap-2 text-[13px] text-[#10B981] font-semibold">
                <CreditCard className="w-4 h-4 flex-shrink-0" />
                <span>الدفع عند الاستلام · نؤكد قبل الشحن · ضمان 30 يوم</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-1">سلتك فارغة</p>
                    <p className="text-sm text-gray-500">تصفح منتجاتنا وأضف ما يناسبك</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="px-6 py-3 rounded-xl bg-[#1B4DDB] text-white font-semibold text-sm hover:bg-[#1B4DDB]/90 transition-colors"
                  >
                    تصفح المنتجات
                  </button>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.bundleId}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <CartItemImage slug={item.productSlug} name={item.productNameAr} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 leading-snug">
                          {item.productNameAr}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.bundleLabelAr}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-bold text-[#1B4DDB] text-base">
                            {formatSARCompact(item.priceSar)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-xs text-gray-400">× {item.quantity}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.bundleId)}
                        aria-label={`إزالة ${item.productNameAr}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {crossSellSlugs.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="font-bold text-sm text-gray-900 mb-3">أكمل تجربتك</h3>
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
              <div className="border-t border-gray-200 p-6 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium text-base">الإجمالي</span>
                  <span className="font-bold text-2xl text-gray-900">
                    {formatSARCompact(totalSar)}
                  </span>
                </div>

                <p className="text-xs text-[#10B981] font-medium">
                  ✓ الشحن مجاني لجميع الطلبات
                </p>

                <button
                  onClick={handleCheckout}
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold text-base text-white",
                    "bg-[#1B4DDB] hover:bg-[#1640b8] active:scale-[0.98]",
                    "transition-all duration-150 shadow-lg shadow-[#1B4DDB]/25"
                  )}
                >
                  أكمل الطلب · الدفع عند الاستلام
                </button>

                <p className="text-[11px] text-center text-gray-400">
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
