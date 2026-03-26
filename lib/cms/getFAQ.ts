import { fetchFromCMS, type PayloadResponse } from './client'

export interface FAQ {
  id: string
  question: string
  answer: unknown // Rich text content from Lexical editor
  category: 'general' | 'pricing' | 'trust' | 'booking' | 'hiring' | 'services'
  sortOrder: number
  isActive: boolean
}

export async function getFAQ(
  locale: string = 'th',
  options?: { category?: string; limit?: number }
): Promise<FAQ[]> {
  try {
    let query = `?locale=${locale}&sort=sortOrder&limit=${options?.limit || 20}`
    query += '&where[isActive][equals]=true'

    if (options?.category) {
      query += `&where[category][equals]=${options.category}`
    }

    const data = await fetchFromCMS<PayloadResponse<FAQ>>(
      `/faqs${query}`,
      { next: { revalidate: 60, tags: ['cms', 'faqs'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}
