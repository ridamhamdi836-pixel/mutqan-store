"use client";

import { useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import type { CreateOrderResponse } from "@/types";
import { useRouter } from "next/navigation";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const goToThankYou = useCallback((order: CreateOrderResponse["order"]) => {
    router.push(
      `/thank-you?order=${order.public_order_number}&total=${order.total_sar}`,
    );
  }, [router]);

  const handleOrderSuccess = (response: CreateOrderResponse) => {
    goToThankYou(response.order);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TrustBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      <CartDrawer />
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}
