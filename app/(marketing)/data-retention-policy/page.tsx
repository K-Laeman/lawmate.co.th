import type { Metadata } from 'next'
import { getLegalPageBySlug } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'
import { DataRetentionPolicyFallbackContent } from '@/components/legal/data-retention-policy-fallback'

const FALLBACK_PAGE = {
  title: 'นโยบายระยะเวลาการจัดเก็บข้อมูลส่วนบุคคล',
  lastUpdated: '28 กุมภาพันธ์ 2569',
}

export async function generateMetadata(): Promise<Metadata> {
  const legalPage = await getLegalPageBySlug('data-retention-policy', 'th')

  return {
    title: legalPage?.seo?.metaTitle || 'นโยบายระยะเวลาการจัดเก็บข้อมูลส่วนบุคคล | เพื่อนทนาย',
    description:
      legalPage?.seo?.metaDescription ||
      'นโยบายระยะเวลาการจัดเก็บข้อมูลส่วนบุคคลของแพลตฟอร์มเพื่อนทนาย ตาม PDPA',
  }
}

export default async function DataRetentionPolicyPage() {
  const legalPage = await getLegalPageBySlug('data-retention-policy', 'th')

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
      icon="Database"
      alertBox={legalPage?.alertBox || { enabled: false, content: '' }}
      sections={legalPage?.sections || []}
      fallbackContent={<DataRetentionPolicyFallbackContent />}
      alertVariant="blue"
    />
  )
}
