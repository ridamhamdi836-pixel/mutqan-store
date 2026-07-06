import type { Metadata } from "next";
import { FaqPageContent } from "@/components/legal/FaqPageContent";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات على أكثر الأسئلة شيوعًا حول الطلب والتوصيل والدفع عند الاستلام من متقن.",
};

export default function FAQPage() {
  return <FaqPageContent />;
}
