import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getProduct } from "@/config/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product?.imageFile) {
    return new NextResponse("Product not found", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "public",
    "images",
    "products",
    product.imageFile,
  );

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(product.imageFile).toLowerCase();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    console.error("[product-image] file missing:", filePath, err);
    return new NextResponse("Image file not found on server", { status: 404 });
  }
}
