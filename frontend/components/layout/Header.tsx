"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { BRAND } from "@/config/brand";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { STORE_NAV_ITEMS, isNavItemActive } from "@/config/navigation";
import { cn } from "@/lib/utils";

const NAV_LINK_CLASS =
  "relative py-2 text-[15px] font-medium text-brand-forest tracking-wide transition-colors duration-300 ease-out after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:rounded-full after:bg-brand-gold after:scale-x-0 after:transition-transform after:duration-300 after:ease-out after:origin-center hover:text-brand-gold hover:after:scale-x-100";

function NavLink({
  href,
  label,
  active,
  primary,
  onClick,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        NAV_LINK_CLASS,
        active && "text-brand-gold after:scale-x-100",
        primary && !active && "font-semibold",
        className,
      )}
      aria-current={active ? "page" : undefined}
    >
      {label}
      {active && (
        <span
          className="absolute -bottom-0.5 start-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold md:hidden"
          aria-hidden
        />
      )}
    </Link>
  );
}

export function Header() {
  const { itemCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const isProductPage = pathname.startsWith("/products/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-white transition-all duration-300 ease-out",
        scrolled
          ? "border-b border-brand-border/30 shadow-[0_1px_12px_rgba(47,69,56,0.06)]"
          : "border-b border-brand-border/20",
      )}
    >
      <div className="max-w-content mx-auto page-x">
        <div
          className={cn(
            "relative flex items-center justify-between w-full",
            isProductPage ? "h-14" : "h-[4.25rem] md:h-[4.75rem]",
          )}
        >
          <Link
            href="/"
            className="flex items-center shrink-0 z-10 group py-1"
            aria-label={`${BRAND.nameAr} — الرئيسية`}
          >
            <BrandLogo
              variant="default"
              orientation="horizontal"
              className="h-11 w-[138px] sm:h-12 sm:w-[150px] transition-opacity duration-300 group-hover:opacity-85"
            />
          </Link>

          <nav
            className={cn(
              "hidden lg:flex items-center justify-center gap-10 xl:gap-14",
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              isProductPage && "!hidden",
            )}
            aria-label="التنقل الرئيسي"
          >
            {STORE_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavItemActive(item, pathname)}
                primary={item.isPrimary}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0 z-10">
            <button
              onClick={openCart}
              aria-label={`سلة الشراء - ${itemCount} منتج`}
              className="relative p-2.5 rounded-xl text-brand-espresso hover:text-brand-gold hover:bg-brand-gold/8 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -start-0.5 bg-brand-espresso text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {!isProductPage ? (
              <button
                className="lg:hidden p-2.5 rounded-xl text-brand-espresso hover:text-brand-gold hover:bg-brand-gold/8 transition-all duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-5 h-5" strokeWidth={1.75} /> : <Menu className="w-5 h-5" strokeWidth={1.75} />}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {menuOpen && !isProductPage && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 top-[4.25rem] bg-brand-espresso/20 backdrop-blur-sm z-20 animate-fade-in"
            aria-label="إغلاق القائمة"
            onClick={() => setMenuOpen(false)}
          />

          <div className="lg:hidden relative z-30 bg-white/95 backdrop-blur-xl border-t border-brand-border/30 animate-slide-up shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
            <nav className="max-w-content mx-auto page-x py-6 flex flex-col gap-1" aria-label="قائمة الجوال">
              {STORE_NAV_ITEMS.map((item) => {
                const active = isNavItemActive(item, pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "relative py-3.5 px-4 rounded-xl text-[16px] font-medium text-brand-espresso transition-all duration-200",
                      "border border-transparent",
                      active
                        ? "bg-brand-gold/8 text-brand-gold border-brand-gold/20"
                        : "hover:bg-brand-background hover:text-brand-gold",
                      item.isPrimary && !active && "font-semibold",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="flex items-center gap-3">
                      {active && (
                        <span className="w-1 h-5 rounded-full bg-brand-gold shrink-0" aria-hidden />
                      )}
                      {item.label}
                    </span>
                  </Link>
                );
              })}

              <div className="border-t border-brand-border/40 my-4" />

              <Link
                href="/faq"
                className="py-3 px-4 rounded-xl text-[15px] text-brand-muted font-medium hover:text-brand-gold hover:bg-brand-background transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                الأسئلة الشائعة
              </Link>
              <Link
                href="/track-order"
                className="py-3 px-4 rounded-xl text-[15px] text-brand-muted font-medium hover:text-brand-gold hover:bg-brand-background transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                تتبع الطلب
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
