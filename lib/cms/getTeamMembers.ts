import { fetchFromCMS, type PayloadResponse } from './client'

export interface TeamMember {
  id: string
  name: string
  role: string
  department?: 'leadership' | 'legal' | 'technology' | 'operations' | 'marketing' | 'support'
  bio?: string
  photo?: {
    id: string
    url: string
    alt?: string
  }
  socialLinks?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
  sortOrder: number
  isActive: boolean
}

export async function getTeamMembers(
  locale: string = 'th',
  options?: { department?: string; limit?: number }
): Promise<TeamMember[]> {
  try {
    let query = `?locale=${locale}&sort=sortOrder&limit=${options?.limit || 50}`
    query += '&where[isActive][equals]=true'

    if (options?.department) {
      query += `&where[department][equals]=${options.department}`
    }

    const data = await fetchFromCMS<PayloadResponse<TeamMember>>(
      `/team-members${query}`,
      { next: { revalidate: 60, tags: ['cms', 'team-members'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}
