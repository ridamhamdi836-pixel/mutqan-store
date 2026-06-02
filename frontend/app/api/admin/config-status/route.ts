import { NextResponse } from "next/server";
import { getAdminConfigStatus } from "@/lib/admin-auth";

/** Public diagnostic — no secrets exposed */
export async function GET() {
  return NextResponse.json(getAdminConfigStatus());
}
