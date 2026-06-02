import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "mutqan_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.SECRET_KEY?.trim() ||
    ""
  );
}

export function getBackendAdminBaseUrl(): string | null {
  const url =
    process.env.ADMIN_BACKEND_URL?.trim() ||
    process.env.BACKEND_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    null;
  if (!url) return null;
  return url.replace(/\/$/, "");
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!username || !password) return null;
  return { username, password };
}

export type AdminConfigStatus = {
  ready: boolean;
  hasSessionSecret: boolean;
  hasLocalCredentials: boolean;
  hasBackendUrl: boolean;
  hint: string;
};

export function getAdminConfigStatus(): AdminConfigStatus {
  const hasSessionSecret = Boolean(getSecret());
  const hasLocalCredentials = Boolean(getAdminCredentials());
  const hasBackendUrl = Boolean(getBackendAdminBaseUrl());
  const ready = hasSessionSecret && (hasLocalCredentials || hasBackendUrl);

  let hint = "";
  if (!hasSessionSecret) {
    hint =
      "Set ADMIN_SESSION_SECRET (or SECRET_KEY) on the frontend service — must match backend if using backend login.";
  } else if (!hasLocalCredentials && !hasBackendUrl) {
    hint =
      "Set ADMIN_USERNAME and ADMIN_PASSWORD on the frontend service, or set NEXT_PUBLIC_API_URL / ADMIN_BACKEND_URL and configure credentials on the backend.";
  } else if (!hasLocalCredentials && hasBackendUrl) {
    hint = "Login will verify against the backend API. Ensure the same ADMIN_SESSION_SECRET is on frontend and backend.";
  }

  return {
    ready,
    hasSessionSecret,
    hasLocalCredentials,
    hasBackendUrl,
    hint,
  };
}

export function verifyAdminLogin(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  if (!creds) return false;
  const uOk = timingSafeEqualStr(username, creds.username);
  const pOk = timingSafeEqualStr(password, creds.password);
  return uOk && pOk;
}

export async function verifyAdminLoginViaBackend(
  username: string,
  password: string,
): Promise<{ ok: true; token: string; username: string } | { ok: false; error: string; status: number }> {
  const base = getBackendAdminBaseUrl();
  if (!base) {
    return { ok: false, error: "Backend URL not configured", status: 503 };
  }

  try {
    const res = await fetch(`${base}/api/v1/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: (data as { detail?: string }).detail || "Backend login failed",
        status: res.status,
      };
    }
    const token = (data as { token?: string }).token;
    if (!token) {
      return { ok: false, error: "Backend did not return a session token", status: 502 };
    }
    return {
      ok: true,
      token,
      username: (data as { username?: string }).username || username,
    };
  } catch {
    return { ok: false, error: "Cannot reach backend API for admin login", status: 503 };
  }
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
  return getAdminConfigStatus().ready;
}
