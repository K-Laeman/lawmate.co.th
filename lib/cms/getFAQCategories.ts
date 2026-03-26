import { fetchFromCMS, type PayloadResponse } from './client'

export interface FAQCategory {
  id: string
  slug: string
  label: string
  icon: string
  sortOrder: number
  isActive: boolean
}

export async function getFAQCategories(
  locale: string = 'th'
): Promise<FAQCategory[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=20&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<FAQCategory>>(
      `/faq-categories${query}`,
      { next: { revalidate: 60, tags: ['cms', 'faq-categories'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching FAQ categories:', error)
    return []
  }
}
