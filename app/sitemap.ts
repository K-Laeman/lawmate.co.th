import type { MetadataRoute } from 'next'
import { mockBlogs } from '@/data/blogs'
import { getBlogPosts, getLegalPages } from '@/lib/cms'
import { SITE_CONFIG } from '@/lib/seo/constants'

export const revalidate = 3600

type SitemapEntry = MetadataRoute.Sitemap[number]

const baseUrl = SITE_CONFIG.url.replace(/\/$/, '')

const dedicatedLegalSlugs = new Set([
  'terms',
  'privacy',
  'cancellation-policy',
  'chat-disclaimer',
  'data-retention-policy',
  'review-policy',
])

const staticPages: SitemapEntry[] = [
  { url: baseUrl, changeFrequency: 'daily', priority: 1 },
  { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/faq`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/corporate`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${baseUrl}/administrative-case`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${baseUrl}/blogs`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${baseUrl}/lawyers`, changeFrequency: 'daily', priority: 0.9 },
  { url: `${baseUrl}/booking`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${baseUrl}/policies`, changeFrequency: 'yearly', priority: 0.4 },
  { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${baseUrl}/cancellation-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${baseUrl}/chat-disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${baseUrl}/data-retention-policy`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${baseUrl}/review-policy`, changeFrequency: 'yearly', priority: 0.3 },
]

function normalizeSlug(slug: string): string {
  return slug.replace(/^\/+/, '').replace(/\/+$/, '')
}

function validDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

async function getBlogSitemapPages(): Promise<SitemapEntry[]> {
  const firstPage = await getBlogPosts('th', { limit: 100, page: 1 })
  const cmsPosts = [...firstPage.docs]

  const maxPages = Math.min(firstPage.totalPages, 50)
  for (let page = 2; page <= maxPages; page += 1) {
    const result = await getBlogPosts('th', { limit: 100, page })
    cmsPosts.push(...result.docs)
  }

  if (cmsPosts.length === 0) {
    return mockBlogs.map((blog) => ({
      url: `${baseUrl}/blogs/${normalizeSlug(blog.slug)}`,
      lastModified: validDate(blog.publishedDate),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  }

  return cmsPosts.map((post) => ({
    url: `${baseUrl}/blogs/${normalizeSlug(post.slug)}`,
    lastModified: validDate(post.updatedAt ?? post.publishedDate),
    changeFrequency: 'monthly',
    priority: post.isFeatured ? 0.7 : 0.6,
  }))
}

async function getLegalSitemapPages(): Promise<SitemapEntry[]> {
  const pages = await getLegalPages('th')

  return pages
    .filter((page) => !dedicatedLegalSlugs.has(normalizeSlug(page.slug)))
    .map((page) => ({
      url: `${baseUrl}/legal/${normalizeSlug(page.slug)}`,
      lastModified: validDate(page.updatedAt ?? page.lastUpdated),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }))
}

async function getLawyerSitemapPages(): Promise<SitemapEntry[]> {
  const dashboardUrl =
    process.env.DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://app.lawmate.co.th' : 'http://localhost:3000')

  try {
    const response = await fetch(`${dashboardUrl}/api/v1/lawyers?limit=500&isAvailable=true`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) return []

    const result = (await response.json()) as {
      success?: boolean
      data?: Array<{ id?: string }>
    }

    if (!result.success || !Array.isArray(result.data)) return []

    return result.data
      .filter((lawyer): lawyer is { id: string } => typeof lawyer.id === 'string' && lawyer.id.length > 0)
      .map((lawyer) => ({
        url: `${baseUrl}/lawyers/${lawyer.id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPages, legalPages, lawyerPages] = await Promise.all([
    getBlogSitemapPages(),
    getLegalSitemapPages(),
    getLawyerSitemapPages(),
  ])

  return [...staticPages, ...blogPages, ...legalPages, ...lawyerPages]
}
