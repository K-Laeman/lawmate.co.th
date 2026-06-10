import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/seo/constants'

const baseUrl = SITE_CONFIG.url.replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og'],
        disallow: [
          '/api/',
          '/booking/payment',
          '/booking/confirmation',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
