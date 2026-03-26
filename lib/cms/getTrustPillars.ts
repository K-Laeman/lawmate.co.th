import { fetchFromCMS, type PayloadResponse } from './client'

export interface TrustPillar {
  id: string
  title: string
  description: string
  icon: string
  sortOrder: number
}

export async function getTrustPillars(locale: string = 'th'): Promise<TrustPillar[]> {
  try {
    const data = await fetchFromCMS<PayloadResponse<TrustPillar>>(
      `/trust-pillars?locale=${locale}&sort=sortOrder&limit=10`,
      { next: { revalidate: 60, tags: ['cms', 'trust-pillars'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching trust pillars:', error)
    return []
  }
}
