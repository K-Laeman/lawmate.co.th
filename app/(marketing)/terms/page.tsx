import type { Metadata } from 'next'
import { getLegalPageBySlug } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'
import { TermsFallbackContent } from '@/components/legal/terms-fallback'

// Fallback data
const FALLBACK_PAGE = {
  title: 'ข้อกำหนดการใช้บริการ',
  heroSubtitle: 'กรุณาอ่านข้อกำหนดการใช้บริการอย่างละเอียดก่อนใช้งาน',
  lastUpdated: '1 มกราคม 2025',
  alertBox: {
    enabled: true,
    content:
      'กรุณาอ่านข้อกำหนดการใช้บริการอย่างละเอียด โดยการเข้าถึงหรือใช้บริการของเรา คุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const legalPage = await getLegalPageBySlug('terms', 'th')

  return {
    title: legalPage?.seo?.metaTitle || 'ข้อกำหนดการใช้บริการ | เพื่อนทนาย',
    description:
      legalPage?.seo?.metaDescription ||
      'ข้อกำหนดและเงื่อนไขการใช้บริการเพื่อนทนาย แพลตฟอร์มปรึกษาทนายความออนไลน์',
  }
}

export default async function TermsPage() {
  const legalPage = await getLegalPageBySlug('terms', 'th')

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
      icon="FileText"
      alertBox={legalPage?.alertBox || FALLBACK_PAGE.alertBox}
      sections={legalPage?.sections || []}
      fallbackContent={<TermsFallbackContent />}
      alertVariant="blue"
    />
  )
}
