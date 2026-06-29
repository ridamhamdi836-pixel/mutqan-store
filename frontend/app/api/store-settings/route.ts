import { NextResponse } from "next/server";
import { readStoreSettings } from "@/lib/store-dashboard-db";

export async function GET() {
  try {
    const settings = await readStoreSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("[StoreSettings] Failed to read public settings:", error);
    return NextResponse.json({ settings: {} });
  }
}
