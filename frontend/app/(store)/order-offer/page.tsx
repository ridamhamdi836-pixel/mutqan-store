"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PostPurchaseOffer } from "@/components/thank-you/PostPurchaseOffer";
import { ThankYouPageSkeleton } from "@/components/thank-you/ThankYouPageSkeleton";
import {
  buildThankYouUrl,
  loadLastOrderSession,
} from "@/lib/last-order-session";
import { hasPostPurchaseUpsell } from "@/lib/thank-you-product";

function OrderOfferContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [orderedSlugs, setOrderedSlugs] = useState<string[]>([]);

  const orderNumber =
    params?.get("order") || loadLastOrderSession()?.orderNumber || "";
  const totalParam = params?.get("total");
  const totalSar = useMemo(() => {
    const fromUrl = totalParam ? parseInt(totalParam, 10) : 0;
    if (fromUrl > 0) return fromUrl;
    return loadLastOrderSession()?.totalSar ?? 0;
  }, [totalParam]);

  useEffect(() => {
    const session = loadLastOrderSession();

    if (!orderNumber) {
      router.replace("/thank-you");
      return;
    }

    if (session?.upsellOfferCompleted) {
      router.replace(buildThankYouUrl(orderNumber, totalSar));
      return;
    }

    const slugs = session?.orderedSlugs ?? [];
    setOrderedSlugs(slugs);

    if (!hasPostPurchaseUpsell(slugs)) {
      router.replace(buildThankYouUrl(orderNumber, totalSar));
      return;
    }

    setReady(true);
  }, [orderNumber, totalSar, router]);

  if (!ready || !orderNumber) {
    return <ThankYouPageSkeleton />;
  }

  return (
    <div className="py-6 md:py-8 page-x">
      <PostPurchaseOffer
        orderNumber={orderNumber}
        orderedSlugs={orderedSlugs}
        onFinished={(finalTotal) => {
          router.replace(buildThankYouUrl(orderNumber, finalTotal || totalSar));
        }}
      />
    </div>
  );
}

export default function OrderOfferPage() {
  return (
    <Suspense fallback={<ThankYouPageSkeleton />}>
      <OrderOfferContent />
    </Suspense>
  );
}
