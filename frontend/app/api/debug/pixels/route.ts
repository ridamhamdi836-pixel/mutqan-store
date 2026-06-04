import { NextResponse } from "next/server";
import { getPixelConfig, getPixelConfigStatus } from "@/lib/pixel-config";

/** GET /api/debug/pixels — which browser pixels are configured (no full IDs). */
export async function GET() {
  const config = getPixelConfig();
  const status = getPixelConfigStatus(config);

  return NextResponse.json({
    ok: true,
    pixels: status,
    hint: {
      frontend_only:
        "Browser pixels load from the FRONTEND service env. NEXT_PUBLIC_* on backend is ignored.",
      names: {
        meta: "NEXT_PUBLIC_META_PIXEL_ID or META_PIXEL_ID",
        tiktok: "NEXT_PUBLIC_TIKTOK_PIXEL_ID or TIKTOK_PIXEL_CODE",
        snapchat: "NEXT_PUBLIC_SNAPCHAT_PIXEL_ID or NEXT_PUBLIC_SNAP_PIXEL_ID or SNAPCHAT_PIXEL_ID",
      },
      after_change: "Save env → Redeploy frontend (no cache) → hard refresh the store",
    },
  });
}
