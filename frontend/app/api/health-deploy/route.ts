import { NextResponse } from "next/server";
import { SHEETS_BUILD } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET https://mutqan.online/api/health-deploy */
export async function GET() {
  return NextResponse.json({
    ok: true,
    build: "mutqan-store-v2",
    sheets: SHEETS_BUILD,
  });
}
