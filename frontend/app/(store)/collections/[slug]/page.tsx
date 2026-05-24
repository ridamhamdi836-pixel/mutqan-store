import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { COLLECTIONS, getCollectionBySlug } from "@/config/collections";
import { getProductsBySlugs, toProduct } from "@/config/catalog";

const COLLECTION_FAQ: Record<string, Array<{ question: string; answer: string }>> = {
  "home-organization": [
    { question: "هل منتجات التنظيم سهلة التركيب؟", answer: "نعم، جميع منتجات التنظيم لا تحتاج لأدوات ويمكن تركيبها في دقائق." },
    { question: "هل تناسب مقاسات الخزائن السعودية؟", answer: "صُممت لتناسب معظم أحجام الخزائن الشائعة. فريقنا يساعدك للتأكد قبل الشحن." },
  ],
  "modern-kitchen": [
    { question: "هل فلتر الصنبور يناسب جميع الصنابير؟", answer: "يأتي بمجموعة محولات تناسب معظم أحجام الصنابير الشائعة في المنازل." },
  ],
  "cleaning-care": [
    { question: "هل المكنسة مناسبة للاستخدام في السيارة؟", answer: "نعم، تأتي بملحقات مخصصة للمقاعد وداخل السيارات." },
  ],
  "dining-hosting": [
    { question: "هل سخّان المائدة آمن للاستخدام اليومي؟", answer: "نعم، مصمم للاستخدام المنزلي الآمن مع حماية من الحرارة الزائدة." },
  ],
};

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

  const products = getProductsBySlugs(collection.productSlugs).map(toProduct);
  const faqs = COLLECTION_FAQ[collection.slug] || [];

  return (
    <div className="bg-brand-background min-h-screen">
      <section className="section-pad page-x">
        <div className="max-w-content mx-auto">
          <nav className="text-sm text-brand-muted mb-6">
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

          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-espresso mb-3">
            {collection.nameAr}
          </h1>
          <p className="text-lg text-brand-muted max-w-2xl mb-10">{collection.descriptionAr}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {faqs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-brand-espresso mb-6">أسئلة شائعة</h2>
              <FAQAccordion items={faqs} />
            </div>
          )}

          <div className="mt-12">
            <TrustBadges />
          </div>
        </div>
      </section>
    </div>
  );
}
