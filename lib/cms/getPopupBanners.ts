import { fetchFromCMS, type PayloadResponse } from './client'

export interface PopupBannerData {
  id: number
  displayMode?: 'standard' | 'image-only'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide'
  title?: string
  description?: string
  image?: { url: string; alt?: string }
  primaryButton?: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  enabled: boolean
  delay: number
  showDontShowAgain: boolean
  dontShowAgainText?: string
  priority: number
  startDate?: string
  endDate?: string
  targetPages: string[]
}

interface RawPopupBanner {
  id: number
  displayMode?: string
  size?: string
  title?: string
  description?: string
  image?: { url: string; alt?: string } | number
  primaryButton?: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  enabled: boolean
  delay: number
  showDontShowAgain: boolean
  dontShowAgainText?: string
  priority: number
  startDate?: string
  endDate?: string
  targetPages: string[]
}

/**
 * Get the active popup banner for a specific page
 * Returns the highest priority banner that:
 * - Is enabled
 * - Has started (startDate is null or <= now)
 * - Has not ended (endDate is null or >= now)
 * - Targets the specified page or 'all'
 */
export async function getActivePopupBanner(
  locale: string = 'th',
  page: string = 'homepage'
): Promise<PopupBannerData | null> {
  try {
    const now = new Date().toISOString()

    // Build query for active banners
    const params = new URLSearchParams({
      locale,
      limit: '1',
      sort: '-priority', // Highest priority first
      'where[enabled][equals]': 'true',
      depth: '1', // Include image relation
    })

    const data = await fetchFromCMS<PayloadResponse<RawPopupBanner>>(
      `/popup-banners?${params.toString()}`,
      { next: { revalidate: 60, tags: ['cms', 'popup-banners'] } } // Cache for 1 minute
    )

    if (!data?.docs?.length) {
      return null
    }

    // Filter by date and page targeting on client side
    // (Payload's date filtering with OR conditions is complex)
    const activeBanner = data.docs.find((banner) => {
      // Check start date
      if (banner.startDate && new Date(banner.startDate) > new Date(now)) {
        return false
      }

      // Check end date
      if (banner.endDate && new Date(banner.endDate) < new Date(now)) {
        return false
      }

      // Check page targeting
      const targets = banner.targetPages || ['all']
      if (!targets.includes('all') && !targets.includes(page)) {
        return false
      }

      return true
    })

    if (!activeBanner) {
      return null
    }

    // Transform to frontend format
    return {
      id: activeBanner.id,
      displayMode: (activeBanner.displayMode as 'standard' | 'image-only') ?? 'standard',
      size: (activeBanner.size as 'sm' | 'md' | 'lg' | 'xl' | 'wide') ?? 'md',
      title: activeBanner.title,
      description: activeBanner.description,
      image: typeof activeBanner.image === 'object' ? activeBanner.image : undefined,
      primaryButton: activeBanner.primaryButton,
      secondaryButton: (activeBanner.secondaryButton?.text && activeBanner.secondaryButton?.url) ? activeBanner.secondaryButton : undefined,
      enabled: activeBanner.enabled,
      delay: activeBanner.delay ?? 2000,
      showDontShowAgain: activeBanner.showDontShowAgain ?? true,
      dontShowAgainText: activeBanner.dontShowAgainText,
      priority: activeBanner.priority ?? 50,
      startDate: activeBanner.startDate,
      endDate: activeBanner.endDate,
      targetPages: activeBanner.targetPages ?? ['all'],
    }
  } catch (error) {
    console.error('Error fetching popup banner:', error)
    return null
  }
}

/**
 * Get all popup banners (for admin/preview purposes)
 */
export async function getAllPopupBanners(
  locale: string = 'th'
): Promise<PopupBannerData[]> {
  try {
    const data = await fetchFromCMS<PayloadResponse<RawPopupBanner>>(
      `/popup-banners?locale=${locale}&sort=-priority&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'popup-banners'] } }
    )

    if (!data?.docs?.length) {
      return []
    }

    return data.docs.map((banner) => ({
      id: banner.id,
      displayMode: (banner.displayMode as 'standard' | 'image-only') ?? 'standard',
      size: (banner.size as 'sm' | 'md' | 'lg' | 'xl' | 'wide') ?? 'md',
      title: banner.title,
      description: banner.description,
      image: typeof banner.image === 'object' ? banner.image : undefined,
      primaryButton: banner.primaryButton,
      secondaryButton: (banner.secondaryButton?.text && banner.secondaryButton?.url) ? banner.secondaryButton : undefined,
      enabled: banner.enabled,
      delay: banner.delay ?? 2000,
      showDontShowAgain: banner.showDontShowAgain ?? true,
      dontShowAgainText: banner.dontShowAgainText,
      priority: banner.priority ?? 50,
      startDate: banner.startDate,
      endDate: banner.endDate,
      targetPages: banner.targetPages ?? ['all'],
    }))
  } catch (error) {
    console.error('Error fetching popup banners:', error)
    return []
  }
}
