"use client";

import Link from "next/link";
import { BRAND, WHATSAPP_URL } from "@/config/brand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { TrustFeaturesStrip } from "@/components/trust/TrustFeaturesStrip";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("mt-20", className)}>
      <TrustFeaturesStrip />

      <div className="bg-brand-espresso text-brand-sand">
        <div className="max-w-content mx-auto page-x py-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <BrandLogo
                variant="light"
                orientation="horizontal"
                className="h-14 w-[170px]"
              />
            </Link>
            <p className="text-sm text-brand-sand/70 leading-relaxed max-w-xs">
              عناية كورية فاخرة تمنحكِ إشراقة وثقة — روتين بسيط، مكونات مدروسة، وشعور بالجمال يبدأ من بشرتك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">روابط سريعة</h3>
            <ul className="space-y-2.5 text-sm text-brand-sand/70">
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  عن مُتقن
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  سياسة الشحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  تتبع الطلب
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Support */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm">السياسات والدعم</h3>
            <ul className="space-y-2.5 text-sm text-brand-sand/70">
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  سياسة الإرجاع
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  دعم عبر واتساب
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-sand/50">
          <p>© {new Date().getFullYear()} مُتقن | Mutqan — عناية كورية فاخرة</p>
          <p>صُنع بعناية لبشرة تثقين بها</p>
        </div>
        </div>
      </div>
    </footer>
  );
}
