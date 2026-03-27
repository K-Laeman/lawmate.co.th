import { fetchFromCMS } from './client'

export interface AdministrativeCasePageData {
  hero: {
    badge?: string
    headline: string
    highlightedText?: string
    subheadline: string
    checkpoints?: Array<{ text: string }>
    backgroundImage?: {
      id: string
      url: string
      alt?: string
    }
  }
  sectionHeaders: {
    services: {
      label?: string
      title: string
      description?: string
    }
    whyUs: {
      title: string
      description?: string
    }
    process: {
      title: string
      description?: string
    }
    contact: {
      title: string
      description?: string
    }
  }
  trustPillars?: Array<{
    icon: string
    title: string
    description: string
  }>
  processSteps?: Array<{
    step: number
    icon: string
    title: string
    description: string
  }>
  stats?: Array<{
    value: string
    label: string
  }>
  leadForm: {
    title: string
    subtitle?: string
    successMessage?: string
    fields: {
      companyNameLabel?: string
      contactPersonLabel?: string
      emailLabel?: string
      phoneLabel?: string
      serviceInterestLabel?: string
      messageLabel?: string
      submitButtonText?: string
    }
  }
  cta: {
    headline: string
    description?: string
    primaryButton?: {
      text?: string
      url?: string
    }
    phoneNumber?: string
  }
  services?: Array<{
    id: string
    icon: string
    title: string
    description: string
    sortOrder?: number
    isActive?: boolean
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      id: string
      url: string
    }
  }
}

export async function getAdministrativeCasePage(
  locale: string = 'th'
): Promise<AdministrativeCasePageData | null> {
  try {
    const data = await fetchFromCMS<AdministrativeCasePageData>(
      `/globals/administrative-case-page?locale=${locale}&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'administrative-case-page'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching administrative case page:', error)
    return null
  }
}
