import { fetchFromCMS } from './client'

export interface ContactPageData {
  hero: {
    badge?: string
    headline: string
    subheadline: string
  }
  contactInfo?: Array<{
    icon: string
    title: string
    content: string
  }>
  form: {
    title: string
    labels: {
      name?: string
      email?: string
      phone?: string
      inquiryType?: string
      subject?: string
      message?: string
    }
    placeholders: {
      name?: string
      email?: string
      phone?: string
      inquiryType?: string
      subject?: string
      message?: string
    }
    submitButtonText?: string
    successTitle?: string
    successMessage?: string
    resetButtonText?: string
  }
  sectionHeaders: {
    contactInfoTitle?: string
    contactInfoDescription?: string
    quickLinksTitle?: string
    mapComingSoonText?: string
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

export async function getContactPage(
  locale: string = 'th'
): Promise<ContactPageData | null> {
  try {
    const data = await fetchFromCMS<ContactPageData>(
      `/globals/contact-page?locale=${locale}&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'contact-page'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching contact page:', error)
    return null
  }
}
