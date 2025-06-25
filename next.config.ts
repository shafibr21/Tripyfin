import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Replace experimental.serverComponentsExternalPackages with this:
  serverExternalPackages: ['@prisma/client'],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
