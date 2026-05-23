import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";
import { PRODUCTS_CONFIG } from "@/config/products";

// Static product data
const PRODUCTS_DATA: Record<string, {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  short_description_ar: string;
  category_slug: string;
  bundles: Array<{ id: string; label_ar: string; quantity: number; price_sar: number; compare_at_price_sar?: number; savings_label_ar?: string; is_default: boolean; sort_order: number }>;
}> = {
  "powerful-cordless-vacuum": {
    id: "p1", slug: "powerful-cordless-vacuum", name_ar: "المكنسة اللاسلكية القوية", name_en: "Powerful Cordless Vacuum", short_description_ar: "تنظيف سريع وفعّال يمنح منزلك وسيارتك مظهرًا أنظف خلال دقائق.", category_slug: "cleaning-care",
    bundles: [
      { id: "vacuum-1", label_ar: "قطعة واحدة - للمنزل", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 },
      { id: "vacuum-2", label_ar: "قطعتين - للمنزل والسيارة | الأكثر اختيارًا", quantity: 2, price_sar: 399, compare_at_price_sar: 458, savings_label_ar: "وفر 59 ريال", is_default: true, sort_order: 2 },
    ],
  },
  "smart-stackable-cabinet": {
    id: "p2", slug: "smart-stackable-cabinet", name_ar: "الخزانة التراكمية الذكية", name_en: "Smart Stackable Cabinet", short_description_ar: "نظام تخزين فاخر يمنحك مساحة إضافية وترتيبًا أنيقًا خلال دقائق.", category_slug: "home-organization",
    bundles: [
      { id: "cabinet-1", label_ar: "قطعة واحدة - لمساحة واحدة", quantity: 1, price_sar: 349, is_default: false, sort_order: 1 },
      { id: "cabinet-2", label_ar: "قطعتين - لترتيب أوضح ومساحة أكبر | وفر 99 ريال", quantity: 2, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 },
    ],
  },
  "pull-out-cabinet-drawer": {
    id: "p3", slug: "pull-out-cabinet-drawer", name_ar: "درج الخزانة المنزلق", name_en: "Pull-out Cabinet Drawer", short_description_ar: "حل ذكي لتنظيم الخزائن المزدحمة والوصول لأغراضك بسهولة.", category_slug: "home-organization",
    bundles: [
      { id: "drawer-2", label_ar: "قطعتين - بداية الترتيب", quantity: 2, price_sar: 349, is_default: false, sort_order: 1 },
      { id: "drawer-4", label_ar: "4 قطع - الأكثر اختيارًا للمطبخ", quantity: 4, price_sar: 599, compare_at_price_sar: 698, savings_label_ar: "وفر 99 ريال", is_default: true, sort_order: 2 },
      { id: "drawer-6", label_ar: "6 قطع - أفضل قيمة للبيت", quantity: 6, price_sar: 799, compare_at_price_sar: 1047, savings_label_ar: "وفر 248 ريال", is_default: false, sort_order: 3 },
    ],
  },
  "magic-under-sink-organizer": {
    id: "p4", slug: "magic-under-sink-organizer", name_ar: "منظّم المغسلة السحري", name_en: "Magic Under-Sink Organizer", short_description_ar: "تصميم عملي يساعدك على استغلال مساحة المغسلة بشكل أكثر ترتيبًا وراحة.", category_slug: "home-organization",
    bundles: [
      { id: "sink-1", label_ar: "قطعة واحدة - لمساحة واحدة", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 },
      { id: "sink-2", label_ar: "قطعتين - للمطبخ والحمام | الأكثر اختيارًا", quantity: 2, price_sar: 379, compare_at_price_sar: 458, savings_label_ar: "وفر 79 ريال", is_default: true, sort_order: 2 },
      { id: "sink-3", label_ar: "3 قطع - أفضل قيمة", quantity: 3, price_sar: 499, compare_at_price_sar: 687, savings_label_ar: "وفر 188 ريال", is_default: false, sort_order: 3 },
    ],
  },
  "pure-faucet-filter": {
    id: "p5", slug: "pure-faucet-filter", name_ar: "فلتر الصنبور النقي", name_en: "Pure Faucet Filter", short_description_ar: "مياه أنقى وتجربة استخدام يومية أكثر راحة وأناقة للمطبخ العصري.", category_slug: "modern-kitchen",
    bundles: [
      { id: "filter-1", label_ar: "قطعة واحدة - للمطبخ", quantity: 1, price_sar: 199, is_default: false, sort_order: 1 },
      { id: "filter-2", label_ar: "قطعتين - أفضل قيمة | وفر أكثر", quantity: 2, price_sar: 249, compare_at_price_sar: 398, savings_label_ar: "وفر 149 ريال", is_default: true, sort_order: 2 },
      { id: "filter-3", label_ar: "3 قطع - للبيت بالكامل", quantity: 3, price_sar: 379, compare_at_price_sar: 597, savings_label_ar: "وفر 218 ريال", is_default: false, sort_order: 3 },
    ],
  },
  "smart-table-warmer": {
    id: "p6", slug: "smart-table-warmer", name_ar: "سخّان المائدة الذكي", name_en: "Smart Table Warmer", short_description_ar: "حل عملي فاخر يحافظ على حرارة الطعام طوال الجلسة بكل أناقة.", category_slug: "dining-hosting",
    bundles: [
      { id: "warmer-1", label_ar: "قطعة واحدة - للجلسات اليومية", quantity: 1, price_sar: 249, is_default: false, sort_order: 1 },
      { id: "warmer-2", label_ar: "قطعتين - مثالي للعائلة والضيوف | الأكثر اختيارًا", quantity: 2, price_sar: 449, compare_at_price_sar: 498, savings_label_ar: "وفر 49 ريال", is_default: true, sort_order: 2 },
    ],
  },
  "thermal-lunch-box": {
    id: "p7", slug: "thermal-lunch-box", name_ar: "حافظة الغداء الحرارية", name_en: "Thermal Lunch Box", short_description_ar: "تجربة عملية تمنحك وجبات دافئة وجاهزة أينما كنت بسهولة وراحة.", category_slug: "dining-hosting",
    bundles: [
      { id: "lunch-1", label_ar: "قطعة واحدة - للاستخدام اليومي", quantity: 1, price_sar: 229, is_default: false, sort_order: 1 },
      { id: "lunch-2", label_ar: "قطعتين - أفضل قيمة للعائلة | وفر 129 ريال", quantity: 2, price_sar: 329, compare_at_price_sar: 458, savings_label_ar: "وفر 129 ريال", is_default: true, sort_order: 2 },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(PRODUCTS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS_DATA[slug];
  const config = PRODUCTS_CONFIG[slug];

  if (!product || !config) return { title: "منتج | متقن" };

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      images: [{ url: `/images/products/${slug}.jpg`, width: 800, height: 600, alt: product.name_ar }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCTS_DATA[slug];
  const config = PRODUCTS_CONFIG[slug];

  if (!product || !config) notFound();

  return <ProductPageClient product={product} config={config} />;
}
