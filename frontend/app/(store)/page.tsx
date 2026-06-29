import type { Metadata } from "next";
import {
  HomeBeautyHero,
  HomeBeautyTrustBar,
  HomeBeautyBestSellers,
  HomeBeautyWhyMutqan,
  HomeBeautyLifestyle,
  HomeBeautyTestimonials,
  HomeBeautyOrderSteps,
  HomeBeautyFaq,
  HomeBeautyFinalCta,
} from "@/components/home/beauty/HomeBeautySections";
import { getResolvedHomepageProducts } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متقن | تفاصيل أجمل… لأنك تستحقين الأفضل",
  description:
    "مجموعة متقن المختارة بعناية لتنظيم مستحضراتك، تنظيف فرشك، وإضاءة روتينك اليومي بأناقة وجودة تدوم. الدفع عند الاستلام وضمان 30 يوم.",
};

export default async function HomePage() {
  const products = await getResolvedHomepageProducts();

  return (
    <div className="bg-brand-background">
      <HomeBeautyHero />
      <HomeBeautyTrustBar />
      <HomeBeautyBestSellers products={products} />
      <HomeBeautyWhyMutqan />
      <HomeBeautyLifestyle />
      <HomeBeautyTestimonials />
      <HomeBeautyOrderSteps />
      <HomeBeautyFaq />
      <HomeBeautyFinalCta />
    </div>
  );
}
