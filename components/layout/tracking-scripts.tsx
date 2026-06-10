import Script from 'next/script'
import type { TrackingSettings } from '@/lib/cms/getTrackingSettings'
import { sanitizeId } from './tracking-utils'
import { ConsentManager, ConsentGatedHeadScripts, ConsentGatedBodyScripts } from './tracking-scripts-client'

interface TrackingScriptsProps {
  tracking: TrackingSettings | null
}

/**
 * Head tracking output using Google Consent Mode v2.
 *
 * GA4/GTM load on EVERY page (so Google Tag Assistant / GA install-check detect
 * the tag) but start in a DENIED consent state, so no analytics/ad cookies are
 * set and no personal data is collected until the visitor accepts. ConsentManager
 * (client) flips consent to "granted" when the cookie banner is accepted.
 *
 * Marketing pixels (Facebook/LINE/TikTok) don't support Consent Mode, so they
 * remain fully gated — loaded only after marketing consent.
 */
export function TrackingHeadScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null

  const { gtm, ga4, searchConsole } = tracking
  const safeVerificationCode = sanitizeId(searchConsole?.verificationCode ?? '', /^[a-zA-Z0-9_-]+$/)
  const safeGtmId = sanitizeId(gtm?.containerId ?? '', /^GTM-[A-Z0-9]+$/)
  const safeGa4Id = sanitizeId(ga4?.measurementId ?? '', /^G-[A-Z0-9]+$/)
  const showGtm = Boolean(gtm?.enabled && safeGtmId)
  const showGa4 = Boolean(ga4?.enabled && safeGa4Id)
  const hasGoogle = showGtm || showGa4

  return (
    <>
      {/* Search Console verification — not a cookie; must be server-rendered */}
      {safeVerificationCode && (
        <meta name="google-site-verification" content={safeVerificationCode} />
      )}

      {hasGoogle && <link rel="preconnect" href="https://www.googletagmanager.com" />}
      {showGa4 && <link rel="preconnect" href="https://www.google-analytics.com" />}

      {/* Consent Mode v2 default — DENIED before any tag loads. Defines the
          global gtag() used by GA4/GTM below and by ConsentManager updates. */}
      {hasGoogle && (
        <Script
          id="consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
              `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`,
          }}
        />
      )}

      {showGtm && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${safeGtmId}');`,
          }}
        />
      )}

      {showGa4 && (
        <>
          <Script id="ga4-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${safeGa4Id}`} />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `gtag('js',new Date());gtag('config','${safeGa4Id}');`,
            }}
          />
        </>
      )}

      {/* Client: push consent updates to gtag + load consent-gated marketing pixels */}
      <ConsentManager hasGoogle={hasGoogle} />
      <ConsentGatedHeadScripts tracking={tracking} />
    </>
  )
}

export function TrackingBodyScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null

  const safeGtmId = sanitizeId(tracking.gtm?.containerId ?? '', /^GTM-[A-Z0-9]+$/)
  const showGtm = Boolean(tracking.gtm?.enabled && safeGtmId)

  return (
    <>
      {showGtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${safeGtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
      <ConsentGatedBodyScripts tracking={tracking} />
    </>
  )
}
