import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ยืนยันการจอง | เพื่อนทนาย by LawMate',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
