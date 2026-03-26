import { fetchFromCMS, type PayloadResponse } from './client'

export interface CorporateService {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  features?: Array<{ feature: string }>
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
}

export async function getCorporateServices(
  locale: string = 'th',
  options?: { featured?: boolean; limit?: number }
): Promise<CorporateService[]> {
  try {
    let query = `?locale=${locale}&sort=sortOrder&limit=${options?.limit || 20}`
    query += '&where[isActive][equals]=true'

    if (options?.featured) {
      query += '&where[isFeatured][equals]=true'
    }

    const data = await fetchFromCMS<PayloadResponse<CorporateService>>(
      `/corporate-services${query}`,
      { next: { revalidate: 60, tags: ['cms', 'corporate-services'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching corporate services:', error)
    return []
  }
}
