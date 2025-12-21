import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "13.125.120.86",
        port: "8000",
        pathname: "/api/artifacts/**",
      },
    ],
  },
};

export default nextConfig;
