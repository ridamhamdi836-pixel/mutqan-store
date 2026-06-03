"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { StoreAnalyticsTracker } from "@/components/analytics/StoreAnalyticsTracker";
import { Header } from "@/components/layout/Header";
import { TrustBar } from "@/components/layout/TrustBar";
import { Footer } from "@/components/layout/Footer";
import type { CreateOrderResponse } from "@/types";
import { hasPostPurchaseUpsell } from "@/lib/thank-you-product";
import {
  buildOrderOfferUrl,
  buildThankYouUrl,
  loadLastOrderSession,
} from "@/lib/last-order-session";

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
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith("/products/");

  const handleOrderSuccess = useCallback(
    (response: CreateOrderResponse) => {
      const orderNumber = response.order.public_order_number;
      const totalSar = response.order.total_sar;
      const slugs =
        response.order_slugs ??
        loadLastOrderSession()?.orderedSlugs ??
        [];

      if (hasPostPurchaseUpsell(slugs)) {
        router.push(buildOrderOfferUrl(orderNumber, totalSar));
      } else {
        router.push(buildThankYouUrl(orderNumber, totalSar));
      }
    },
    [router],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <StoreAnalyticsTracker />
      {!isProductPage ? <TrustBar /> : null}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <CheckoutModal onOrderSuccess={handleOrderSuccess} />
    </div>
  );
}
