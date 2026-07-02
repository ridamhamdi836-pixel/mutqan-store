import { BRAND } from "@/config/brand";

export const FOOTER_CONTENT = {
  description:
    "متجر سعودي متخصص في العناية الكورية الفاخرة — سيرومات مركّزة بمكونات نشطة واضحة، للدفع عند الاستلام داخل المملكة.",
  trustPills: ["كورية أصلية", "مكونات واضحة", "ضمان 30 يوم"] as const,
  products: {
    title: "السيرومات",
    links: [
      { label: "المجموعة الكاملة", href: "/collections" },
      { label: "سيروم فيتامين C", href: "/products/glow" },
      { label: "سيروم السنتيلا والسيراميد", href: "/products/repair" },
      { label: "سيروم PDRN والببتيدات", href: "/products/youth" },
    ],
  },
  legal: {
    title: "قانوني",
    links: [
      { label: "سياسة الخصوصية", href: "/privacy-policy" },
      { label: "الشروط والأحكام", href: "/terms" },
      { label: "الشحن والتوصيل", href: "/shipping" },
      { label: "عن متقن", href: "/about" },
    ],
  },
  support: {
    title: "الدعم",
    links: [
      { label: "تواصل معنا", href: "/contact" },
      { label: "واتساب", href: "whatsapp" as const },
      { label: BRAND.supportEmail, href: `mailto:${BRAND.supportEmail}` },
    ],
    notes: [
      "الشحن داخل السعودية فقط",
      "الدفع عند الاستلام",
    ],
  },
  copyright: `© ${new Date().getFullYear()} متقن | Mutqan. جميع الحقوق محفوظة.`,
} as const;
