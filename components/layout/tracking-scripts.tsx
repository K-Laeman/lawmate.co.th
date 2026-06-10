import type { TrackingSettings } from '@/lib/cms/getTrackingSettings'
import { sanitizeId } from './tracking-utils'
import { ConsentGatedHeadScripts, ConsentGatedBodyScripts } from './tracking-scripts-client'

interface TrackingScriptsProps {
  tracking: TrackingSettings | null
}

/**
 * Head tracking output. The Google Search Console verification meta is NOT a
 * cookie and must be server-rendered for crawlers, so it stays here. All
 * cookie-setting scripts are delegated to a consent-gated client component.
 */
export function TrackingHeadScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null

  const safeVerificationCode = sanitizeId(tracking.searchConsole?.verificationCode ?? '', /^[a-zA-Z0-9_-]+$/)

  return (
    <>
      {safeVerificationCode && (
        <meta name="google-site-verification" content={safeVerificationCode} />
      )}
      <ConsentGatedHeadScripts tracking={tracking} />
    </>
  )
}

export function TrackingBodyScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null
  return <ConsentGatedBodyScripts tracking={tracking} />
}
