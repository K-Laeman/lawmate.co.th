import type { Metadata } from 'next'
import { getLegalPageBySlug } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'
import { PrivacyFallbackContent } from '@/components/legal/privacy-fallback'

// Fallback data
const FALLBACK_PAGE = {
  title: 'นโยบายความเป็นส่วนตัว',
  heroSubtitle: 'เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ',
  lastUpdated: '1 มกราคม 2025',
  alertBox: {
    enabled: true,
    content:
      'เพื่อนทนายให้ความสำคัญกับความเป็นส่วนตัวของคุณ นโยบายนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลของคุณอย่างโปร่งใสและปลอดภัย',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const legalPage = await getLegalPageBySlug('privacy', 'th')

  return {
    title: legalPage?.seo?.metaTitle || 'นโยบายความเป็นส่วนตัว | เพื่อนทนาย',
    description:
      legalPage?.seo?.metaDescription ||
      'นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคลของเพื่อนทนาย ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
  }
}

export default async function PrivacyPage() {
  const legalPage = await getLegalPageBySlug('privacy', 'th')

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return FALLBACK_PAGE.lastUpdated
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return FALLBACK_PAGE.lastUpdated
    }
  }

  return (
    <LegalPageContent
      title={legalPage?.title || FALLBACK_PAGE.title}
      subtitle={legalPage?.heroSubtitle}
      lastUpdated={formatDate(legalPage?.lastUpdated)}
      icon="Shield"
      alertBox={legalPage?.alertBox || FALLBACK_PAGE.alertBox}
      sections={legalPage?.sections || []}
      fallbackContent={<PrivacyFallbackContent />}
      alertVariant="green"
    />
  )
}
