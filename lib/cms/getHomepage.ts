import { fetchFromCMS } from './client'

export interface HomepageData {
  sectionVisibility?: {
    showHero?: boolean
    showStats?: boolean
    showHowItWorks?: boolean
    showServices?: boolean
    showCaseTypes?: boolean
    showTrust?: boolean
    showTestimonials?: boolean
    showFaq?: boolean
    showBlog?: boolean
    showCta?: boolean
  }
  hero: {
    badge?: string
    headline?: string
    headlineHighlight?: string
    subheadline?: string
    caseStatusHeading?: string
    caseStatusCards?: Array<{
      cardType: string
      title: string
      description: string
      svgImage?: { url: string; alt?: string }
    }>
    primaryCta?: { text: string; url: string }
    secondaryCta?: { text: string; url: string }
    backgroundImage?: { url: string; alt: string }
  }
  stats: {
    totalLawyers?: number
    lawyersLabel?: string
    totalCases?: number
    casesLabel?: string
    averageRating?: string
    ratingLabel?: string
    totalProvinces?: number
    provincesLabel?: string
  }
  sectionHeaders: {
    howItWorks?: { label?: string; title?: string; description?: string }
    services?: { label?: string; title?: string; description?: string; footnote?: string }
    caseTypes?: { label?: string; title?: string; description?: string }
    trust?: { label?: string; title?: string; description?: string; footnote?: string }
    testimonials?: { label?: string; title?: string; description?: string }
    faq?: { label?: string; title?: string; description?: string; contactNote?: string }
    blog?: { label?: string; title?: string; description?: string; viewAllText?: string; viewAllUrl?: string }
  }
  cta: {
    headline?: string
    description?: string
    primaryCta?: { text: string; url: string }
    phoneNumber?: string
    showPhoneButton?: boolean
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { url: string }
  }
  popupBanner?: {
    enabled?: boolean
    title?: string
    description?: string
    image?: { url: string; alt?: string }
    primaryButton?: { text: string; url: string }
    secondaryButton?: { text: string; url: string }
    showDontShowAgain?: boolean
    dontShowAgainText?: string
    delay?: number
  }
}

export async function getHomepage(locale: string = 'th'): Promise<HomepageData | null> {
  try {
    const data = await fetchFromCMS<HomepageData>(
      `/globals/homepage?locale=${locale}`,
      { next: { revalidate: 60, tags: ['cms', 'homepage'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching homepage:', error)
    return null
  }
}
