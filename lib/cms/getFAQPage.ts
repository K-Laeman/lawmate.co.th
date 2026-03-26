import { fetchFromCMS } from './client'

export interface FAQPageData {
  hero: {
    badge?: string
    headline: string
    subheadline: string
    searchPlaceholder?: string
  }
  emptyState: {
    icon?: string
    title?: string
    description?: string
    buttonText?: string
  }
  stillHaveQuestions: {
    icon?: string
    title: string
    description?: string
    primaryButton?: {
      text?: string
      url?: string
    }
    secondaryButton?: {
      text?: string
      phone?: string
    }
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      id: string
      url: string
    }
  }
}

export async function getFAQPage(
  locale: string = 'th'
): Promise<FAQPageData | null> {
  try {
    const data = await fetchFromCMS<FAQPageData>(
      `/globals/faq-page?locale=${locale}&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'faq-page'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching FAQ page:', error)
    return null
  }
}
