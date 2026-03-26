/**
 * CMS REST API Client
 * Fetches content from the standalone Payload CMS
 */

// Security: Require CMS_URL in production server environment (skip during build and on client)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build' && !process.env.CMS_URL && process.env.SKIP_CMS_FETCH !== 'true') {
  throw new Error('CMS_URL environment variable is required in production');
}

const CMS_URL = process.env.CMS_URL || 'http://localhost:3001'

// Track whether we've already warned about the CMS being offline (avoid log spam)
let cmsOfflineWarned = false

interface PayloadResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

interface CMSFetchOptions extends RequestInit {
  next?: { revalidate?: number | false; tags?: string[] }
}

async function fetchFromCMS<T>(
  endpoint: string,
  options?: CMSFetchOptions
): Promise<T | null> {
  const url = `${CMS_URL}/api${endpoint}`

  // Skip CMS calls during build if CMS is not available
  if (process.env.SKIP_CMS_FETCH === 'true') {
    console.log(`Skipping CMS fetch during build: ${endpoint}`)
    return null as T
  }

  try {
    // Use Promise.race for timeout instead of AbortController.signal
    // Passing signal to fetch() opts Next.js out of Data Cache, breaking revalidateTag
    const fetchPromise = fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AbortError')), 3000)
    )

    const res = await Promise.race([fetchPromise, timeoutPromise])

    if (!res.ok) {
      console.error(`CMS fetch error: ${res.status} ${res.statusText}`)
      return null as T
    }

    return res.json()
  } catch (error) {
    // Silently fail — return null to use fallback data
    if (error instanceof Error && error.message === 'AbortError') {
      console.warn(`[CMS] Request timeout: ${endpoint}`)
    } else if (
      error instanceof TypeError &&
      (error as TypeError & { cause?: { code?: string } }).cause?.code === 'ECONNREFUSED'
    ) {
      // CMS server is not running — expected in local dev without CMS; warn once
      if (!cmsOfflineWarned) {
        console.warn(`[CMS] Server offline (${CMS_URL}), using fallback data for all pages`)
        cmsOfflineWarned = true
      }
    } else {
      console.warn(`[CMS] Fetch failed: ${endpoint}`, error instanceof Error ? error.message : error)
    }
    return null as T
  }
}

// Export for direct use
export { fetchFromCMS, CMS_URL }
export type { PayloadResponse }
