import Script from 'next/script'
import type { TrackingSettings } from '@/lib/cms/getTrackingSettings'

interface TrackingScriptsProps {
  tracking: TrackingSettings | null
}

/** Validate a tracking ID against its expected format before interpolating into scripts. */
function sanitizeId(id: string, pattern: RegExp): string {
  return pattern.test(id) ? id : ''
}

export function TrackingHeadScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null

  const { gtm, ga4, searchConsole, facebookPixel, lineInsight, tiktokPixel, customHeadScript } = tracking

  const safeGtmId = sanitizeId(gtm?.containerId ?? '', /^GTM-[A-Z0-9]+$/)
  const safeGa4Id = sanitizeId(ga4?.measurementId ?? '', /^G-[A-Z0-9]+$/)
  const safeVerificationCode = sanitizeId(searchConsole?.verificationCode ?? '', /^[a-zA-Z0-9_-]+$/)
  const safeFbPixelId = sanitizeId(facebookPixel?.pixelId ?? '', /^\d+$/)
  const safeLineTagId = sanitizeId(lineInsight?.tagId ?? '', /^[a-zA-Z0-9_-]+$/)
  const safeTiktokPixelId = sanitizeId(tiktokPixel?.pixelId ?? '', /^[a-zA-Z0-9_-]+$/)

  const hasGoogle = (gtm?.enabled && safeGtmId) || (ga4?.enabled && safeGa4Id)
  const hasFacebook = facebookPixel?.enabled && safeFbPixelId

  return (
    <>
      {safeVerificationCode && (
        <meta name="google-site-verification" content={safeVerificationCode} />
      )}

      {/* Preconnect hints — reduces DNS/TLS handshake time before scripts fire */}
      {hasGoogle && <link rel="preconnect" href="https://www.googletagmanager.com" />}
      {ga4?.enabled && safeGa4Id && <link rel="preconnect" href="https://www.google-analytics.com" />}
      {hasFacebook && <link rel="preconnect" href="https://connect.facebook.net" />}

      {gtm?.enabled && safeGtmId && (
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${safeGtmId}');`,
          }}
        />
      )}

      {ga4?.enabled && safeGa4Id && (
        <>
          <Script id="ga4-src" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${safeGa4Id}`} />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${safeGa4Id}');`,
            }}
          />
        </>
      )}

      {facebookPixel?.enabled && safeFbPixelId && (
        <Script
          id="facebook-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${safeFbPixelId}');fbq('track','PageView');`,
          }}
        />
      )}

      {lineInsight?.enabled && safeLineTagId && (
        <Script
          id="line-insight"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(g,d,o){g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};var h=location.protocol==='https:'?'https://d.line-scdn.net':'http://d.line-scdn.net';var s=d.createElement('script');s.async=1;s.src=o||h+'/n/line_tag/public/release/v1/lt.min.js';var t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s,t);})(window,document);_lt('init',{customerType:'lap',tagId:'${safeLineTagId}'});_lt('send','pv',['${safeLineTagId}']);`,
          }}
        />
      )}

      {tiktokPixel?.enabled && safeTiktokPixelId && (
        <Script
          id="tiktok-pixel"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${safeTiktokPixelId}');ttq.page();}(window,document,'ttq');`,
          }}
        />
      )}

      {customHeadScript && (
        <Script id="custom-head-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: customHeadScript }} />
      )}
    </>
  )
}

export function TrackingBodyScripts({ tracking }: TrackingScriptsProps) {
  if (!tracking) return null

  const { gtm, facebookPixel, customBodyScript } = tracking

  const safeGtmId = sanitizeId(gtm?.containerId ?? '', /^GTM-[A-Z0-9]+$/)
  const safeFbPixelId = sanitizeId(facebookPixel?.pixelId ?? '', /^\d+$/)

  return (
    <>
      {gtm?.enabled && safeGtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${safeGtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      {facebookPixel?.enabled && safeFbPixelId && (
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

      {customBodyScript && (
        <div dangerouslySetInnerHTML={{ __html: customBodyScript }} />
      )}
    </>
  )
}
