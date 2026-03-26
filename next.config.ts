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
          { key: 'CDN-Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      // API routes: never cache at CDN
      {
        source: '/api/:path*',
        headers: [
          { key: 'CDN-Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },

  // Image optimization settings
  images: {
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
