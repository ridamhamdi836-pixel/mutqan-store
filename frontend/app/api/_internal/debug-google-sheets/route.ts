import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Internal target for next.config rewrite */
export async function GET() {
  return NextResponse.json({
    ok: true,
    router: "app",
    path: "app/api/_internal/debug-google-sheets/route.ts",
    via: "rewrite",
  });
}
