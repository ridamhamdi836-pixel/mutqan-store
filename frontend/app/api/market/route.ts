import { NextRequest, NextResponse } from "next/server";
import { marketFromCountry } from "@/config/markets";
import { getClientIpFromHeaders, lookupIp } from "@/lib/geoip";

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIpFromHeaders(request.headers);
    if (!ip) {
      return NextResponse.json({ market: "SA", country: "unknown" });
    }

    const geo = await lookupIp(ip);
    const market = marketFromCountry(geo.country);

    return NextResponse.json({
      market,
      country: geo.country,
      allowed: geo.allowed,
    });
  } catch {
    return NextResponse.json({ market: "SA", country: "unknown" });
  }
}
