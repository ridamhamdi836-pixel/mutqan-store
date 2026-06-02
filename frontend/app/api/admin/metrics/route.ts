import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { getAdminMetrics } from "@/lib/admin-queries";

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const metrics = await getAdminMetrics(
    searchParams.get("from"),
    searchParams.get("to"),
  );

  return NextResponse.json(metrics);
}
