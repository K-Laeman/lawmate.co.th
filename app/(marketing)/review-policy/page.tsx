import type { Metadata } from 'next'
import { getLegalPageBySlug } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'
import { ReviewPolicyFallbackContent } from '@/components/legal/review-policy-fallback'

const FALLBACK_PAGE = {
  title: 'นโยบายการรีวิวและการให้คะแนน',
  lastUpdated: '28 กุมภาพันธ์ 2569',
}

export async function generateMetadata(): Promise<Metadata> {
  const legalPage = await getLegalPageBySlug('review-policy', 'th')

  return {
    title: legalPage?.seo?.metaTitle || 'นโยบายการรีวิวและการให้คะแนน | เพื่อนทนาย',
    description:
      legalPage?.seo?.metaDescription ||
      'นโยบายการเขียนรีวิวและการให้คะแนนทนายความบนแพลตฟอร์มเพื่อนทนาย',
  }
}

export default async function ReviewPolicyPage() {
  const legalPage = await getLegalPageBySlug('review-policy', 'th')

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
      icon="Star"
      alertBox={legalPage?.alertBox || { enabled: false, content: '' }}
      sections={legalPage?.sections || []}
      fallbackContent={<ReviewPolicyFallbackContent />}
      alertVariant="blue"
    />
  )
}
