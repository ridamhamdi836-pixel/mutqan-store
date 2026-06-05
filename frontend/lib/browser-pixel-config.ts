/**
 * Browser pixel IDs — always from bundled WEB_PIXEL_IDS (works with static Next.js build).
 * Runtime env from /api/pixels/browser can override Meta when set on Easypanel.
 */

import { WEB_PIXEL_IDS } from "@/config/web-pixels";
import type { PixelConfig } from "@/lib/pixel-config";

function pick(...values: (string | undefined | null)[]): string | undefined {
  let chosen: string | undefined;
  for (const v of values) {
    const t = v?.trim();
    if (t) chosen = t;
  }
  return chosen;
}

/** IDs embedded in the client bundle — reliable even when layout is statically generated. */
export function getBundledPixelConfig(): PixelConfig {
  return {
    metaId: WEB_PIXEL_IDS.meta || undefined,
    tiktokId: WEB_PIXEL_IDS.tiktok,
    snapchatId: WEB_PIXEL_IDS.snapchat,
  };
}

export function mergePixelConfig(
  bundled: PixelConfig,
  runtime?: Partial<PixelConfig> | null,
): PixelConfig {
  return {
    metaId: pick(runtime?.metaId, bundled.metaId),
    tiktokId: pick(runtime?.tiktokId, bundled.tiktokId),
    snapchatId: pick(runtime?.snapchatId, bundled.snapchatId),
  };
}
