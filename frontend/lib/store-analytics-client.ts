"use client";

const SESSION_KEY = "mutqan_sid";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getUtmFromSession(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  return {
    utm_source: sessionStorage.getItem("utm_source") || undefined,
    utm_medium: sessionStorage.getItem("utm_medium") || undefined,
    utm_campaign: sessionStorage.getItem("utm_campaign") || undefined,
    utm_content: sessionStorage.getItem("utm_content") || undefined,
    utm_term: sessionStorage.getItem("utm_term") || undefined,
    referrer: sessionStorage.getItem("referrer") || document.referrer || undefined,
  };
}

export function trackStoreEvent(payload: {
  event_type: "page_view" | "product_view" | "add_to_cart" | "initiate_checkout";
  page_path?: string;
  product_slug?: string;
}) {
  if (typeof window === "undefined") return;
  const body = {
    ...payload,
    session_id: getOrCreateSessionId(),
    page_path: payload.page_path ?? window.location.pathname,
    ...getUtmFromSession(),
  };
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}
