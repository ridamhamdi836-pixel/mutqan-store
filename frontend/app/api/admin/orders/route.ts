import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { listAdminOrders } from "@/lib/admin-queries";

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const data = await listAdminOrders({
    from: searchParams.get("from"),
    to: searchParams.get("to"),
    status: searchParams.get("status"),
    q: searchParams.get("q"),
    currency: searchParams.get("currency"),
    limit: Number(searchParams.get("limit")) || 50,
    offset: Number(searchParams.get("offset")) || 0,
  });

  return NextResponse.json(data);
}
