import { fetchFromCMS, type PayloadResponse } from './client'

export interface TimelineEvent {
  id: string
  year: string
  title: string
  description: string
  icon?: string
  sortOrder: number
  isActive: boolean
}

export async function getCompanyTimeline(
  locale: string = 'th'
): Promise<TimelineEvent[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=20&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<TimelineEvent>>(
      `/company-timeline${query}`,
      { next: { revalidate: 60, tags: ['cms', 'company-timeline'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching company timeline:', error)
    return []
  }
}
