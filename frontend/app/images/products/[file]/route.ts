import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { CATALOG } from "@/config/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Serves /images/products/* — same files as /api/product-image/[slug] */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;

  if (!file || file.includes("..") || file.includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const product = CATALOG.find((p) => p.imageFile === file);
  const filePath = path.join(process.cwd(), "public", "images", "products", file);

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(file).toLowerCase();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Mutqan-Product": product?.slug ?? "unknown",
      },
    });
  } catch (err) {
    console.error("[images/products] missing:", filePath, err);
    return new NextResponse("Not found", { status: 404 });
  }
}
