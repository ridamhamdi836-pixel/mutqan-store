import type { Metadata } from "next";
import {
  HomeBeautyHero,
  HomeBeautyTrustBar,
  HomeBeautyWhyStartCare,
  HomeBeautyThreeSteps,
  HomeBeautyBestSellers,
  HomeBeautyWhyMutqan,
  HomeBeautyResults,
  HomeBeautyBeforeAfter,
  HomeBeautyRoutine,
  HomeBeautyLifestyle,
  HomeBeautyTestimonials,
  HomeBeautyOrderSteps,
  HomeBeautyFaq,
  HomeBeautyFinalCta,
} from "@/components/home/beauty/HomeBeautySections";
import { getResolvedHomepageProducts } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متقن | عناية كورية فاخرة لبشرة تثقين بها",
  description:
    "متقن — عناية كورية فاخرة للإشراقة والإصلاح والشباب. معزّزات مركزة بخطوة واحدة. الدفع عند الاستلام وضمان 30 يوم.",
};

export default async function HomePage() {
  const products = await getResolvedHomepageProducts();

  return (
    <div className="bg-brand-background">
      <HomeBeautyHero />
      <HomeBeautyTrustBar />
      <HomeBeautyWhyStartCare />
      <HomeBeautyThreeSteps />
      <HomeBeautyBestSellers products={products} />
      <HomeBeautyWhyMutqan />
      <HomeBeautyResults />
      <HomeBeautyBeforeAfter />
      <HomeBeautyRoutine />
      <HomeBeautyLifestyle />
      <HomeBeautyTestimonials />
      <HomeBeautyOrderSteps />
      <HomeBeautyFaq />
      <HomeBeautyFinalCta />
    </div>
  );
}
