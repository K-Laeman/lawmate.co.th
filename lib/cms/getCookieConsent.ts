import { fetchFromCMS } from './client'

export interface CookieCategoryContent {
  title: string
  description: string
}

export interface CookieConsentData {
  banner: {
    title: string
    description: string
    acceptAllText: string
    rejectAllText: string
    customizeText: string
    privacyLinkText: string
  }
  preferences: {
    title: string
    description: string
    saveText: string
    cancelText: string
  }
  categories: {
    essential: CookieCategoryContent
    analytics: CookieCategoryContent
    marketing: CookieCategoryContent
    preferences: CookieCategoryContent
  }
}

// Default fallback content in Thai
const defaultCookieConsent: CookieConsentData = {
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
        'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์ เช่น การเข้าสู่ระบบ การจดจำรถเข็นสินค้า และความปลอดภัย คุณไม่สามารถปิดคุกกี้เหล่านี้ได้',
    },
    analytics: {
      title: 'คุกกี้วิเคราะห์',
      description:
        'คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร ข้อมูลจะถูกรวบรวมแบบไม่ระบุตัวตนเพื่อปรับปรุงประสบการณ์การใช้งาน',
    },
    marketing: {
      title: 'คุกกี้การตลาด',
      description:
        'คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้องกับความสนใจของคุณ และวัดประสิทธิภาพของแคมเปญโฆษณา',
    },
    preferences: {
      title: 'คุกกี้การตั้งค่า',
      description:
        'คุกกี้เหล่านี้ช่วยจดจำการตั้งค่าของคุณ เช่น ภาษา ขนาดตัวอักษร หรือธีมสี เพื่อมอบประสบการณ์ที่เหมาะกับคุณ',
    },
  },
}

export async function getCookieConsent(): Promise<CookieConsentData> {
  try {
  const data = await fetchFromCMS<CookieConsentData>('/globals/cookie-consent', {
    next: { revalidate: 60, tags: ['cms', 'cookie-consent'] },
  })

  if (!data) {
    return defaultCookieConsent
  }

  // Merge with defaults to ensure all fields exist
  return {
    banner: {
      title: data.banner?.title || defaultCookieConsent.banner.title,
      description: data.banner?.description || defaultCookieConsent.banner.description,
      acceptAllText: data.banner?.acceptAllText || defaultCookieConsent.banner.acceptAllText,
      rejectAllText: data.banner?.rejectAllText || defaultCookieConsent.banner.rejectAllText,
      customizeText: data.banner?.customizeText || defaultCookieConsent.banner.customizeText,
      privacyLinkText: data.banner?.privacyLinkText || defaultCookieConsent.banner.privacyLinkText,
    },
    preferences: {
      title: data.preferences?.title || defaultCookieConsent.preferences.title,
      description: data.preferences?.description || defaultCookieConsent.preferences.description,
      saveText: data.preferences?.saveText || defaultCookieConsent.preferences.saveText,
      cancelText: data.preferences?.cancelText || defaultCookieConsent.preferences.cancelText,
    },
    categories: {
      essential: {
        title: data.categories?.essential?.title || defaultCookieConsent.categories.essential.title,
        description:
          data.categories?.essential?.description || defaultCookieConsent.categories.essential.description,
      },
      analytics: {
        title: data.categories?.analytics?.title || defaultCookieConsent.categories.analytics.title,
        description:
          data.categories?.analytics?.description || defaultCookieConsent.categories.analytics.description,
      },
      marketing: {
        title: data.categories?.marketing?.title || defaultCookieConsent.categories.marketing.title,
        description:
          data.categories?.marketing?.description || defaultCookieConsent.categories.marketing.description,
      },
      preferences: {
        title: data.categories?.preferences?.title || defaultCookieConsent.categories.preferences.title,
        description:
          data.categories?.preferences?.description || defaultCookieConsent.categories.preferences.description,
      },
    },
  }
  } catch (error) {
    console.error('Error fetching cookie consent:', error)
    return defaultCookieConsent
  }
}
