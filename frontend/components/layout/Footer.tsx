"use client";

import Link from "next/link";
import { WHATSAPP_URL } from "@/config/brand";
import { FOOTER_CONTENT } from "@/config/footer";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { TrustFeaturesStrip } from "@/components/trust/TrustFeaturesStrip";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const { products, legal, support } = FOOTER_CONTENT;

  return (
    <footer className={cn("mt-20", className)}>
      <TrustFeaturesStrip />

      <div className="bg-[#F5F0E8] text-brand-forest border-t border-brand-border/20">
        <div className="max-w-content mx-auto page-x py-12 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <BrandLogo
                  variant="default"
                  orientation="horizontal"
                  className="h-12 w-[150px]"
                />
              </Link>
              <p className="text-sm text-brand-muted leading-relaxed max-w-xs mb-5">
                {FOOTER_CONTENT.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {FOOTER_CONTENT.trustPills.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center rounded-full border border-brand-forest/20 bg-white/60 px-3 py-1 text-[11px] font-bold text-brand-forest"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-bold text-brand-forest mb-2 text-sm">
                {products.title}
              </h3>
              <ul className="space-y-2 text-sm text-brand-muted">
                {products.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-brand-forest transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-brand-forest mb-2 text-sm">
                {legal.title}
              </h3>
              <ul className="space-y-2 text-sm text-brand-muted">
                {legal.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-brand-forest transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-brand-forest mb-2 text-sm">
                {support.title}
              </h3>
              <ul className="space-y-2 text-sm text-brand-muted">
                {support.links.map((link) => {
                  if (link.href === "whatsapp") {
                    return (
                      <li key="whatsapp">
                        <a
                          href={WHATSAPP_URL()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-forest transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  if (link.href.startsWith("mailto:")) {
                    return (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="hover:text-brand-forest transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-brand-forest transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 space-y-1 text-xs text-brand-muted/80">
                {support.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border/25 pt-6 text-center text-xs text-brand-muted">
            <p>{FOOTER_CONTENT.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
