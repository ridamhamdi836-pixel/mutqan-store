/**
 * Browser pixel IDs baked into the storefront (public — same as in page HTML).
 * Easypanel env still overrides when set. CAPI tokens stay on backend only.
 */
export const WEB_PIXEL_IDS = {
  /** Paste Meta Pixel ID here (Events Manager) — env META_PIXEL_ID also works via /api/pixels/browser */
  meta: "",
  tiktok: "D4GVCMBC77UAP3H8QDS0",
  snapchat: "d8f90588-0a07-41a3-87ed-0c829150b41a",
} as const;
