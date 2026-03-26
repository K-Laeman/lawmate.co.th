import { fetchFromCMS, type PayloadResponse } from './client'

export interface Testimonial {
  id: string
  authorName: string
  avatar?: { url: string; alt?: string }
  rating: number
  quote: string
  caseType: string
  date: string
  isFeatured: boolean
  isVerified: boolean
}

export async function getTestimonials(
  locale: string = 'th',
  options?: { featuredOnly?: boolean; limit?: number }
): Promise<Testimonial[]> {
  try {
    let query = `?locale=${locale}&limit=${options?.limit || 6}&sort=-date`

    if (options?.featuredOnly) {
      query += '&where[isFeatured][equals]=true'
    }

    const data = await fetchFromCMS<PayloadResponse<Testimonial>>(
      `/testimonials${query}`,
      { next: { revalidate: 60, tags: ['cms', 'testimonials'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}
