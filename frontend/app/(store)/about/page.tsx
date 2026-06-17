import type { Metadata } from "next";
import { AboutBeautyPage } from "@/components/about/AboutBeautyPage";

export const metadata: Metadata = {
  title: "عن مُتقن | تفاصيل أجمل لروتين جمالك",
  description:
    "تعرفي على مُتقن — علامة سعودية فاخرة متخصصة في منظمات الجمال، حقائب المكياج بإضاءة LED، وحلول العناية بالفرش. تفاصيل أنيقة تستحقينها.",
};

export default function AboutPage() {
  return <AboutBeautyPage />;
}
