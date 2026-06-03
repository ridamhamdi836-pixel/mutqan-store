"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ConfirmationBanner } from "@/components/thank-you/ConfirmationBanner";
import { ThankYouOrderSummary } from "@/components/thank-you/ThankYouOrderSummary";
import { CallPrepSection } from "@/components/thank-you/CallPrepSection";
import { ThankYouSocialProof } from "@/components/thank-you/ThankYouSocialProof";
import { ThankYouRecommendations } from "@/components/thank-you/ThankYouRecommendations";
import { ThankYouFaq } from "@/components/thank-you/ThankYouFaq";
import { getCallExpectation } from "@/lib/call-window";
import {
  loadLastOrderSession,
  type LastOrderLineItem,
} from "@/lib/last-order-session";
import { firePixelEvent, generateEventId } from "@/lib/analytics";
import { WHATSAPP_URL } from "@/config/brand";

function ThankYouContent() {
  const params = useSearchParams();
  const [sessionItems, setSessionItems] = useState<LastOrderLineItem[]>([]);
  const [orderedSlugs, setOrderedSlugs] = useState<string[]>([]);

  const orderNumber =
    params?.get("order") || loadLastOrderSession()?.orderNumber || "";
  const totalParam = params?.get("total");
  const totalSar = useMemo(() => {
    const fromUrl = totalParam ? parseInt(totalParam, 10) : 0;
    if (fromUrl > 0) return fromUrl;
    return loadLastOrderSession()?.totalSar ?? 0;
  }, [totalParam]);

  const expectation = useMemo(() => getCallExpectation(), []);

  useEffect(() => {
    const session = loadLastOrderSession();
    if (session) {
      setSessionItems(session.items);
      setOrderedSlugs(session.orderedSlugs);
    }
  }, []);

  useEffect(() => {
    if (!orderNumber) return;
    firePixelEvent({
      eventId: generateEventId("thank_you_view"),
      eventName: "thank_you_view",
      orderNumber,
    });
  }, [orderNumber]);

  return (
    <div className="py-10 md:py-14 page-x">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-trust/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-brand-trust" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-brand-espresso">
            تم استلام طلبك بنجاح
          </h1>
          <p className="text-sm text-brand-muted leading-relaxed max-w-md mx-auto">
            خطوة واحدة تفصلك عن الشحن:{" "}
            <strong className="text-brand-espresso">الرد على مكالمة التأكيد</strong>
            . لا نعرض بياناتك هنا — نتصل على نفس رقم الطلب فقط.
          </p>
        </div>

        <ConfirmationBanner expectation={expectation} />

        <ThankYouOrderSummary
          orderNumber={orderNumber}
          totalSar={totalSar}
          items={sessionItems}
        />

        <CallPrepSection expectation={expectation} />

        {orderNumber ? (
          <ThankYouRecommendations
            orderNumber={orderNumber}
            orderedSlugs={orderedSlugs}
          />
        ) : null}

        <ThankYouSocialProof />

        <ThankYouFaq />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/track-order"
            className="text-sm font-semibold text-brand-bronze hover:text-brand-espresso"
          >
            تتبع الطلب لاحقًا
          </Link>
          <span className="hidden sm:inline text-brand-border">·</span>
          <a
            href={WHATSAPP_URL("مرحبًا، أتممت طلبًا وأحتاج مساعدة")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-muted hover:text-brand-espresso"
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
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-brand-muted">جارٍ التحميل...</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
