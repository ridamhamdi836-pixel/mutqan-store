import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { BeautyProductCard } from "@/components/home/beauty/BeautyProductCard";
import { getResolvedHomepageProducts } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مجموعات متقن | تنظيم الجمال والعناية",
  description:
    "اكتشفي مجموعات متقن الفاخرة لتنظيم الجمال، العناية بالفرش، وأدوات المكياج المختارة بعناية. الدفع عند الاستلام والتوصيل داخل السعودية.",
};

export default async function CollectionsPage() {
  const products = await getResolvedHomepageProducts();

  return (
    <div className="bg-brand-background min-h-screen">
      <section className="page-x pt-10 pb-8 md:pt-16 md:pb-12">
        <div className="max-w-content mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs md:text-sm font-bold text-brand-espresso shadow-sm">
            <Sparkles className="h-4 w-4 text-brand-gold" />
            مجموعات متقن الفاخرة
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-brand-espresso leading-tight">
            جمالك يبدأ من ترتيب التفاصيل
          </h1>
          <p className="mt-4 text-sm md:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            اكتشفي مجموعات مختارة بعناية لتنظيم مستحضراتك، العناية بفرشك،
            وإضاءة روتينك اليومي بأناقة تشبه براندات الجمال العالمية.
          </p>
        </div>
      </section>

      <section className="page-x pb-14 md:pb-20">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <BeautyProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
