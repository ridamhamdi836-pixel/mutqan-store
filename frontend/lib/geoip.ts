/**
 * KSA geo + VPN/proxy detection: MaxMind Insights first, then ip-api.com / ipapi.co / ipwho.is
 */

export type GeoLookupResult = {
  ip: string;
  country: string;
  isSuspicious: boolean;
  allowed: boolean;
  blockReason?: string;
  provider: string;
};

function isPrivateIp(ip: string): boolean {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.3") ||
    ip.startsWith("192.168.") ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip === "localhost"
  );
}

export function getClientIpFromHeaders(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first && !isPrivateIp(first)) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp && !isPrivateIp(realIp.trim())) return realIp.trim();
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "";
}

async function checkWithMaxMind(ip: string): Promise<{
  country: string;
  isSuspicious: boolean;
} | null> {
  const accountId = process.env.MAXMIND_ACCOUNT_ID;
  const licenseKey = process.env.MAXMIND_LICENSE_KEY;
  if (!accountId || !licenseKey) return null;

  try {
    const auth = Buffer.from(`${accountId}:${licenseKey}`).toString("base64");
    const res = await fetch(`https://geoip.maxmind.com/geoip/v2.1/insights/${ip}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const traits = data.traits || {};
    const isSuspicious = Boolean(
      traits.is_anonymous_vpn ||
        traits.is_hosting_provider ||
        traits.is_public_proxy ||
        traits.is_tor_exit_node ||
        traits.is_residential_proxy ||
        traits.is_anonymous,
    );
    return {
      country: data.country?.iso_code || "unknown",
      isSuspicious,
    };
  } catch {
    return null;
  }
}

async function checkWithIpApi(ip: string): Promise<{
  country: string;
  isSuspicious: boolean;
} | null> {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,countryCode,proxy,hosting`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      country: data.countryCode || "unknown",
      isSuspicious: data.proxy === true || data.hosting === true,
    };
  } catch {
    return null;
  }
}

async function checkWithIpApiCo(ip: string): Promise<{ country: string } | null> {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return { country: data.country_code || "unknown" };
  } catch {
    return null;
  }
}

async function checkWithIpWhois(ip: string): Promise<{ country: string } | null> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return { country: data.country_code || "unknown" };
  } catch {
    return null;
  }
}

export async function lookupIp(ip: string): Promise<GeoLookupResult> {
  if (!ip) {
    return {
      ip: "",
      country: "unknown",
      isSuspicious: false,
      allowed: false,
      blockReason: "ip_unknown",
      provider: "none",
    };
  }

  let country = "unknown";
  let isSuspicious = false;
  let provider = "none";

  const maxmind = await checkWithMaxMind(ip);
  if (maxmind) {
    country = maxmind.country;
    isSuspicious = maxmind.isSuspicious;
    provider = "maxmind";
  } else {
    const ipApi = await checkWithIpApi(ip);
    if (ipApi) {
      country = ipApi.country;
      isSuspicious = ipApi.isSuspicious;
      provider = "ip-api.com";
    } else {
      const ipapiCo = await checkWithIpApiCo(ip);
      if (ipapiCo) {
        country = ipapiCo.country;
        provider = "ipapi.co";
      } else {
        const ipwho = await checkWithIpWhois(ip);
        if (ipwho) {
          country = ipwho.country;
          provider = "ipwho.is";
        }
      }
    }
  }

  if (country === "unknown") {
    return {
      ip,
      country,
      isSuspicious: false,
      allowed: false,
      blockReason: "verification_failed",
      provider,
    };
  }

  const isKsa = country === "SA";
  let blockReason: string | undefined;
  if (!isKsa) blockReason = "not_ksa";
  else if (isSuspicious) blockReason = "vpn_detected";

  return {
    ip,
    country,
    isSuspicious,
    allowed: isKsa && !isSuspicious,
    blockReason,
    provider,
  };
}

/** Valid KSA visitor for analytics (clicks / views) */
export function isValidKsaTraffic(geo: GeoLookupResult): boolean {
  return geo.allowed;
}
