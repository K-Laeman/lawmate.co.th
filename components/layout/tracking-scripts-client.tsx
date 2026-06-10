'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import type { TrackingSettings } from '@/lib/cms/getTrackingSettings'
import { useConsentStore } from '@/lib/stores/consent-store'
import { sanitizeId } from './tracking-utils'

interface TrackingScriptsProps {
  tracking: TrackingSettings | null
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Google Consent Mode v2 updater. GA4/GTM are loaded by the server component in
 * a DENIED state; this pushes a consent "update" once the visitor's stored
 * choice has hydrated and whenever it changes (accept/reject in the banner).
 */
export function ConsentManager({ hasGoogle }: { hasGoogle: boolean }) {
  const hasHydrated = useConsentStore((s) => s._hasHydrated)
  const analytics = useConsentStore((s) => s.preferences.analytics)
  const marketing = useConsentStore((s) => s.preferences.marketing)

  useEffect(() => {
    if (!hasGoogle || !hasHydrated || typeof window === 'undefined' || !window.gtag) return
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied',
    })
  }, [hasGoogle, hasHydrated, analytics, marketing])

  return null
}

/**
 * Marketing pixels (Facebook / LINE / TikTok) and admin custom scripts. These
 * don't support Consent Mode, so they stay fully gated — loaded only after the
 * relevant consent category is accepted.
 */
export function ConsentGatedHeadScripts({ tracking }: TrackingScriptsProps) {
  const hasHydrated = useConsentStore((s) => s._hasHydrated)
  const analytics = useConsentStore((s) => s.preferences.analytics)
  const marketing = useConsentStore((s) => s.preferences.marketing)

  if (!tracking || !hasHydrated) return null

  const { facebookPixel, lineInsight, tiktokPixel, customHeadScript } = tracking

  const safeFbPixelId = sanitizeId(facebookPixel?.pixelId ?? '', /^\d+$/)
  const safeLineTagId = sanitizeId(lineInsight?.tagId ?? '', /^[a-zA-Z0-9_-]+$/)
  const safeTiktokPixelId = sanitizeId(tiktokPixel?.pixelId ?? '', /^[a-zA-Z0-9_-]+$/)

  const showFacebook = Boolean(marketing && facebookPixel?.enabled && safeFbPixelId)
  const showLine = Boolean(marketing && lineInsight?.enabled && safeLineTagId)
  const showTiktok = Boolean(marketing && tiktokPixel?.enabled && safeTiktokPixelId)
  const showCustomHead = Boolean(analytics && customHeadScript)

  return (
    <>
      {showFacebook && <link rel="preconnect" href="https://connect.facebook.net" />}

      {showFacebook && (
        <Script
          id="facebook-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${safeFbPixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {showLine && (
        <Script
          id="line-insight"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(g,d,o){g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-scdn.net';var s=d.createElement('script');s.async=1;s.src=o||h+'/n/line_tag/public/release/v1/lt.min.js';var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t);})(window,document);_lt('init',{customerType:'lap',tagId:'${safeLineTagId}'});_lt('send','pv',['${safeLineTagId}']);`,
          }}
        />
      )}

      {showTiktok && (
        <Script
          id="tiktok-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${safeTiktokPixelId}');ttq.page();}(window,document,'ttq');`,
          }}
        />
      )}

      {showCustomHead && (
        <Script id="custom-head-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: customHeadScript! }} />
      )}
    </>
  )
}

export function ConsentGatedBodyScripts({ tracking }: TrackingScriptsProps) {
  const hasHydrated = useConsentStore((s) => s._hasHydrated)
  const analytics = useConsentStore((s) => s.preferences.analytics)
  const marketing = useConsentStore((s) => s.preferences.marketing)

  if (!tracking || !hasHydrated) return null

  const { facebookPixel, customBodyScript } = tracking
  const safeFbPixelId = sanitizeId(facebookPixel?.pixelId ?? '', /^\d+$/)
  const showFacebook = Boolean(marketing && facebookPixel?.enabled && safeFbPixelId)
  const showCustomBody = Boolean(analytics && customBodyScript)

  return (
    <>
      {showFacebook && (
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${safeFbPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}

      {showCustomBody && (
        <div dangerouslySetInnerHTML={{ __html: customBodyScript! }} />
      )}
    </>
  )
}
