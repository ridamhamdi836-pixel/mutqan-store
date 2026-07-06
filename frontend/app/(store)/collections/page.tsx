import type { Metadata } from "next";
import { CollectionsPageContent } from "@/components/collections/CollectionsPageContent";
import { getResolvedHomepageProducts } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مجموعة متقن | عناية كورية فاخرة",
  description:
    "اكتشفي معزّزات متقن الكورية — إشراقة، إصلاح، وشباب. روتين بسيط بخطوة واحدة. الدفع عند الاستلام.",
};

export default async function CollectionsPage() {
  const products = await getResolvedHomepageProducts();
  return <CollectionsPageContent products={products} />;
}
