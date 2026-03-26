import { getCookieConsent, type CookieConsentData } from '@/lib/cms/getCookieConsent'
import { CookieConsentBanner } from './cookie-consent-banner'

// Fallback content if CMS fetch fails completely
const fallbackContent: CookieConsentData = {
  banner: {
    title: 'เราใช้คุกกี้',
    description:
      'เว็บไซต์นี้ใช้คุกกี้เพื่อมอบประสบการณ์ที่ดีที่สุดแก่คุณ คุณสามารถเลือกยอมรับทั้งหมดหรือปรับแต่งการตั้งค่าได้',
    acceptAllText: 'ยอมรับทั้งหมด',
    rejectAllText: 'ปฏิเสธทั้งหมด',
    customizeText: 'ตั้งค่า',
    privacyLinkText: 'นโยบายความเป็นส่วนตัว',
  },
  preferences: {
    title: 'ตั้งค่าคุกกี้',
    description:
      'คุณสามารถเลือกประเภทคุกกี้ที่ต้องการอนุญาตได้ คุกกี้ที่จำเป็นจะเปิดใช้งานอยู่เสมอเพื่อให้เว็บไซต์ทำงานได้อย่างถูกต้อง',
    saveText: 'บันทึกการตั้งค่า',
    cancelText: 'ยกเลิก',
  },
  categories: {
    essential: {
      title: 'คุกกี้ที่จำเป็น',
      description:
        'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์',
    },
    analytics: {
      title: 'คุกกี้วิเคราะห์',
      description:
        'คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร',
    },
    marketing: {
      title: 'คุกกี้การตลาด',
      description:
        'คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ',
    },
    preferences: {
      title: 'คุกกี้การตั้งค่า',
      description:
        'คุกกี้เหล่านี้ช่วยจดจำการตั้งค่าของคุณ',
    },
  },
}

/**
 * Server component wrapper that fetches CMS content and passes to the client banner.
 * Place this in the root layout to show cookie consent on all pages.
 *
 * Includes error handling to prevent crashes if CMS is unavailable.
 */
export async function CookieConsentWrapper() {
  let content: CookieConsentData

  try {
    content = await getCookieConsent()
  } catch {
    // Use fallback content if CMS fetch fails - don't crash the app
    content = fallbackContent
  }

  return <CookieConsentBanner content={content} />
}
