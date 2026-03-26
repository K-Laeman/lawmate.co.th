import { fetchFromCMS } from './client'

export interface SocialLink {
  platform: 'facebook' | 'line' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'tiktok'
  url: string
}

export interface SiteSettings {
  siteName: string
  siteTagline?: string
  logo?: { url: string; alt: string }
  favicon?: { url: string }
  phone?: string
  email?: string
  lineId?: string
  lineUrl?: string
  address?: string
  showFloatingButton?: boolean
  socialLinks?: SocialLink[]
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  defaultOgImage?: { url: string }
}

export async function getSiteSettings(locale: string = 'th'): Promise<SiteSettings | null> {
  try {
    const data = await fetchFromCMS<SiteSettings>(
      `/globals/site-settings?locale=${locale}`,
      { next: { revalidate: 60, tags: ['cms', 'site-settings'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}
