import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * App Router — GET /api/debug/google-sheets
 * https://mutqan.online/api/debug/google-sheets
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    router: "app",
    path: "app/api/debug/google-sheets/route.ts",
  });
}
