import type { Metadata } from "next";
import { TermsPageContent } from "@/components/legal/TermsPageContent";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "شروط وأحكام الاستخدام والشراء من متقن.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
