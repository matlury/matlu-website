import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  sassOptions: {
    includePaths: ["./src"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      // Add production Strapi URL here when available
    ],
  },
};

export default nextConfig;
