import { fetchFromCMS, type PayloadResponse } from './client'

export interface CaseSubtype {
  code: string
  nameTh: string
  nameEn: string
  icon?: string
  description?: string
}

export interface CaseType {
  id: string
  code: 'civil' | 'criminal' | 'corporate'
  nameTh: string
  nameEn: string
  icon?: string
  description?: string
  subtypes: CaseSubtype[]
  sortOrder: number
}

export async function getCaseTypes(locale: string = 'th'): Promise<CaseType[]> {
  try {
    const data = await fetchFromCMS<PayloadResponse<CaseType>>(
      `/case-types?locale=${locale}&sort=sortOrder&limit=10`,
      { next: { revalidate: 60, tags: ['cms', 'case-types'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching case types:', error)
    return []
  }
}
