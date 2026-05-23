import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { FAQAccordion } from "@/components/product/FAQAccordion";
import { COLLECTIONS, getCollectionBySlug } from "@/config/collections";
import type { Product } from "@/types";

// Minimal product data for collection pages
const ALL_PRODUCTS: Record<string, Product> = {
  "powerful-cordless-vacuum": { id: "p1", slug: "powerful-cordless-vacuum", name_ar: "المكنسة اللاسلكية القوية", name_en: "Powerful Cordless Vacuum", short_description_ar: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق.", category_slug: "cleaning-care", bundles: [{ id: "v1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "v2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 399, compare_at_price_sar: 458, savings_label_ar: "وفر 59 ريال", is_default: true, sort_order: 2 }] },
  "smart-stackable-cabinet": { id: "p2", slug: "smart-stackable-cabinet", name_ar: "الخزانة التراكمية الذكية", name_en: "Smart Stackable Cabinet", short_description_ar: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.", category_slug: "home-organization", bundles: [{ id: "c1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 349, is_default: false, sort_order: 1 }, { id: "c2", label_ar: "قطعتين - وفر 99 ريال", quantity: 2, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 }] },
  "pull-out-cabinet-drawer": { id: "p3", slug: "pull-out-cabinet-drawer", name_ar: "درج الخزانة المنزلق", name_en: "Pull-out Cabinet Drawer", short_description_ar: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة.", category_slug: "home-organization", bundles: [{ id: "d2", label_ar: "قطعتين", quantity: 2, price_sar: 349, is_default: false, sort_order: 1 }, { id: "d4", label_ar: "4 قطع - الأكثر اختيارًا", quantity: 4, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 }] },
  "magic-under-sink-organizer": { id: "p4", slug: "magic-under-sink-organizer", name_ar: "منظّم المغسلة السحري", name_en: "Magic Under-Sink Organizer", short_description_ar: "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا.", category_slug: "home-organization", bundles: [{ id: "s1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "s2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 379, compare_at_price_sar: 458, savings_label_ar: "وفر 79 ريال", is_default: true, sort_order: 2 }] },
  "pure-faucet-filter": { id: "p5", slug: "pure-faucet-filter", name_ar: "فلتر الصنبور النقي", name_en: "Pure Faucet Filter", short_description_ar: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري.", category_slug: "modern-kitchen", bundles: [{ id: "f1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 199, is_default: false, sort_order: 1 }, { id: "f2", label_ar: "قطعتين - أفضل قيمة", quantity: 2, price_sar: 249, compare_at_price_sar: 398, savings_label_ar: "وفر 149 ريال", is_default: true, sort_order: 2 }] },
  "smart-table-warmer": { id: "p6", slug: "smart-table-warmer", name_ar: "سخّان المائدة الذكي", name_en: "Smart Table Warmer", short_description_ar: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة.", category_slug: "dining-hosting", bundles: [{ id: "w1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 249, is_default: false, sort_order: 1 }, { id: "w2", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 449, compare_at_price_sar: 498, savings_label_ar: "وفر 49 ريال", is_default: true, sort_order: 2 }] },
  "thermal-lunch-box": { id: "p7", slug: "thermal-lunch-box", name_ar: "حافظة الغداء الحرارية", name_en: "Thermal Lunch Box", short_description_ar: "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة.", category_slug: "dining-hosting", bundles: [{ id: "l1", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "l2", label_ar: "قطعتين - وفر 129 ريال", quantity: 2, price_sar: 329, compare_at_price_sar: 458, savings_label_ar: "وفر 129 ريال", is_default: true, sort_order: 2 }] },
};

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
    { question: "هل سخّان المائدة آمن للاستخدام؟", answer: "نعم، يعمل بمعايير السلامة المعتمدة ومناسب للاستخدام العائلي." },
  ],
};

export async function generateStaticParams() {
  return COLLECTIONS.map((col) => ({ slug: col.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "تصنيف | متقن" };

  return {
    title: collection.nameAr,
    description: collection.descriptionAr,
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = collection.productSlugs
    .map((s) => ALL_PRODUCTS[s])
    .filter(Boolean);

  const faqs = COLLECTION_FAQ[slug] || [];

  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="bg-brand-espresso py-14 page-x">
        <div className="max-w-content mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-surface mb-3">{collection.nameAr}</h1>
          <p className="text-brand-sand/80 max-w-xl mx-auto">{collection.descriptionAr}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="page-x py-4 bg-brand-surface border-b border-brand-border">
        <div className="max-w-content mx-auto text-xs text-brand-muted flex items-center gap-1.5">
          <Link href="/" className="hover:text-brand-espresso">الرئيسية</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-brand-espresso">المنتجات</Link>
          <span>/</span>
          <span className="text-brand-espresso">{collection.nameAr}</span>
        </div>
      </div>

      {/* Products */}
      <section className="section-pad page-x">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="page-x pb-10">
        <div className="max-w-content mx-auto">
          <TrustBadges />
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-12 page-x bg-brand-surface">
          <div className="max-w-content mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold text-brand-espresso text-center mb-6">أسئلة شائعة</h2>
            <FAQAccordion items={faqs} />
          </div>
        </section>
      )}
    </div>
  );
}
