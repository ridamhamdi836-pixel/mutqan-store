import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { readStoreSettings, saveStoreSettings } from "@/lib/store-dashboard-db";
import type { StoreSettingsOverride } from "@/types/store-dashboard";

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await readStoreSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as StoreSettingsOverride | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid settings payload." }, { status: 400 });
  }

  await saveStoreSettings(body, admin.username);
  return NextResponse.json({ ok: true, updatedBy: admin.username });
}
