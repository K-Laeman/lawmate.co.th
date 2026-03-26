import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLegalPageBySlug, getLegalPages } from '@/lib/cms'
import { LegalPageContent } from '@/components/legal/legal-page-content'

// Slugs handled by dedicated pages — skip them in the dynamic route
const DEDICATED_SLUGS = [
  'terms',
  'privacy',
  'cancellation-policy',
  'chat-disclaimer',
  'data-retention-policy',
  'review-policy',
]

export async function generateStaticParams() {
  const pages = await getLegalPages('th')
  return pages
    .filter((p) => !DEDICATED_SLUGS.includes(p.slug))
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const page = await getLegalPageBySlug(slug, 'th')
  return {
    title: page?.seo?.metaTitle || `${page?.title || 'นโยบาย'} | เพื่อนทนาย`,
    description: page?.seo?.metaDescription || '',
  }
}

export default async function DynamicLegalPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (DEDICATED_SLUGS.includes(slug)) {
    notFound()
  }

  const page = await getLegalPageBySlug(slug, 'th')

  if (!page) notFound()

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <LegalPageContent
      title={page.title}
      subtitle={page.heroSubtitle}
      lastUpdated={formatDate(page.lastUpdated)}
      icon="FileText"
      alertBox={page.alertBox}
      sections={page.sections}
      alertVariant="blue"
    />
  )
}
