import type { Metadata } from "next";
import { ShippingPolicyContent } from "@/components/legal/ShippingPolicyContent";

export const metadata: Metadata = {
  title: "سياسة الشحن | مُتقن",
  description: "سياسة الشحن والتوصيل في مُتقن. توصيل سريع وموثوق داخل السعودية والإمارات.",
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyContent />;
}
