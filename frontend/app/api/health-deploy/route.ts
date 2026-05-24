import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET https://mutqan.online/api/health-deploy */
export async function GET() {
  return NextResponse.json({
    ok: true,
    build: "google-sheets-clean-v1",
  });
}
