"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackStoreEvent } from "@/lib/store-analytics-client";

export function StoreAnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const productMatch = pathname.match(/^\/products\/([^/]+)/);
    if (productMatch) {
      trackStoreEvent({
        event_type: "product_view",
        product_slug: productMatch[1],
        page_path: pathname,
      });
    } else {
      trackStoreEvent({ event_type: "page_view", page_path: pathname });
    }
  }, [pathname]);

  return null;
}
