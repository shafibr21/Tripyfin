/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure compatibility with Next.js 15
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors (not recommended for production)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors (not recommended for production)
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
