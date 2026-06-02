import { NextResponse } from "next/server";
import { clearAdminSessionCookieOptions } from "@/lib/admin-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(clearAdminSessionCookieOptions());
  return res;
}
