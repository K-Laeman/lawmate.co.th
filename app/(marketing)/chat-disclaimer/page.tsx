import type { Metadata } from 'next'
import { getLegalPageBySlug } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'
import { ChatDisclaimerFallbackContent } from '@/components/legal/chat-disclaimer-fallback'

const FALLBACK_PAGE = {
  title: 'คำแจ้งเตือนก่อนเริ่มการสนทนา',
  lastUpdated: '28 กุมภาพันธ์ 2569',
}

export async function generateMetadata(): Promise<Metadata> {
  const legalPage = await getLegalPageBySlug('chat-disclaimer', 'th')

  return {
    title: legalPage?.seo?.metaTitle || 'คำแจ้งเตือนก่อนเริ่มการสนทนา | เพื่อนทนาย',
    description:
      legalPage?.seo?.metaDescription ||
      'คำแจ้งเตือนและข้อจำกัดความรับผิดชอบก่อนเริ่มการสนทนากับทนายความบนแพลตฟอร์มเพื่อนทนาย',
  }
}

export default async function ChatDisclaimerPage() {
  const legalPage = await getLegalPageBySlug('chat-disclaimer', 'th')

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
      icon="MessageCircle"
      alertBox={legalPage?.alertBox || { enabled: false, content: '' }}
      sections={legalPage?.sections || []}
      fallbackContent={<ChatDisclaimerFallbackContent />}
      alertVariant="blue"
    />
  )
}
