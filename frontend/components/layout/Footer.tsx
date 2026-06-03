"use client";

import Link from "next/link";
import { BRAND, WHATSAPP_URL } from "@/config/brand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Shield, Truck, Banknote } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-espresso text-brand-sand mt-20">
      <div className="max-w-content mx-auto page-x py-14">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 pb-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-brand-trust" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">ضمان ٣٠ يوم</p>
              <p className="text-xs text-brand-sand/60">استرجاع أو استبدال مجاني</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Banknote className="w-5 h-5 text-brand-trust" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">الدفع عند الاستلام</p>
              <p className="text-xs text-brand-sand/60">ادفع نقدًا عند وصول طلبك</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-brand-trust" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">توصيل سريع</p>
              <p className="text-xs text-brand-sand/60">لجميع مناطق المملكة</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <BrandLogo
                variant="light"
                className="h-14 w-14"
                sizes="56px"
              />
            </Link>
            <p className="text-sm text-brand-sand/70 leading-relaxed max-w-xs">
              تفاصيل عملية ومُتقنة تجعل البيت أكثر ترتيبًا وراحة وأناقة. منتجات مختارة بعناية لبيوت الخليج.
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
          <p>© {new Date().getFullYear()} مُتقن | Mutqan — جميع الحقوق محفوظة</p>
          <p>صُنع بعناية للبيوت السعودية</p>
        </div>
      </div>
    </footer>
  );
}
