import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  createAdminSessionToken,
  getAdminConfigStatus,
  getAdminCredentials,
  verifyAdminLogin,
  verifyAdminLoginViaBackend,
} from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const config = getAdminConfigStatus();
  if (!config.ready) {
    return NextResponse.json(
      {
        error: "Admin login is not configured on the frontend service",
        hint: config.hint,
        status: config,
      },
      { status: 503 },
    );
  }

  const body = await request.json();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  let token: string;
  let sessionUser = username;

  if (getAdminCredentials()) {
    if (!verifyAdminLogin(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    token = createAdminSessionToken(username);
  } else {
    const backend = await verifyAdminLoginViaBackend(username, password);
    if (!backend.ok) {
      return NextResponse.json(
        { error: backend.error, hint: config.hint },
        { status: backend.status },
      );
    }
    token = backend.token;
    sessionUser = backend.username;
  }

  const res = NextResponse.json({ ok: true, username: sessionUser });
  res.cookies.set(adminSessionCookieOptions(token));
  return res;
}
