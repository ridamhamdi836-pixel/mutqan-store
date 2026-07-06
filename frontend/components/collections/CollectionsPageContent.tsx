"use client";

import { Sparkles } from "lucide-react";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { useStorefront } from "@/providers/storefront-provider";
import type { HomepageBeautyProduct } from "@/config/homepage-beauty";

export function CollectionsPageContent({
  products,
}: {
  products: HomepageBeautyProduct[];
}) {
  const { t } = useStorefront();

  return (
    <div className="bg-brand-background min-h-screen">
      <section className="page-x pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-content mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs md:text-sm font-bold text-brand-espresso shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-gold" />
            {t("collectionsBadge")}
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight tracking-tight">
            {t("collectionsTitle")}
          </h1>
          <p className="mt-4 text-sm md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            {t("collectionsSubtitle")}
          </p>
        </div>
      </section>

      <section className="page-x pb-14 md:pb-20">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
            {products.map((product) => (
              <BeautyProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
