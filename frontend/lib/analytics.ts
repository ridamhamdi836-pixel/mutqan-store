"use client";

import type { MutqanAnalyticsEvent } from "@/types";

let sessionTracking: Record<string, string> = {};

export function generateEventId(eventName: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `mqn_${eventName}_${ts}_${rand}`;
}

export function captureUTMAndClickIds(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "ttclid", "sc_click_id"];
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) {
      sessionStorage.setItem(k, v);
      sessionTracking[k] = v;
    }
  });
  sessionStorage.setItem("landing_page", window.location.href);
  sessionStorage.setItem("referrer", document.referrer);
}

export function getSessionTracking() {
  if (typeof window === "undefined") return {};
  return {
    utm_source: sessionStorage.getItem("utm_source") || undefined,
    utm_medium: sessionStorage.getItem("utm_medium") || undefined,
    utm_campaign: sessionStorage.getItem("utm_campaign") || undefined,
    utm_content: sessionStorage.getItem("utm_content") || undefined,
    utm_term: sessionStorage.getItem("utm_term") || undefined,
    meta_fbp: getCookie("_fbp") || undefined,
    meta_fbc:
      getCookie("_fbc") ||
      (sessionStorage.getItem("fbclid")
        ? `fb.1.${Date.now()}.${sessionStorage.getItem("fbclid")}`
        : undefined),
    tiktok_click_id: sessionStorage.getItem("ttclid") || undefined,
    snapchat_click_id: sessionStorage.getItem("sc_click_id") || undefined,
    landing_page: sessionStorage.getItem("landing_page") || window.location.href,
    referrer: sessionStorage.getItem("referrer") || document.referrer,
    user_agent: navigator.userAgent,
  };
}

function getCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : undefined;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: object, opts?: object) => void;
      page: () => void;
      load: (id: string) => void;
      push: (args: unknown[]) => void;
    };
    snaptr?: (cmd: string, event?: string, data?: object) => void;
  }
}

function getTtq() {
  if (typeof window === "undefined") return undefined;
  return window.ttq;
}

const AD_PLATFORM_EVENTS = new Set([
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
]);

function mapContentsForMeta(event: MutqanAnalyticsEvent): {
  contents: Array<{ id: string; quantity: number; item_price?: number }>;
  content_ids: string[];
  num_items: number;
} {
  if (event.contents?.length) {
    const contents = event.contents.map((c) => ({
      id: c.id,
      quantity: c.quantity || 1,
      item_price: c.item_price,
    }));
    return {
      contents,
      content_ids: contents.map((c) => c.id),
      num_items: contents.reduce((sum, c) => sum + c.quantity, 0),
    };
  }
  if (event.productSlug) {
    return {
      contents: [
        {
          id: event.productSlug,
          quantity: event.quantity || 1,
          item_price: event.value,
        },
      ],
      content_ids: [event.productSlug],
      num_items: event.quantity || 1,
    };
  }
  if (event.orderNumber) {
    return {
      contents: [{ id: event.orderNumber, quantity: 1, item_price: event.value }],
      content_ids: [event.orderNumber],
      num_items: 1,
    };
  }
  return { contents: [], content_ids: [], num_items: 0 };
}

function mapContentsForTikTok(
  event: MutqanAnalyticsEvent,
): Array<{ content_id: string; content_name?: string; quantity: number; price?: number }> {
  if (event.contents?.length) {
    return event.contents.map((c) => ({
      content_id: c.id,
      quantity: c.quantity || 1,
      price: c.item_price,
    }));
  }
  if (event.productSlug) {
    return [
      {
        content_id: event.productSlug,
        content_name: event.productName,
        quantity: event.quantity || 1,
        price: event.value,
      },
    ];
  }
  return [];
}

const PURCHASE_FIRED_PREFIX = "mutqan_purchase_px_fired:";

function buildPurchaseEvent(params: {
  orderNumber: string;
  eventId: string;
  value: number;
  contents?: MutqanAnalyticsEvent["contents"];
}): MutqanAnalyticsEvent {
  return {
    eventId: params.eventId,
    eventName: "Purchase",
    value: params.value,
    currency: "SAR",
    orderNumber: params.orderNumber,
    contents: params.contents,
  };
}

function trackMetaPurchase(event: MutqanAnalyticsEvent): void {
  if (!window.fbq) return;
  const { contents, content_ids, num_items } = mapContentsForMeta(event);
  window.fbq(
    "track",
    "Purchase",
    {
      currency: "SAR",
      value: event.value ?? 0,
      content_type: "product",
      contents,
      content_ids,
      num_items,
      order_id: event.orderNumber,
    },
    { eventID: event.eventId },
  );
}

