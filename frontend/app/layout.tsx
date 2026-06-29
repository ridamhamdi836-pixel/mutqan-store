import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { fontArabic, fontLatin } from "@/lib/fonts";
import { getBundledPixelConfig } from "@/lib/browser-pixel-config";
import { getHotjarSiteId } from "@/lib/hotjar-config";
import { StoreThemeProvider } from "@/components/brand/StoreThemeProvider";
import { getResolvedStoreSettings } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "متقن | تفاصيل أجمل لروتين جمالك",
    template: "%s | متقن",
  },
  description:
    "تسوقي منتجات متقن المختارة بعناية لتنظيم مستحضراتك، إضاءة روتينك، والعناية بفرش المكياج. الدفع عند الاستلام والتوصيل داخل السعودية.",
  keywords: [
    "منظمات مكياج",
    "حقيبة مكياج LED",
    "تنظيف فرش المكياج",
    "اكسسوارات جمال",
    "الدفع عند الاستلام",
    "توصيل السعودية",
    "متقن",
    "منتجات جمال",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: "متقن",
    title: "متقن | تفاصيل أجمل لروتين جمالك",
    description:
      "منتجات جمال مختارة بعناية لتنظيم مستحضراتك وإضاءة روتينك اليومي بأناقة.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/icon.svg?v=3", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg?v=3", type: "image/svg+xml" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pixels = getBundledPixelConfig();
  const hotjarSiteId = getHotjarSiteId();
  const settings = await getResolvedStoreSettings();

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${fontArabic.variable} ${fontLatin.variable}`}
    >
      <body className="font-sans antialiased">
        <AnalyticsProvider pixels={pixels} hotjarSiteId={hotjarSiteId}>
          <StoreThemeProvider settings={settings}>
            <CartProvider>{children}</CartProvider>
          </StoreThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
