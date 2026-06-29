import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { getResolvedProducts } from "@/lib/storefront-resolver";
import { saveProductOverride } from "@/lib/store-dashboard-db";
import type { ProductOverride } from "@/types/store-dashboard";

export async function GET(request: NextRequest) {
  if (!getAdminFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await getResolvedProducts();
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | {
        slug?: string;
        nameAr?: string;
        shortDescriptionAr?: string;
        priceSar?: number;
        image?: string;
      }
    | null;

  const slug = body?.slug?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must contain lowercase English letters, numbers, and dashes only." },
      { status: 400 },
    );
  }

  if (!body?.nameAr?.trim() || !body.shortDescriptionAr?.trim()) {
    return NextResponse.json(
      { error: "Product name and description are required." },
      { status: 400 },
    );
  }

  const price = Number(body.priceSar) || 199;
  const override: ProductOverride = {
    visibility: {
      enabled: true,
      showOnHome: true,
      showInCollections: true,
      showPdp: true,
      sortOrder: 100,
    },
    catalog: {
      name_ar: body.nameAr.trim(),
      short_description_ar: body.shortDescriptionAr.trim(),
      category_slug: "beauty",
      imageFile: body.image?.trim() || `${slug}.png`,
      storeCardImageFile: body.image?.trim() || `${slug}.png`,
    },
    copy: {
      nameAr: body.nameAr.trim(),
      shortDescriptionAr: body.shortDescriptionAr.trim(),
      homepageSubtitle: body.shortDescriptionAr.trim(),
      heroHeadline: body.nameAr.trim(),
      heroSubheadline: body.shortDescriptionAr.trim(),
    },
    media: body.image?.trim()
      ? {
          cardImage: body.image.trim(),
          heroImage: body.image.trim(),
          heroImageAlt: body.nameAr.trim(),
        }
      : undefined,
    bundles: [
      {
        id: `${slug}-1`,
        label_ar: "العرض الرئيسي",
        quantity: 1,
        price_sar: price,
        is_default: true,
        sort_order: 1,
      },
    ],
  };

  await saveProductOverride(slug, override);
  return NextResponse.json({ ok: true, slug, updatedBy: admin.username });
}
