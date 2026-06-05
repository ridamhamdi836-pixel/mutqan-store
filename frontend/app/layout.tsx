import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { fontArabic, fontLatin } from "@/lib/fonts";
import { getBundledPixelConfig } from "@/lib/browser-pixel-config";
import { getHotjarSiteId } from "@/lib/hotjar-config";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "متقن | حلول عصرية لتنظيم وراحة البيت الخليجي",
    template: "%s | متقن",
  },
  description:
    "تسوق منتجات متقن المختارة بعناية لتنظيم المنزل والمطبخ وتجربة يومية أكثر راحة. الدفع عند الاستلام والتوصيل داخل السعودية.",
  keywords: [
    "تنظيم المنزل",
    "تنظيم المطبخ",
    "الدفع عند الاستلام",
    "توصيل السعودية",
    "متقن",
    "منتجات منزلية",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: "متقن",
    title: "متقن | حلول عصرية لتنظيم وراحة البيت الخليجي",
    description:
      "تسوق منتجات متقن المختارة بعناية لتنظيم المنزل والمطبخ وتجربة يومية أكثر راحة.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pixels = getBundledPixelConfig();
  const hotjarSiteId = getHotjarSiteId();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${fontArabic.variable} ${fontLatin.variable}`}
    >
      <body className="font-sans antialiased">
        <AnalyticsProvider pixels={pixels} hotjarSiteId={hotjarSiteId}>
          <CartProvider>{children}</CartProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
