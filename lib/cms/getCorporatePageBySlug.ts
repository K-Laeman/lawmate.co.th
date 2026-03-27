import { fetchFromCMS } from './client'
import type { CorporatePageData } from './getCorporatePage'

interface CorporatePagesResponse {
  docs: (CorporatePageData & { slug: string })[]
  totalDocs: number
}

export async function getCorporatePageBySlug(
  slug: string,
  locale = 'th'
): Promise<CorporatePageData | null> {
  try {
    const data = await fetchFromCMS<CorporatePagesResponse>(
      `/corporate-pages?where[slug][equals]=${encodeURIComponent(slug)}&locale=${locale}&depth=1&limit=1`,
      { next: { revalidate: 60, tags: ['cms', 'corporate-pages'] } }
    )
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error('Error fetching corporate page by slug:', error)
    return null
  }
}

export async function getAllCorporatePageSlugs(): Promise<string[]> {
  try {
    const data = await fetchFromCMS<CorporatePagesResponse>(
      `/corporate-pages?limit=100&depth=0&where[_status][equals]=published`,
      { next: { revalidate: 3600, tags: ['cms', 'corporate-pages'] } }
    )
    return data?.docs?.map((doc) => doc.slug).filter(Boolean) ?? []
  } catch {
    return []
  }
}
