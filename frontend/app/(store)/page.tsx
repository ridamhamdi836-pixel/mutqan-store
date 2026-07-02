import type { Metadata } from "next";
import {
  HomeBeautyHero,
  HomeBeautyFormulations,
  HomeBeautyWhyMutqan,
  HomeBeautyTestimonials,
  HomeBeautyOrderSteps,
  HomeBeautyFinalCta,
  HomeBeautyFaq,
  HomeBeautyTrustFooter,
} from "@/components/home/beauty/HomeBeautySections";
import { getResolvedHomepageProducts } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "متقن | عناية كورية فاخرة لبشرة تثقين بها",
  description:
    "متقن — سيرومات كورية مركّزة للإشراقة والإصلاح والشباب. مكونات نشطة بجرعات واضحة. الدفع عند الاستلام وضمان 30 يوم.",
};

export default async function HomePage() {
  const products = await getResolvedHomepageProducts();

  return (
    <div className="bg-brand-background">
      <HomeBeautyHero />
      <HomeBeautyFormulations products={products} />
      <HomeBeautyWhyMutqan />
      <HomeBeautyTestimonials />
      <HomeBeautyOrderSteps />
      <HomeBeautyFinalCta />
      <HomeBeautyFaq />
      <HomeBeautyTrustFooter />
    </div>
  );
}
