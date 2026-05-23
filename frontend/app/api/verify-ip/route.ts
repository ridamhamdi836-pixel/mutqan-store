import { NextRequest, NextResponse } from "next/server";

const WHITELISTED_PHONES = (process.env.WHITELISTED_PHONES || "0512345678").split(",").map((p) => p.trim());

function getClientIp(request: NextRequest): string {
  // Easypanel / reverse proxy headers
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first && !isPrivateIp(first)) return first;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp && !isPrivateIp(realIp.trim())) return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  return "";
}

function isPrivateIp(ip: string): boolean {
  return ip.startsWith("10.") ||
    ip.startsWith("172.16.") || ip.startsWith("172.17.") || ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") || ip.startsWith("172.2") || ip.startsWith("172.3") ||
    ip.startsWith("192.168.") ||
    ip === "127.0.0.1" || ip === "::1" || ip === "localhost";
}

// Service 1: ipapi.co (HTTPS, 1000 free/day, includes country)
async function checkWithIpApiCo(ip: string): Promise<{ country: string; isProxy: boolean } | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;

    return {
      country: data.country_code || "unknown",
      isProxy: false,
    };
  } catch {
    return null;
  }
}

// Service 2: ip-api.com (HTTP, 45 req/min, proxy+hosting detection)
async function checkWithIpApi(ip: string): Promise<{ country: string; isProxy: boolean; isHosting: boolean } | null> {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,countryCode,proxy,hosting`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success") return null;

    return {
      country: data.countryCode || "unknown",
      isProxy: data.proxy === true,
      isHosting: data.hosting === true,
    };
  } catch {
    return null;
  }
}

// Service 3: ipwho.is (HTTPS, free, no key needed)
async function checkWithIpWhois(ip: string): Promise<{ country: string } | null> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;

    return {
      country: data.country_code || "unknown",
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone: string = body.phone || "";

    // Whitelisted phones bypass all checks
    const normalizedPhone = phone.replace(/\s|-/g, "");
    if (WHITELISTED_PHONES.some((wp) => normalizedPhone.includes(wp))) {
      return NextResponse.json({
        allowed: true,
        country: "SA",
        bypassed: true,
      });
    }

    const ip = getClientIp(request);
    console.log("[IP-Check] Client IP:", ip, "| Headers:", {
      xff: request.headers.get("x-forwarded-for"),
      realIp: request.headers.get("x-real-ip"),
      cfIp: request.headers.get("cf-connecting-ip"),
    });

    if (!ip) {
      return NextResponse.json({
        allowed: false,
        country: "unknown",
        reason: "ip_unknown",
        debug: "no_ip_detected",
      });
    }

    // Try multiple services for reliability
    let country = "unknown";
    let isSuspicious = false;
    let serviceUsed = "none";

    // Try ip-api.com first (has proxy detection)
    const ipApiResult = await checkWithIpApi(ip);
    if (ipApiResult) {
      country = ipApiResult.country;
      isSuspicious = ipApiResult.isProxy || ipApiResult.isHosting;
      serviceUsed = "ip-api.com";
    } else {
      // Fallback to ipapi.co
      const ipapiCoResult = await checkWithIpApiCo(ip);
      if (ipapiCoResult) {
        country = ipapiCoResult.country;
        serviceUsed = "ipapi.co";
      } else {
        // Last fallback: ipwho.is
        const ipWhoisResult = await checkWithIpWhois(ip);
        if (ipWhoisResult) {
          country = ipWhoisResult.country;
          serviceUsed = "ipwho.is";
        }
      }
    }

    console.log("[IP-Check] Result:", { ip, country, isSuspicious, serviceUsed });

    // If no service could determine the country, block
    if (country === "unknown") {
      return NextResponse.json({
        allowed: false,
        country: "unknown",
        reason: "verification_failed",
        debug: `all_services_failed_for_${ip}`,
      });
    }

    const isKSA = country === "SA";
    const allowed = isKSA && !isSuspicious;

    let reason = "";
    if (!isKSA) reason = "not_ksa";
    else if (isSuspicious) reason = "vpn_detected";

    return NextResponse.json({
      allowed,
      country,
      ip,
      suspicious: isSuspicious,
      reason: reason || undefined,
      service: serviceUsed,
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
