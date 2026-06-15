import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CroProductPageClient } from "@/components/product/cro/CroProductPageClient";
import { PRODUCTS_CONFIG } from "@/config/products";
import { getProduct, PRODUCT_SLUGS, resolveProductSlug } from "@/config/catalog";
import { getProductOgImageUrl } from "@/lib/product-image";

export async function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  const config = PRODUCTS_CONFIG[resolveProductSlug(slug)];

  if (!product || !config) return { title: "منتج | متقن" };

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      images: [
        {
          url: getProductOgImageUrl(slug),
          width: 800,
          height: 600,
          alt: product.name_ar,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  const config = PRODUCTS_CONFIG[resolveProductSlug(slug)];

  if (!product || !config) notFound();

  const productPayload = {
    id: product.id,
    slug: product.slug,
    name_ar: product.name_ar,
    short_description_ar: product.short_description_ar,
    category_slug: product.category_slug,
    bundles: product.bundles,
  };

  return <CroProductPageClient product={productPayload} />;
}
