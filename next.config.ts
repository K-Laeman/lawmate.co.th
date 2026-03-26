import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false,

  // Optimize icon library imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // All marketing pages are CDN-cacheable
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Browser cache: 1 hour, allow serving stale while revalidating for 24h
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
          // Vercel edge cache: same policy
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // API routes: never cache at CDN or browser
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  // Image optimization settings
  images: {
    // Serve AVIF first (50% smaller than WebP), fallback to WebP
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 30 days (default is 60s — too short)
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lawmate-documents.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.lawmate.co.th',
      },
      {
        protocol: 'https',
        hostname: 'media.lawmate.co.th',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'https' as const,
          hostname: 'placehold.co',
        },
      ] : []),
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
