"use client";

import { Suspense, useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

type HotjarTrackerProps = {
  siteId: string;
};

declare global {
  interface Window {
    hj?: (...args: unknown[]) => void;
    _hjSettings?: { hjid: number; hjsv: number };
  }
}

function isStorePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return !pathname.startsWith("/admin");
}

function HotjarRouteSync({ siteId }: HotjarTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!siteId || !isStorePath(pathname)) return;
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.hj?.("stateChange", url);
  }, [siteId, pathname, searchParams]);

  if (!siteId || !isStorePath(pathname)) return null;

  const hjid = Number.parseInt(siteId, 10);
  if (!Number.isFinite(hjid) || hjid <= 0) return null;

  return (
    <Script id="hotjar-tracking" strategy="afterInteractive">
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hjid},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
  );
}

export function HotjarTracker({ siteId }: HotjarTrackerProps) {
  if (!siteId?.trim()) return null;

  return (
    <Suspense fallback={null}>
      <HotjarRouteSync siteId={siteId.trim()} />
    </Suspense>
  );
}
