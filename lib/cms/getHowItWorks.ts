import { fetchFromCMS, type PayloadResponse } from './client'

export interface HowItWorksStep {
  id: string
  stepNumber: string
  title: string
  description: string
  icon: string
  sortOrder: number
}

export async function getHowItWorks(locale: string = 'th'): Promise<HowItWorksStep[]> {
  try {
    const data = await fetchFromCMS<PayloadResponse<HowItWorksStep>>(
      `/how-it-works-steps?locale=${locale}&sort=sortOrder&limit=10`,
      { next: { revalidate: 60, tags: ['cms', 'how-it-works-steps'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching how it works steps:', error)
    return []
  }
}
