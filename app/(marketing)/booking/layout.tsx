import type { Metadata } from 'next'
import { PAGE_DESCRIPTIONS, PAGE_TITLES } from '@/lib/seo/constants'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: PAGE_TITLES.booking,
  description: PAGE_DESCRIPTIONS.booking,
  path: '/booking',
})

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
