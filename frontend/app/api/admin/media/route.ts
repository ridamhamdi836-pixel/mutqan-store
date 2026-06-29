import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getAdminFromRequest } from "@/lib/admin-auth";
import { getPool } from "@/lib/db";
import { ensureStoreDashboardTables } from "@/lib/store-dashboard-db";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function safePart(value: string, fallback: string) {
  const safe = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return safe || fallback;
}

export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const slug = safePart(String(form.get("slug") ?? ""), "product");
  const slot = safePart(String(form.get("slot") ?? ""), "image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!file.type.startsWith("image/") || !EXT_BY_TYPE[file.type]) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WEBP, and GIF images are supported." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image is too large. Maximum size is 8MB." },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const metadata = await sharp(bytes, { animated: file.type === "image/gif" })
    .metadata()
    .catch(() => null);
  const width = metadata?.width ?? null;
  const height = metadata?.height ?? null;
  const aspectRatio = width && height ? `${width}/${height}` : undefined;
  const ext = EXT_BY_TYPE[file.type];
  const filename = `${slot}-${Date.now()}.${ext}`;
  const publicDir = path.join(process.cwd(), "public", "uploads", "products", slug);
  await mkdir(publicDir, { recursive: true });
  await writeFile(path.join(publicDir, filename), bytes);

  const publicUrl = `/uploads/products/${slug}/${filename}`;

  const pool = getPool();
  if (pool) {
    await ensureStoreDashboardTables();
    await pool.query(
      `INSERT INTO media_assets (
        storage_path, public_url, mime_type, width, height, alt_ar, metadata, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, NOW())
       ON CONFLICT (storage_path)
       DO UPDATE SET public_url = EXCLUDED.public_url,
         mime_type = EXCLUDED.mime_type,
         width = EXCLUDED.width,
         height = EXCLUDED.height,
         alt_ar = EXCLUDED.alt_ar,
         metadata = EXCLUDED.metadata,
         updated_at = NOW()`,
      [
        publicUrl,
        publicUrl,
        file.type,
        width,
        height,
        String(form.get("alt") ?? ""),
        JSON.stringify({ slot, slug, uploadedBy: admin.username }),
      ],
    );
  }

  return NextResponse.json({
    ok: true,
    url: publicUrl,
    width,
    height,
    aspectRatio,
  });
}
