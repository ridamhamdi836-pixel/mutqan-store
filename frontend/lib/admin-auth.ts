import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "mutqan_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.SECRET_KEY || "";
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!username || !password) return null;
  return { username, password };
}

export function verifyAdminLogin(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const uOk = timingSafeEqualStr(username, creds.username);
  const pOk = timingSafeEqualStr(password, creds.password);
  return uOk && pOk;
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function createAdminSessionToken(username: string): string {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const payload = Buffer.from(JSON.stringify({ u: username, exp })).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string): { username: string } | null {
  const secret = getSecret();
  if (!secret || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      u: string;
      exp: number;
    };
    if (!data.u || !data.exp || Date.now() > data.exp) return null;
    return { username: data.u };
  } catch {
    return null;
  }
}

export function adminSessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}

export function clearAdminSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export async function getAdminFromCookies(): Promise<{ username: string } | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export function getAdminFromRequest(request: NextRequest): { username: string } | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}

export function requireAdminConfigured(): boolean {
  return Boolean(getAdminCredentials() && getSecret());
}
