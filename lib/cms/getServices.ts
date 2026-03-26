import { fetchFromCMS, type PayloadResponse } from './client'

export interface ServicePackage {
  id: string
  name: string
  nameTh: string
  description: string
  durationMinutes: number
  price: number
  features: { feature: string }[]
  isHighlighted: boolean
  sortOrder: number
  isActive: boolean
}

export async function getServices(locale: string = 'th'): Promise<ServicePackage[]> {
  try {
    const data = await fetchFromCMS<PayloadResponse<ServicePackage>>(
      `/service-packages?locale=${locale}&sort=sortOrder&limit=10&where[isActive][equals]=true`,
      { next: { revalidate: 60, tags: ['cms', 'service-packages'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}
