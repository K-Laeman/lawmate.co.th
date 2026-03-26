import { fetchFromCMS, type PayloadResponse } from './client'

export interface InquiryType {
  id: string
  value: string
  label: string
  sortOrder: number
  isActive: boolean
}

export async function getInquiryTypes(
  locale: string = 'th'
): Promise<InquiryType[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=20&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<InquiryType>>(
      `/inquiry-types${query}`,
      { next: { revalidate: 60, tags: ['cms', 'inquiry-types'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching inquiry types:', error)
    return []
  }
}
