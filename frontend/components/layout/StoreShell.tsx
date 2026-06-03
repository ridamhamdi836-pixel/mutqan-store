"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { StoreAnalyticsTracker } from "@/components/analytics/StoreAnalyticsTracker";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";
import type { CreateOrderResponse } from "@/types";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false },
);

const CheckoutModal = dynamic(
  () =>
    import("@/components/checkout/CheckoutModal").then((m) => m.CheckoutModal),
  { ssr: false },
);

export function StoreShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOrderSuccess = useCallback(
    (response: CreateOrderResponse) => {
      router.push(
        `/thank-you?order=${response.order.public_order_number}&total=${response.order.total_sar}`,
      );
    },
    [router],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StoreAnalyticsTracker />
      <TrustBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}
