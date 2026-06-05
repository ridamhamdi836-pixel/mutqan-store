import { NextResponse } from "next/server";
import { getBundledPixelConfig, mergePixelConfig } from "@/lib/browser-pixel-config";
import { getPixelConfig, getPixelConfigStatus } from "@/lib/pixel-config";

export const dynamic = "force-dynamic";

/** GET /api/debug/pixels — browser pixels + CAPI wiring status (no secrets). */
export async function GET() {
  const config = mergePixelConfig(getBundledPixelConfig(), getPixelConfig());
  const pixels = getPixelConfigStatus(config);

  const apiUrl = Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
  const secretKey = Boolean(process.env.SECRET_KEY?.trim());

  return NextResponse.json({
    ok: true,
    browser_pixels: pixels,
    capi: {
      api_url_set: apiUrl,
      secret_key_on_frontend: secretKey,
      ready: apiUrl && secretKey,
      note: "Set SECRET_KEY on frontend (same as backend) + META_ACCESS_TOKEN on backend for Meta CAPI Purchase",
    },
    backend_tokens_expected: {
      meta: "META_PIXEL_ID + META_ACCESS_TOKEN (both required for Meta CAPI)",
      tiktok: "TIKTOK_PIXEL_CODE + TIKTOK_ACCESS_TOKEN",
      snapchat: "SNAPCHAT_PIXEL_ID + SNAPCHAT_ACCESS_TOKEN",
    },
    browser_api: "/api/pixels/browser",
    baked_in_defaults: {
      tiktok: "D4GVCMBC77UAP3H8QDS0",
      snapchat: "d8f90588-0a07-41a3-87ed-0c829150b41a",
      meta: "META_PIXEL_ID env or frontend/config/web-pixels.ts",
    },
    after_change: "Redeploy frontend + backend, hard refresh store",
  });
}
