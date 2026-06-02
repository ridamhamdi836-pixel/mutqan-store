import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest, requireAdminConfigured } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!requireAdminConfigured()) {
    return NextResponse.json({ authenticated: false, configured: false });
  }
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ authenticated: false, configured: true });
  }
  return NextResponse.json({ authenticated: true, username: admin.username });
}
