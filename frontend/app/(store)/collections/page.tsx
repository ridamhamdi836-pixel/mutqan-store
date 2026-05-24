import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { COLLECTIONS } from "@/config/collections";
import { CATALOG, toProduct } from "@/config/catalog";

export const metadata: Metadata = {
  title: "جميع المنتجات",
  description:
    "تصفح جميع منتجات متقن المختارة بعناية لتنظيم المنزل والمطبخ. الدفع عند الاستلام والتوصيل داخل السعودية.",
};

const ALL_PRODUCTS = CATALOG.map(toProduct);

export default function CollectionsPage() {
  return (
    <div className="bg-brand-background">
      <section className="bg-brand-espresso py-14 page-x">
        <div className="max-w-content mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-surface mb-4">
            جميع منتجات متقن
          </h1>
          <p className="text-brand-sand/80 max-w-xl mx-auto">
            منتجات مختارة بعناية لبيوت الخليج. حلول عملية وأنيقة لتنظيم مساحاتك وتسهيل يومك.
          </p>
        </div>
      </section>

      <section className="page-x py-8 bg-brand-surface border-b border-brand-border">
        <div className="max-w-content mx-auto flex gap-3 overflow-x-auto scrollbar-hide">
          <Link
            href="/collections"
            className="flex-shrink-0 rounded-pill bg-brand-espresso text-brand-surface px-4 py-2 text-sm font-semibold"
          >
            الكل
          </Link>
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="flex-shrink-0 rounded-pill border border-brand-border bg-white text-brand-espresso px-4 py-2 text-sm font-semibold hover:bg-brand-beige transition-colors"
            >
              {col.nameAr}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-pad page-x">
        <div className="max-w-content mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_PRODUCTS.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <div className="mt-12">
            <TrustBadges />
          </div>
        </div>
      </section>
    </div>
  );
}
