import type { Metadata } from "next";
import { AboutBeautyPage } from "@/components/about/AboutBeautyPage";

export const metadata: Metadata = {
  title: "عن متقن | عناية كورية فاخرة",
  description:
    "تعرفي على متقن — علامة عناية كورية فاخرة تقدّم معزّزات مركّزة للإشراقة والإصلاح والشباب. بشرة تثقين بها.",
};

export default function AboutPage() {
  return <AboutBeautyPage />;
}
