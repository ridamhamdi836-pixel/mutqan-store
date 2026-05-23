import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { TrustBadges } from "@/components/trust/TrustBadges";
import { COLLECTIONS } from "@/config/collections";

export const metadata: Metadata = {
  title: "جميع المنتجات",
  description: "تصفح جميع منتجات متقن المختارة بعناية لتنظيم المنزل والمطبخ. الدفع عند الاستلام والتوصيل داخل السعودية.",
};

// Static product data - same as config
const ALL_PRODUCTS = [
  { id: "1", slug: "pull-out-cabinet-drawer", name_ar: "درج الخزانة المنزلق", name_en: "Pull-out Cabinet Drawer", short_description_ar: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة.", positioning: "", category_slug: "home-organization", bundles: [{ id: "b1", label_ar: "قطعتين", quantity: 2, price_sar: 349, is_default: false, sort_order: 1 }, { id: "b2", label_ar: "4 قطع - الأكثر اختيارًا", quantity: 4, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 }] },
  { id: "2", slug: "smart-table-warmer", name_ar: "سخّان المائدة الذكي", name_en: "Smart Table Warmer", short_description_ar: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة.", positioning: "", category_slug: "dining-hosting", bundles: [{ id: "b3", label_ar: "قطعة واحدة", quantity: 1, price_sar: 249, is_default: false, sort_order: 1 }, { id: "b4", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 449, compare_at_price_sar: 498, savings_label_ar: "وفر 49 ريال", is_default: true, sort_order: 2 }] },
  { id: "3", slug: "magic-under-sink-organizer", name_ar: "منظّم المغسلة السحري", name_en: "Magic Under-Sink Organizer", short_description_ar: "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا.", positioning: "", category_slug: "home-organization", bundles: [{ id: "b5", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "b6", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 379, compare_at_price_sar: 458, savings_label_ar: "وفر 79 ريال", is_default: true, sort_order: 2 }] },
  { id: "4", slug: "powerful-cordless-vacuum", name_ar: "المكنسة اللاسلكية القوية", name_en: "Powerful Cordless Vacuum", short_description_ar: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق.", positioning: "", category_slug: "cleaning-care", bundles: [{ id: "b7", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "b8", label_ar: "قطعتين - الأكثر اختيارًا", quantity: 2, price_sar: 399, compare_at_price_sar: 458, is_default: true, sort_order: 2 }] },
  { id: "5", slug: "smart-stackable-cabinet", name_ar: "الخزانة التراكمية الذكية", name_en: "Smart Stackable Cabinet", short_description_ar: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.", positioning: "", category_slug: "home-organization", bundles: [{ id: "b9", label_ar: "قطعة واحدة", quantity: 1, price_sar: 349, is_default: false, sort_order: 1 }, { id: "b10", label_ar: "قطعتين - وفر 99 ريال", quantity: 2, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 }] },
  { id: "6", slug: "pure-faucet-filter", name_ar: "فلتر الصنبور النقي", name_en: "Pure Faucet Filter", short_description_ar: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري.", positioning: "", category_slug: "modern-kitchen", bundles: [{ id: "b11", label_ar: "قطعة واحدة", quantity: 1, price_sar: 199, is_default: false, sort_order: 1 }, { id: "b12", label_ar: "قطعتين - أفضل قيمة", quantity: 2, price_sar: 249, compare_at_price_sar: 398, savings_label_ar: "وفر 149 ريال", is_default: true, sort_order: 2 }] },
  { id: "7", slug: "thermal-lunch-box", name_ar: "حافظة الغداء الحرارية", name_en: "Thermal Lunch Box", short_description_ar: "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة.", positioning: "", category_slug: "dining-hosting", bundles: [{ id: "b13", label_ar: "قطعة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 }, { id: "b14", label_ar: "قطعتين - وفر 129 ريال", quantity: 2, price_sar: 329, compare_at_price_sar: 458, savings_label_ar: "وفر 129 ريال", is_default: true, sort_order: 2 }] },
];

export default function CollectionsPage() {
  return (
    <div className="bg-brand-background">
      {/* Hero */}
      <section className="bg-brand-espresso py-14 page-x">
        <div className="max-w-content mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-surface mb-4">جميع منتجات متقن</h1>
          <p className="text-brand-sand/80 max-w-xl mx-auto">منتجات مختارة بعناية لبيوت الخليج. حلول عملية وأنيقة لتنظيم مساحاتك وتسهيل يومك.</p>
        </div>
      </section>

      {/* Categories */}
      <section className="page-x py-8 bg-brand-surface border-b border-brand-border">
        <div className="max-w-content mx-auto flex gap-3 overflow-x-auto scrollbar-hide">
          <Link href="/collections" className="flex-shrink-0 rounded-pill bg-brand-espresso text-brand-surface px-4 py-2 text-sm font-semibold">
            الكل
          </Link>
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="flex-shrink-0 rounded-pill border border-brand-border text-brand-muted hover:border-brand-espresso hover:text-brand-espresso px-4 py-2 text-sm font-medium transition-colors"
            >
              {col.nameAr}
            </Link>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-pad page-x">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ALL_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="page-x pb-14">
        <div className="max-w-content mx-auto">
          <TrustBadges />
        </div>
      </section>
    </div>
  );
}
