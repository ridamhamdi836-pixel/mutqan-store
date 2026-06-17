import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { COLLECTIONS, getCollectionBySlug } from "@/config/collections";
import { HOMEPAGE_BEAUTY } from "@/config/homepage-beauty";

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "مجموعة | متقن" };
  return {
    title: `${collection.nameAr} | متقن`,
    description: collection.descriptionAr,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const productCards = collection.productSlugs
    .map((productSlug) =>
      HOMEPAGE_BEAUTY.bestSellers.products.find((p) => p.slug === productSlug),
    )
    .filter((product): product is (typeof HOMEPAGE_BEAUTY.bestSellers.products)[number] =>
      Boolean(product),
    );

  return (
    <div className="bg-brand-background min-h-screen">
      <section className="page-x pt-8 pb-6 md:pt-12 md:pb-10">
        <div className="max-w-content mx-auto">
          <nav className="text-sm text-brand-muted mb-8">
            <Link href="/" className="hover:text-brand-espresso">
              الرئيسية
            </Link>
            <span className="mx-2">/</span>
            <Link href="/collections" className="hover:text-brand-espresso">
              المجموعات
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-espresso font-medium">{collection.nameAr}</span>
          </nav>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs md:text-sm font-bold text-brand-espresso shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-gold" />
              {collection.badge}
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight">
              {collection.nameAr}
            </h1>
            <p className="mt-4 text-sm md:text-lg text-brand-muted leading-relaxed">
              {collection.descriptionAr}
            </p>
          </div>
        </div>
      </section>

      <section className="page-x pb-14 md:pb-20">
        <div className="max-w-content mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCards.map((product) => (
              <BeautyProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
