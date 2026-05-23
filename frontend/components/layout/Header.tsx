"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { BRAND, WHATSAPP_URL } from "@/config/brand";
import { COLLECTIONS } from "@/config/collections";
import { cn } from "@/lib/utils";

export function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-brand-border/60">
      <div className="max-w-content mx-auto page-x">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex flex-col leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-extrabold text-brand-espresso tracking-tight group-hover:text-brand-bronze transition-colors">
                  مُتقن
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-bronze inline-block mb-3" />
              </div>
              <span className="text-[10px] font-semibold text-brand-muted tracking-widest uppercase -mt-1">
                Mutqan
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-brand-muted">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="relative py-1 hover:text-brand-espresso transition-colors after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-brand-bronze after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
              >
                {col.nameAr}
              </Link>
            ))}
            <Link
              href="/about"
              className="relative py-1 hover:text-brand-espresso transition-colors after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-brand-bronze after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
            >
              عن مُتقن
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              aria-label={`سلة الشراء - ${itemCount} منتج`}
              className="relative p-2.5 rounded-xl hover:bg-brand-beige transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-brand-espresso" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -start-0.5 bg-brand-bronze text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2.5 rounded-xl hover:bg-brand-beige transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-brand-border/60 animate-fade-in">
          <nav className="max-w-content mx-auto page-x py-4 flex flex-col gap-1">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="py-2.5 px-3 rounded-xl text-brand-espresso font-medium hover:bg-brand-beige hover:text-brand-bronze transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {col.nameAr}
              </Link>
            ))}
            <div className="border-t border-brand-border/60 my-2" />
            <Link href="/about" className="py-2.5 px-3 rounded-xl text-brand-muted hover:bg-brand-beige hover:text-brand-espresso transition-colors" onClick={() => setMenuOpen(false)}>
              عن مُتقن
            </Link>
            <Link href="/faq" className="py-2.5 px-3 rounded-xl text-brand-muted hover:bg-brand-beige hover:text-brand-espresso transition-colors" onClick={() => setMenuOpen(false)}>
              الأسئلة الشائعة
            </Link>
            <Link href="/track-order" className="py-2.5 px-3 rounded-xl text-brand-muted hover:bg-brand-beige hover:text-brand-espresso transition-colors" onClick={() => setMenuOpen(false)}>
              تتبع الطلب
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
