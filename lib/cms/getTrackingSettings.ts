import { fetchFromCMS } from './client'

export interface TrackingSettings {
  gtm?: {
    enabled?: boolean
    containerId?: string
  }
  ga4?: {
    enabled?: boolean
    measurementId?: string
  }
  searchConsole?: {
    verificationCode?: string
  }
  facebookPixel?: {
    enabled?: boolean
    pixelId?: string
  }
  lineInsight?: {
    enabled?: boolean
    tagId?: string
  }
  tiktokPixel?: {
    enabled?: boolean
    pixelId?: string
  }
  customHeadScript?: string
  customBodyScript?: string
}

export async function getTrackingSettings(): Promise<TrackingSettings | null> {
  try {
    const data = await fetchFromCMS<TrackingSettings>(
      '/globals/tracking-settings',
      { next: { revalidate: 3600, tags: ['cms', 'tracking-settings'] } }
    )
    return data
  } catch {
    return null
  }
}
