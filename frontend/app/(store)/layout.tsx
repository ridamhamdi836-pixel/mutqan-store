"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { PostPurchaseUpsell } from "@/components/checkout/PostPurchaseUpsell";
import type { CreateOrderResponse } from "@/types";
import { useRouter } from "next/navigation";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [orderResponse, setOrderResponse] = useState<CreateOrderResponse | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const handleOrderSuccess = (response: CreateOrderResponse) => {
    setOrderResponse(response);
    setShowUpsell(true);
  };

  const goToThankYou = useCallback((order: CreateOrderResponse["order"], extraTotal = 0) => {
    const finalTotal = order.total_sar + extraTotal;
    router.push(`/thank-you?order=${order.public_order_number}&total=${finalTotal}`);
  }, [router]);

  const handleUpsellComplete = useCallback((addedItems: Array<{ slug: string; name_ar: string; price_sar: number }>) => {
    setShowUpsell(false);
    if (!orderResponse) return;
    const extraTotal = addedItems.reduce((sum, item) => sum + item.price_sar, 0);
    goToThankYou(orderResponse.order, extraTotal);
  }, [orderResponse, goToThankYou]);

  return (
    <div className="min-h-screen flex flex-col">
      <TrustBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      <CartDrawer />
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />

      {showUpsell && orderResponse && (
        <PostPurchaseUpsell
          orderNumber={orderResponse.order.public_order_number}
          orderedSlugs={orderResponse.order_slugs || []}
          onComplete={handleUpsellComplete}
        />
      )}
    </div>
  );
}
