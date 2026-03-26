import { fetchFromCMS, type PayloadResponse } from './client'

export interface QuickLink {
  id: string
  title: string
  description: string
  icon: string
  href: string
  sortOrder: number
  isActive: boolean
}

export async function getQuickLinks(
  locale: string = 'th'
): Promise<QuickLink[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=10&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<QuickLink>>(
      `/quick-links${query}`,
      { next: { revalidate: 60, tags: ['cms', 'quick-links'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching quick links:', error)
    return []
  }
}
