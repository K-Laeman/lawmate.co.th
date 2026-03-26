import { fetchFromCMS, type PayloadResponse } from './client'

export interface LegalPageSection {
  heading: string
  content: unknown // Rich text content from Lexical editor
}

export interface LegalPage {
  id: string
  title: string
  slug: string
  heroSubtitle?: string
  lastUpdated: string
  alertBox?: {
    enabled: boolean
    content?: string
  }
  sections: LegalPageSection[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function getLegalPageBySlug(
  slug: string,
  locale: string = 'th'
): Promise<LegalPage | null> {
  try {
    const query = `?locale=${locale}&where[slug][equals]=${slug}&limit=1`

    const data = await fetchFromCMS<PayloadResponse<LegalPage>>(
      `/legal-pages${query}`,
      { next: { revalidate: 60, tags: ['cms', 'legal-pages'] } }
    )
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error('Error fetching legal page:', error)
    return null
  }
}

export async function getLegalPages(
  locale: string = 'th'
): Promise<LegalPage[]> {
  try {
    const query = `?locale=${locale}&limit=20`

    const data = await fetchFromCMS<PayloadResponse<LegalPage>>(
      `/legal-pages${query}`,
      { next: { revalidate: 60, tags: ['cms', 'legal-pages'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching legal pages:', error)
    return []
  }
}
