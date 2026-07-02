import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/products/powerful-cordless-vacuum",
        destination: "/products/vacuum",
        permanent: true,
      },
      {
        source: "/products/pull-out-cabinet-drawer",
        destination: "/products/drawer",
        permanent: true,
      },
      {
        source: "/products/magic-under-sink-organizer",
        destination: "/products/sink",
        permanent: true,
      },
      {
        source: "/products/sink-organizer",
        destination: "/products/sink",
        permanent: true,
      },
      {
        source: "/products/pure-faucet-filter",
        destination: "/products/filter",
        permanent: true,
      },
      {
        source: "/products/smart-table-warmer",
        destination: "/products/warmer",
        permanent: true,
      },
      {
        source: "/products/thermal-lunch-box",
        destination: "/products/lunch",
        permanent: true,
      },
      {
        source: "/products/beauty-vanity-cabinet",
        destination: "/products/vanity",
        permanent: true,
      },
      {
        source: "/products/led-makeup-bag",
        destination: "/products/led",
        permanent: true,
      },
      {
        source: "/products/makeup-brush-cleaner",
        destination: "/products/cleaner",
        permanent: true,
      },
      {
        source: "/products/rotating-brush-organizer",
        destination: "/products/brush",
        permanent: true,
      },
      {
        source: "/products/vitamin-c-booster",
        destination: "/products/glow",
        permanent: true,
      },
      {
        source: "/products/ceramide-booster",
        destination: "/products/repair",
        permanent: true,
      },
      {
        source: "/products/pdrn-booster",
        destination: "/products/youth",
        permanent: true,
      },
      {
        source: "/products/smart-stackable-cabinet",
        destination: "/products/storage",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [48, 64, 96, 128, 256, 384, 512, 640, 960, 1200, 1920, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 90,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "mutqan.online", pathname: "/api/**" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
