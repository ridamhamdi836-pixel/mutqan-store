/**
 * Pixel IDs for the storefront — read on the server at runtime (Easypanel env after deploy).
 * Supports NEXT_PUBLIC_* and backend-style names so one set of vars works on the frontend service.
 */

export type PixelConfig = {
  metaId?: string;
  tiktokId?: string;
  snapchatId?: string;
};

/** Last non-empty wins (Easypanel sometimes lists empty NEXT_PUBLIC_* before filled lines). */
function pick(...values: (string | undefined)[]): string | undefined {
  let chosen: string | undefined;
  for (const v of values) {
    const t = v?.trim();
    if (t) chosen = t;
  }
  return chosen;
}

export function getPixelConfig(): PixelConfig {
  if (process.env.NEXT_PUBLIC_ENABLE_PIXELS === "false") {
    return {};
  }

  return {
    metaId: pick(
      process.env.META_PIXEL_ID,
      process.env.NEXT_PUBLIC_META_PIXEL_ID,
    ),
    tiktokId: pick(
      process.env.TIKTOK_PIXEL_CODE,
      process.env.TIKTOK_PIXEL_ID,
      process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    ),
    snapchatId: pick(
      process.env.SNAPCHAT_PIXEL_ID,
      process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID,
      process.env.NEXT_PUBLIC_SNAP_PIXEL_ID,
    ),
  };
}

export function getPixelConfigStatus(config: PixelConfig) {
  return {
    meta: Boolean(config.metaId),
    tiktok: Boolean(config.tiktokId),
    snapchat: Boolean(config.snapchatId),
    meta_suffix: config.metaId?.slice(-4),
    tiktok_suffix: config.tiktokId?.slice(-4),
    snapchat_suffix: config.snapchatId?.slice(-4),
  };
}
