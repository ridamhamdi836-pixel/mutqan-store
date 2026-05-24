import { NextResponse } from "next/server";
import { SHEETS_BUILD } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    build: SHEETS_BUILD,
  });
}
