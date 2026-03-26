import { fetchFromCMS } from './client'

export interface AboutPageData {
  hero: {
    badge?: string
    headline: string
    subheadline: string
    backgroundImage?: {
      id: string
      url: string
      alt?: string
    }
  }
  stats?: Array<{
    value: string
    label: string
    icon?: string
  }>
  mission: {
    headline: string
    content: unknown // Rich text
    bulletPoints?: Array<{ point: string }>
    image?: {
      id: string
      url: string
      alt?: string
    }
  }
  sectionHeaders: {
    values: {
      label?: string
      title: string
      description?: string
    }
    timeline: {
      title: string
      description?: string
    }
    team: {
      title: string
      description?: string
    }
  }
  cta: {
    headline: string
    description: string
    primaryCta: {
      text: string
      url: string
    }
    secondaryCta?: {
      text?: string
      url?: string
    }
  }
  sectionVisibility?: {
    showStats?: boolean
    showMission?: boolean
    showValues?: boolean
    showTimeline?: boolean
    showTeam?: boolean
    showCta?: boolean
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

export async function getAboutPage(
  locale: string = 'th'
): Promise<AboutPageData | null> {
  try {
    const data = await fetchFromCMS<AboutPageData>(
      `/globals/about-page?locale=${locale}&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'about-page'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching about page:', error)
    return null
  }
}
