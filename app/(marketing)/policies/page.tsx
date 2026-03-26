import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, FileX, Database, MessageCircle, Star, ChevronRight, Scale } from 'lucide-react'
import { getLegalPages } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'นโยบายและข้อกำหนด | เพื่อนทนาย',
  description: 'นโยบายความเป็นส่วนตัว ข้อกำหนดการใช้งาน และนโยบายต่างๆ ของเพื่อนทนาย แพลตฟอร์มปรึกษาทนายความออนไลน์',
}

const DEDICATED_SLUGS = [
  'terms',
  'privacy',
  'cancellation-policy',
  'chat-disclaimer',
  'data-retention-policy',
  'review-policy',
]

const policies = [
  {
    icon: FileText,
    title: 'ข้อกำหนดการใช้บริการ',
    description: 'เงื่อนไขและข้อกำหนดในการใช้บริการแพลตฟอร์มเพื่อนทนาย รวมถึงสิทธิ์และหน้าที่ของผู้ใช้งาน',
    href: '/terms',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    badge: 'ข้อกำหนดหลัก',
  },
  {
    icon: Shield,
    title: 'นโยบายความเป็นส่วนตัว',
    description: 'วิธีการเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณตามมาตรฐาน PDPA',
    href: '/privacy',
    color: 'bg-green-50 text-green-600 border-green-100',
    badge: 'PDPA',
  },
  {
    icon: FileX,
    title: 'นโยบายการยกเลิกและการคืนเงิน',
    description: 'เงื่อนไขการยกเลิกการนัดหมาย และขั้นตอนการคืนเงินในกรณีต่างๆ',
    href: '/cancellation-policy',
    color: 'bg-red-50 text-red-600 border-red-100',
    badge: 'การเงิน',
  },
  {
    icon: Database,
    title: 'นโยบายระยะเวลาการจัดเก็บข้อมูล',
    description: 'ระยะเวลาที่เราจัดเก็บข้อมูลประเภทต่างๆ และสิทธิ์ของคุณในการขอลบข้อมูล',
    href: '/data-retention-policy',
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    badge: 'PDPA',
  },
  {
    icon: MessageCircle,
    title: 'คำแจ้งเตือนก่อนเริ่มการสนทนา',
    description: 'ข้อมูลสำคัญที่ควรทราบก่อนเริ่มการสนทนากับทนายความ และขอบเขตของคำปรึกษา',
    href: '/chat-disclaimer',
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    badge: 'คำเตือน',
  },
  {
    icon: Star,
    title: 'นโยบายการรีวิวและการให้คะแนน',
    description: 'หลักเกณฑ์การรีวิวทนายความ วิธีการตรวจสอบรีวิว และสิทธิ์ของทนายในการตอบรีวิว',
    href: '/review-policy',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    badge: 'รีวิว',
  },
]

export default async function PoliciesPage() {
  const allPages = await getLegalPages('th')
  const dynamicPages = allPages.filter((p) => !DEDICATED_SLUGS.includes(p.slug))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-navy-dark text-white pt-24 pb-16 md:pt-40">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white/60 text-sm">เพื่อนทนาย</p>
              <h1 className="text-3xl font-bold text-white">นโยบายและข้อกำหนด</h1>
            </div>
          </div>
          <p className="text-white/70 max-w-2xl leading-relaxed">
            เราให้ความสำคัญกับความโปร่งใสและความเชื่อมั่นของผู้ใช้งาน
            อ่านนโยบายต่างๆ เพื่อทำความเข้าใจสิทธิ์และการคุ้มครองของคุณ
          </p>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => {
            const Icon = policy.icon
            return (
              <Link
                key={policy.href}
                href={policy.href}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${policy.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${policy.color}`}>
                    {policy.badge}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {policy.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {policy.description}
                </p>

                <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                  <span>อ่านเพิ่มเติม</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Dynamic pages from CMS */}
        {dynamicPages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">นโยบายเพิ่มเติม</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dynamicPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/legal/${page.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl border flex items-center justify-center bg-blue-50 text-blue-600 border-blue-100">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {page.title}
                  </h2>
                  {page.heroSubtitle && (
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{page.heroSubtitle}</p>
                  )}
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-primary">
                    <span>อ่านเพิ่มเติม</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            หากมีคำถามเกี่ยวกับนโยบายของเรา กรุณาติดต่อที่{' '}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              ติดต่อเรา
            </Link>
            {' '}หรือส่งอีเมลมาที่{' '}
            <a href="mailto:legal@lawmate.co.th" className="text-primary font-medium hover:underline">
              legal@lawmate.co.th
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
