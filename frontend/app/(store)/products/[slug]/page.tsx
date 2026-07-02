import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CroProductPageClient } from "@/components/product/cro/CroProductPageClient";
import { SkincareNamaProductPage } from "@/components/product/cro/SkincareNamaProductPage";
import {
  getSkincareNamaPage,
  isSkincareProductSlug,
} from "@/config/cro-product-pages/skincare-nama-pages";
import { getProductOgImageUrl } from "@/lib/product-image";
import { getResolvedProductPage } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getResolvedProductPage(slug);

  if (!resolved) return { title: "منتج | متقن" };
  const { product, config } = resolved;

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
  const resolved = await getResolvedProductPage(slug);

  if (!resolved) notFound();
  const { product, config, croPage } = resolved;

  const productPayload = {
    id: product.id,
    slug: product.slug,
    name_ar: product.name_ar,
    short_description_ar: product.short_description_ar,
    category_slug: product.category_slug,
    bundles: product.bundles,
  };

  if (isSkincareProductSlug(product.slug)) {
    const namaPage = getSkincareNamaPage(product.slug);
    if (!namaPage) notFound();

    return (
      <SkincareNamaProductPage
        product={productPayload}
        productConfig={config}
        namaConfig={namaPage}
      />
    );
  }

  return (
    <CroProductPageClient
      product={productPayload}
      productConfig={config}
      pageConfig={croPage}
    />
  );
}
