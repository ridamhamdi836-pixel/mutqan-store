"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ThankYouHero } from "@/components/thank-you/ThankYouHero";
import { ThankYouOrderSummary } from "@/components/thank-you/ThankYouOrderSummary";
import { ThankYouStatsBar } from "@/components/thank-you/ThankYouStatsBar";
import { ThankYouOrderTimeline } from "@/components/thank-you/ThankYouOrderTimeline";
import { ThankYouReviews } from "@/components/thank-you/ThankYouReviews";
import { ThankYouLiveActivity } from "@/components/thank-you/ThankYouLiveActivity";
import { ThankYouFaq } from "@/components/thank-you/ThankYouFaq";
import { ThankYouPageSkeleton } from "@/components/thank-you/ThankYouPageSkeleton";
import {
  buildOrderOfferUrl,
  loadLastOrderSession,
  type LastOrderLineItem,
} from "@/lib/last-order-session";
import { hasPostPurchaseUpsell } from "@/lib/thank-you-product";
import { useRouter } from "next/navigation";
import { formatDisplayPhone } from "@/lib/format-display-phone";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/config/brand";

function ThankYouContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [sessionItems, setSessionItems] = useState<LastOrderLineItem[]>([]);
  const [displayTotalSar, setDisplayTotalSar] = useState(0);
  const [customerName, setCustomerName] = useState<string | undefined>();
  const [customerPhone, setCustomerPhone] = useState<string | undefined>();

  const orderNumber =
    params?.get("order") || loadLastOrderSession()?.orderNumber || "";
  const totalParam = params?.get("total");
  const initialTotalSar = useMemo(() => {
    const fromUrl = totalParam ? parseInt(totalParam, 10) : 0;
    if (fromUrl > 0) return fromUrl;
    return loadLastOrderSession()?.totalSar ?? 0;
  }, [totalParam]);

  useEffect(() => {
    setDisplayTotalSar(initialTotalSar);
  }, [initialTotalSar]);

  useEffect(() => {
    const session = loadLastOrderSession();
    if (session) {
      setSessionItems(session.items);
      setDisplayTotalSar(session.totalSar);
      if (session.customerName) setCustomerName(session.customerName);
      if (session.phoneE164) {
        setCustomerPhone(formatDisplayPhone(session.phoneE164));
      }

      if (
        orderNumber &&
        !session.upsellOfferCompleted &&
        hasPostPurchaseUpsell(session.orderedSlugs)
      ) {
        router.replace(buildOrderOfferUrl(orderNumber, session.totalSar));
        return;
      }
    }
    setReady(true);
  }, [orderNumber, router]);

  useEffect(() => {
    if (!orderNumber) return;
    firePixelEvent({
      eventId: generateEventId("thank_you_view"),
      eventName: "thank_you_view",
      orderNumber,
    });
  }, [orderNumber]);

  if (!ready) {
    return <ThankYouPageSkeleton />;
  }

  return (
    <div className="py-8 md:py-12 page-x pb-10">
      <div className="max-w-xl mx-auto space-y-5 md:space-y-6">
        <ThankYouHero />

        <ThankYouOrderSummary
          orderNumber={orderNumber}
          totalSar={displayTotalSar}
          items={sessionItems}
          customerName={customerName}
          customerPhone={customerPhone}
        />

        <ThankYouStatsBar />

        <ThankYouOrderTimeline />

        <ThankYouReviews />

        <ThankYouLiveActivity />

        <ThankYouFaq />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-4">
          <Link
            href="/track-order"
            className="text-sm font-semibold text-brand-bronze hover:text-brand-espresso min-h-[44px] flex items-center"
          >
            تتبع الطلب لاحقًا
          </Link>
          <span className="hidden sm:inline text-brand-border">·</span>
          <a
            href={WHATSAPP_URL("مرحبًا، أتممت طلبًا وأحتاج مساعدة")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-muted hover:text-brand-espresso min-h-[44px] flex items-center"
          >
            مساعدة عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouPageSkeleton />}>
      <ThankYouContent />
    </Suspense>
  );
}
