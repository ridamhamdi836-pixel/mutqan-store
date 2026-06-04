import { NextResponse } from "next/server";
import { getPixelConfig, getPixelConfigStatus } from "@/lib/pixel-config";

/** GET /api/debug/pixels — browser pixels + CAPI wiring status (no secrets). */
export async function GET() {
  const config = getPixelConfig();
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
      note: "CAPI tokens stay on BACKEND; frontend calls /api/v1/conversions/purchase after checkout",
    },
    backend_tokens_expected: {
      meta: "META_PIXEL_ID + META_ACCESS_TOKEN (both required for Meta CAPI)",
      tiktok: "TIKTOK_PIXEL_CODE + TIKTOK_ACCESS_TOKEN",
      snapchat: "SNAPCHAT_PIXEL_ID + SNAPCHAT_ACCESS_TOKEN",
    },
    fix_empty_duplicates:
      "Remove empty NEXT_PUBLIC_TIKTOK_PIXEL_ID lines on frontend — keep one line or use TIKTOK_PIXEL_CODE only",
    after_change: "Redeploy frontend + backend, hard refresh store",
  });
}
