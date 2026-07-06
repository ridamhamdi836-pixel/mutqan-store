import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { AnalyticsProvider } from "@/providers/analytics-provider";
import { fontArabic, fontLatin } from "@/lib/fonts";
import { getBundledPixelConfig } from "@/lib/browser-pixel-config";
import { getHotjarSiteId } from "@/lib/hotjar-config";
import { StoreThemeProvider } from "@/components/brand/StoreThemeProvider";
import { StorefrontProvider } from "@/providers/storefront-provider";
import { getResolvedStoreSettings } from "@/lib/storefront-resolver";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mutqan.online";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "متقن | عناية كورية فاخرة لبشرة تثقين بها",
    template: "%s | متقن",
  },
  description:
    "متقن — معزّزات كورية مركّزة للإشراقة والإصلاح والشباب. روتين بسيط بخطوة واحدة. الدفع عند الاستلام والتوصيل داخل السعودية والإمارات.",
  keywords: [
    "عناية كورية",
    "فيتامين سي للبشرة",
    "سيراميد",
    "PDRN",
    "العناية بالبشرة",
    "الدفع عند الاستلام",
    "توصيل السعودية",
    "متقن",
    "معززات البشرة",
  ],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: "متقن",
    title: "متقن | عناية كورية فاخرة لبشرة تثقين بها",
    description:
      "معزّزات كورية مركّزة — إشراقة، إصلاح، وشباب. روتين بسيط يعيد الثقة.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/icon.png?v=4", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.png?v=4", type: "image/png", sizes: "512x512" }],
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
            <StorefrontProvider>
              <CartProvider>{children}</CartProvider>
            </StorefrontProvider>
          </StoreThemeProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
