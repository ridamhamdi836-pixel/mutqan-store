import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getAdminConfigStatus } from "@/lib/admin-auth";
import { SHEETS_BUILD, getSheetsConfigStatus } from "@/lib/google-sheets";
import { getProduct } from "@/config/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function readBuildInfo(): Promise<{
  git_commit: string;
  git_commit_short: string;
  built_at: string | null;
}> {
  try {
    const raw = await readFile(
      path.join(process.cwd(), "public", "build-info.json"),
      "utf8",
    );
    const data = JSON.parse(raw) as {
      git_commit?: string;
      git_commit_short?: string;
      built_at?: string;
    };
    return {
      git_commit: data.git_commit ?? "unknown",
      git_commit_short: data.git_commit_short ?? "unknown",
      built_at: data.built_at ?? null,
    };
  } catch {
    return { git_commit: "unknown", git_commit_short: "unknown", built_at: null };
  }
}

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
  const buildInfo = await readBuildInfo();

  return NextResponse.json({
    ok: true,
    build: "mutqan-store-v7-sheets-order-number",
    git_commit: buildInfo.git_commit,
    git_commit_short: buildInfo.git_commit_short,
    built_at: buildInfo.built_at,
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
