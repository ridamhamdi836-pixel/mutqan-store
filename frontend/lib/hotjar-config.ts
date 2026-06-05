import { WEB_ANALYTICS } from "@/config/web-analytics";

function pick(...values: (string | undefined | null)[]): string | undefined {
  let chosen: string | undefined;
  for (const v of values) {
    const t = v?.trim();
    if (t) chosen = t;
  }
  return chosen;
}

export function getHotjarSiteId(): string | undefined {
  if (process.env.NEXT_PUBLIC_ENABLE_HOTJAR === "false") {
    return undefined;
  }
  return pick(
    process.env.HOTJAR_SITE_ID,
    process.env.NEXT_PUBLIC_HOTJAR_SITE_ID,
    WEB_ANALYTICS.hotjarSiteId,
  );
}

export function getHotjarStatus(siteId?: string) {
  return {
    enabled: Boolean(siteId),
    site_id_suffix: siteId?.slice(-4),
    config_file: "frontend/config/web-analytics.ts",
  };
}