function trackTikTokCompletePayment(event: MutqanAnalyticsEvent): void {
  const ttq = getTtq();
  if (!ttq?.track) return;

  let contents = mapContentsForTikTok(event);
  if (!contents.length && event.orderNumber) {
    contents = [
      {
        content_id: event.orderNumber,
        quantity: 1,
        price: event.value,
      },
    ];
  }

  ttq.track(
    "CompletePayment",
    {
      content_type: "product",
      contents,
      value: event.value ?? 0,
      currency: "SAR",
      order_id: event.orderNumber,
    },
    { event_id: event.eventId },
  );
}

function purchasePixelsReady(): boolean {
  return Boolean(window.fbq && getTtq()?.track);
}

function whenPurchasePixelsReady(run: () => void): void {
  if (purchasePixelsReady()) {
    run();
    return;
  }
  const ttq = getTtq();
  const readyFn = (ttq as { ready?: (cb: () => void) => void } | undefined)?.ready;
  if (typeof readyFn === "function") {
    readyFn.call(ttq, () => {
      if (window.fbq) run();
    });
  }
  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (purchasePixelsReady() || attempts >= 30) {
      window.clearInterval(timer);
      run();
    }
  }, 200);
}

/** Fire Purchase (Meta + TikTok CompletePayment + Snapchat) once per order. */
export function firePurchasePixelOnce(params: {
  orderNumber: string;
  eventId: string;
  value: number;
  contents?: MutqanAnalyticsEvent["contents"];
}): void {
  if (typeof window === "undefined") return;
  const dedupeKey = `${PURCHASE_FIRED_PREFIX}${params.orderNumber}`;
  if (sessionStorage.getItem(dedupeKey)) return;

  const event = buildPurchaseEvent(params);

  const send = () => {
    if (sessionStorage.getItem(dedupeKey)) return;
    firePixelEvent(event);
    sessionStorage.setItem(dedupeKey, params.eventId);
  };

  whenPurchasePixelsReady(send);
}

export function firePixelEvent(event: MutqanAnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (!AD_PLATFORM_EVENTS.has(event.eventName)) return;

  try {
    if (event.eventName === "Purchase") {
      trackMetaPurchase(event);
    } else if (window.fbq) {
      const { eventName, value, productName, eventId } = event;
      const pixelEventMap: Record<string, string> = {
        ViewContent: "ViewContent",
        AddToCart: "AddToCart",
        InitiateCheckout: "InitiateCheckout",
      };
      const mappedEvent = pixelEventMap[eventName] || eventName;
      const { contents, content_ids, num_items } = mapContentsForMeta(event);
      const data: Record<string, unknown> = {
        currency: "SAR",
        content_type: "product",
        contents,
        content_ids,
        num_items,
      };
      if (value != null) data.value = value;
      if (productName) data.content_name = productName;
      window.fbq("track", mappedEvent, data, { eventID: eventId });
    }
  } catch {}

  try {
    if (event.eventName === "Purchase") {
      trackTikTokCompletePayment(event);
    } else {
      const ttq = getTtq();
      if (ttq?.track) {
        const ttqEventMap: Record<string, string> = {
          ViewContent: "ViewContent",
          AddToCart: "AddToCart",
          InitiateCheckout: "InitiateCheckout",
        };
        const ttqEvent = ttqEventMap[event.eventName] || event.eventName;
        ttq.track(
          ttqEvent,
          {
            contents: mapContentsForTikTok(event),
            value: event.value,
            currency: "SAR",
          },
          { event_id: event.eventId },
        );
      }
    }
  } catch {}

  try {
    if (window.snaptr) {
      const scEventMap: Record<string, string> = {
        ViewContent: "VIEW_CONTENT",
        AddToCart: "ADD_CART",
        InitiateCheckout: "START_CHECKOUT",
        Purchase: "PURCHASE",
      };
      const scEvent = scEventMap[event.eventName] || event.eventName;
      const itemIds =
        event.contents?.map((c) => c.id) ||
        (event.productSlug ? [event.productSlug] : []);
      window.snaptr("track", scEvent, {
        price: event.value,
        currency: "SAR",
        transaction_id: event.orderNumber,
        item_ids: itemIds,
        client_dedup_id: event.eventId,
      });
    }
  } catch {}
}
