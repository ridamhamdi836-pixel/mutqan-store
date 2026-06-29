import { NextResponse } from "next/server";
import { getResolvedHomepageProducts, getResolvedProducts } from "@/lib/storefront-resolver";

export async function GET() {
  try {
    const [products, cards] = await Promise.all([
      getResolvedProducts(),
      getResolvedHomepageProducts(),
    ]);
    return NextResponse.json({
      visibleCollectionSlugs: products
        .filter(
          (product) =>
            product.visibility.enabled &&
            product.visibility.showInCollections &&
            product.visibility.showPdp,
        )
        .map((product) => product.slug),
      cards,
    });
  } catch (error) {
    console.error("[StoreProducts] Failed to read products:", error);
    return NextResponse.json({ visibleCollectionSlugs: [], cards: [] });
  }
}
