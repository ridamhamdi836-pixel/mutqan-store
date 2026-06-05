import { NextResponse } from "next/server";
import { getBundledPixelConfig, mergePixelConfig } from "@/lib/browser-pixel-config";
import { getHotjarSiteId } from "@/lib/hotjar-config";
import { getPixelConfig } from "@/lib/pixel-config";
import { WEB_ANALYTICS } from "@/config/web-analytics";

export const dynamic = "force-dynamic";

/** Public browser pixel IDs (same values that appear in page HTML). */
export async function GET() {
  const bundled = getBundledPixelConfig();
  const runtime = getPixelConfig();
  const pixels = mergePixelConfig(bundled, runtime);
  const hotjarSiteId = getHotjarSiteId();

  return NextResponse.json({
    ok: true,
    pixels,
    hotjarSiteId: hotjarSiteId || null,
    source: {
      meta: pixels.metaId === bundled.metaId ? "bundled" : "runtime_env",
      tiktok: pixels.tiktokId === bundled.tiktokId ? "bundled" : "runtime_env",
      snapchat:
        pixels.snapchatId === bundled.snapchatId ? "bundled" : "runtime_env",
      hotjar:
        hotjarSiteId === WEB_ANALYTICS.hotjarSiteId ? "bundled" : "runtime_env",
    },
  });
}
