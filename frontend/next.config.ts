import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
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
