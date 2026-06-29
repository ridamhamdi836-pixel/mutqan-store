import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { getResolvedProductPage } from "@/lib/storefront-resolver";
import { saveProductOverride } from "@/lib/store-dashboard-db";
import type { ProductOverride } from "@/types/store-dashboard";

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const resolved = await getResolvedProductPage(slug, { includeHidden: true });
  if (!resolved) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product: resolved.product,
    config: resolved.config,
    croPage: resolved.croPage,
    override: resolved.product.dashboardOverride ?? {},
  });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await request.json().catch(() => null)) as ProductOverride | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid product override." }, { status: 400 });
  }

  await saveProductOverride(slug, body);
  return NextResponse.json({ ok: true, slug, updatedBy: admin.username });
}
