/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Set to false in production
  },
  eslint: {
    ignoreDuringBuilds: false, // Set to false in production
  },
  images: {
    // Only allow images from your specific domains
    domains: [
      'yourdomain.com',
      'www.yourdomain.com',
      'assets.yourdomain.com'
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // More secure remote patterns for production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yourdomain.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yourdomain.com',
        pathname: '/**',
      },
    ],
  },
  swcMinify: true,
  output: 'standalone',
  // Enable compression
  compress: true,
  // Power up the build
  poweredByHeader: false,
  // React strict mode
  reactStrictMode: true,
}

module.exports = nextConfig