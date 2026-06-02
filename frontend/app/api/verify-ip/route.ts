import { NextRequest, NextResponse } from "next/server";
import { getClientIpFromHeaders, lookupIp } from "@/lib/geoip";

const WHITELISTED_PHONES = (process.env.WHITELISTED_PHONES || "0512345678")
  .split(",")
  .map((p) => p.trim());

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone: string = body.phone || "";

    const normalizedPhone = phone.replace(/\s|-/g, "");
    if (WHITELISTED_PHONES.some((wp) => normalizedPhone.includes(wp))) {
      return NextResponse.json({
        allowed: true,
        country: "SA",
        bypassed: true,
      });
    }

    const ip = getClientIpFromHeaders(request.headers);
    if (!ip) {
      return NextResponse.json({
        allowed: false,
        country: "unknown",
        reason: "ip_unknown",
      });
    }

    const geo = await lookupIp(ip);

    return NextResponse.json({
      allowed: geo.allowed,
      country: geo.country,
      ip: geo.ip,
      suspicious: geo.isSuspicious,
      reason: geo.blockReason,
      service: geo.provider,
    });
  } catch (err) {
    console.error("[IP-Check] Error:", err);
    return NextResponse.json({
      allowed: false,
      country: "unknown",
      reason: "verification_error",
    });
  }
}
