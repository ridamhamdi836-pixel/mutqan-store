import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getProduct, resolveProductSlug } from "@/config/catalog";
import { PRODUCTS_CONFIG } from "@/config/products";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const variant = new URL(request.url).searchParams.get("variant");
  const product = getProduct(slug);

  if (!product?.imageFile) {
    return new NextResponse("Product not found", { status: 404 });
  }

  let imageFile = product.imageFile;
  if (variant === "card" && product.storeCardImageFile) {
    imageFile = product.storeCardImageFile;
  } else if (variant === "main") {
    const heroPath = PRODUCTS_CONFIG[resolveProductSlug(slug)]?.heroSectionImage;
    if (heroPath) {
      imageFile = heroPath.split("?")[0].split("/").pop() || imageFile;
    }
  }

  const productsDir = path.join(process.cwd(), "public", "images", "products");
  const filePath = path.join(productsDir, imageFile);

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(imageFile).toLowerCase();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": MIME[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=2592000, immutable",
      },
    });
  } catch (err) {
    console.error("[product-image] file missing:", filePath, err);
    return new NextResponse("Image file not found on server", { status: 404 });
  }
}
