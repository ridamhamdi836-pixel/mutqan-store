import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  requireAdminConfigured,
  verifyAdminLogin,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!requireAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin credentials not configured on server" },
      { status: 503 },
    );
  }

  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!verifyAdminLogin(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAdminSessionToken(username);
  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(adminSessionCookieOptions(token));
  return res;
}
