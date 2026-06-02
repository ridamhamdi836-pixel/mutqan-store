import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminConfigStatus } from "@/lib/admin-auth";
import { SHEETS_BUILD, getSheetsConfigStatus } from "@/lib/google-sheets";
import { getProduct } from "@/config/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET https://mutqan.online/api/health-deploy */
export async function GET() {
  const sink = getProduct("magic-under-sink-organizer");
  let sinkImageOk = false;
  let sinkImageBytes = 0;

  if (sink?.imageFile) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "images",
      "products",
      sink.imageFile,
    );
    try {
      const buf = await readFile(filePath);
      sinkImageBytes = buf.length;
      sinkImageOk = sinkImageBytes > 50_000;
    } catch {
      sinkImageOk = false;
    }
  }

  const sheetsConfig = getSheetsConfigStatus();
  const adminConfig = getAdminConfigStatus();

  return NextResponse.json({
    ok: true,
    build: "mutqan-store-v6-admin-session",
    admin: adminConfig,
    sheets_build: SHEETS_BUILD,
    sheets_webhook: sheetsConfig,
    sheets_ready:
      sheetsConfig.configured &&
      sheetsConfig.validExecUrl,
    sheets_test_url: "/api/debug/google-sheets",
    product_image_api: "/api/product-image/magic-under-sink-organizer",
    sink_image_on_disk: sinkImageOk,
    sink_image_bytes: sinkImageBytes,
  });
}
