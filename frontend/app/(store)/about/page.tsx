import type { Metadata } from "next";
import { AboutBeautyPage } from "@/components/about/AboutBeautyPage";

export const metadata: Metadata = {
  title: "عن متقن | عناية كورية فاخرة",
  description:
    "تعرفي على متقن — بوسترات كورية مركّزة للإشراقة والإصلاح والشباب. تركيبات مدروسة، دفع عند الاستلام، وضمان 30 يوم.",
};

export default function AboutPage() {
  return <AboutBeautyPage />;
}
