/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable if you want to use the new experimental features
    serverComponentsExternalPackages: ['@prisma/client'],
  },
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
}

export default nextConfig
