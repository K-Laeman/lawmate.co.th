import { fetchFromCMS, type PayloadResponse } from './client'

export interface CompanyValue {
  id: string
  title: string
  description: string
  icon: string
  sortOrder: number
  isActive: boolean
}

export async function getCompanyValues(
  locale: string = 'th'
): Promise<CompanyValue[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=10&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<CompanyValue>>(
      `/company-values${query}`,
      { next: { revalidate: 60, tags: ['cms', 'company-values'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching company values:', error)
    return []
  }
}
