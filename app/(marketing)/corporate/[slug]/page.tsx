import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCorporatePageBySlug, getAllCorporatePageSlugs, getCorporateServices } from '@/lib/cms'
import { CorporatePageClient } from '@/components/corporate/corporate-page-client'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

// Pre-render all published corporate pages at build time
export async function generateStaticParams() {
  const slugs = await getAllCorporatePageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getCorporatePageBySlug(slug, 'th')

  if (!page) return {}

  return generatePageMetadata({
    title: page.seo?.metaTitle || 'บริการสำหรับองค์กร | เพื่อนทนาย',
    description:
      page.seo?.metaDescription ||
      'บริการที่ปรึกษาด้านกฎหมายครบวงจรสำหรับธุรกิจและองค์กร โดยทีมทนายความผู้เชี่ยวชาญ',
    path: `/corporate/${slug}`,
    ogImage: page.seo?.ogImage?.url,
  })
}

// Fallback data (same as /corporate page)
const FALLBACK_HERO = {
  badge: 'บริการสำหรับองค์กร',
  headline: 'ที่ปรึกษากฎหมาย',
  highlightedText: 'สำหรับธุรกิจและองค์กร',
  subheadline:
    'บริการที่ปรึกษาด้านกฎหมายครบวงจร ดูแลธุรกิจของคุณตั้งแต่เริ่มต้นจนเติบโต โดยทีมทนายความผู้เชี่ยวชาญด้านกฎหมายธุรกิจ',
  checkpoints: [
    { text: 'ปรึกษาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย' },
    { text: 'ทีมทนายผู้เชี่ยวชาญประสบการณ์กว่า 15 ปี' },
    { text: 'ดูแลลูกค้าองค์กรมากกว่า 500 บริษัท' },
  ],
}

const FALLBACK_SECTION_HEADERS = {
  services: { label: 'Our Services', title: 'บริการของเรา', description: 'ครอบคลุมทุกด้านกฎหมายที่ธุรกิจของคุณต้องการ' },
  whyUs: { title: 'ทำไมต้องเลือกเรา', description: 'เราพร้อมเป็นพันธมิตรทางกฎหมายที่คุณไว้วางใจได้' },
  process: { title: 'ขั้นตอนการทำงาน', description: 'กระบวนการทำงานที่ชัดเจน โปร่งใส และมีประสิทธิภาพ' },
  contact: { title: 'ขอรับคำปรึกษาฟรี', description: 'กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับโดยเร็วที่สุด' },
}

const FALLBACK_TRUST_PILLARS = [
  { icon: 'Scale', title: 'ทีมทนายผู้เชี่ยวชาญ', description: 'ทนายความที่มีประสบการณ์ด้านกฎหมายธุรกิจมากกว่า 10 ปี' },
  { icon: 'Briefcase', title: 'บริการครบวงจร', description: 'ครอบคลุมทุกความต้องการทางกฎหมายของธุรกิจในที่เดียว' },
  { icon: 'CheckCircle', title: 'ราคาที่เหมาะสม', description: 'แพ็กเกจราคาที่ปรับให้เหมาะกับขนาดและความต้องการของธุรกิจ' },
]

const FALLBACK_PROCESS_STEPS = [
  { step: 1, icon: 'Phone', title: 'ติดต่อปรึกษา', description: 'ติดต่อทีมของเราเพื่อนัดหมายปรึกษาเบื้องต้นฟรี' },
  { step: 2, icon: 'Target', title: 'วิเคราะห์ความต้องการ', description: 'ทีมทนายวิเคราะห์ปัญหาและเสนอแนวทางแก้ไขที่เหมาะสม' },
  { step: 3, icon: 'Handshake', title: 'ดำเนินการ', description: 'ดำเนินการตามแผนที่วางไว้พร้อมรายงานความคืบหน้าอย่างสม่ำเสมอ' },
]

const FALLBACK_STATS = [
  { value: '500+', label: 'องค์กรที่ไว้วางใจ' },
  { value: '15+', label: 'ปีประสบการณ์' },
  { value: '98%', label: 'ความพึงพอใจ' },
  { value: '24/7', label: 'พร้อมให้บริการ' },
]

const FALLBACK_LEAD_FORM = {
  title: 'ขอรับคำปรึกษาฟรี',
  subtitle: 'กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับโดยเร็วที่สุด',
  successMessage: 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
  fields: {
    companyNameLabel: 'ชื่อบริษัท/องค์กร',
    contactPersonLabel: 'ชื่อผู้ติดต่อ',
    emailLabel: 'อีเมล',
    phoneLabel: 'เบอร์โทรศัพท์',
    messageLabel: 'รายละเอียด',
    submitButtonText: 'ขอรับคำปรึกษาฟรี',
  },
}

const FALLBACK_CTA = {
  headline: 'พร้อมปรึกษาทีมกฎหมายของเรา?',
  description: 'ติดต่อเราวันนี้เพื่อรับคำปรึกษาเบื้องต้นฟรี และให้เราช่วยดูแลด้านกฎหมายให้ธุรกิจของคุณ',
  primaryButton: { text: 'ติดต่อเราวันนี้', url: '/contact' },
  phoneNumber: '02-123-4567',
}

const FALLBACK_SERVICES = [
  { id: '1', title: 'สัญญาและข้อตกลง', description: 'ร่างและตรวจสอบสัญญาทุกประเภท', icon: 'FileText' },
  { id: '2', title: 'ทรัพย์สินทางปัญญา', description: 'จดทะเบียนและปกป้องเครื่องหมายการค้า สิทธิบัตร ลิขสิทธิ์', icon: 'Shield' },
  { id: '3', title: 'กฎหมายแรงงาน', description: 'ที่ปรึกษาด้านการจ้างงานและแรงงานสัมพันธ์', icon: 'Users' },
  { id: '4', title: 'การควบรวมกิจการ', description: 'M&A การปรับโครงสร้างธุรกิจและ Due Diligence', icon: 'Building2' },
]

export default async function CorporateSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [page, corporateServices] = await Promise.all([
    getCorporatePageBySlug(slug, 'th'),
    getCorporateServices('th'),
  ])

  if (!page) notFound()

  const hero = page.hero ?? FALLBACK_HERO
  const sectionHeaders = page.sectionHeaders ?? FALLBACK_SECTION_HEADERS
  const trustPillars = page.trustPillars ?? FALLBACK_TRUST_PILLARS
  const processSteps = page.processSteps ?? FALLBACK_PROCESS_STEPS
  const stats = page.stats ?? FALLBACK_STATS
  const leadForm = page.leadForm ?? FALLBACK_LEAD_FORM
  const cta = page.cta ?? FALLBACK_CTA

  const services =
    corporateServices.length > 0
      ? corporateServices.map((s) => ({ id: s.id, title: s.title, description: s.description, icon: s.icon }))
      : FALLBACK_SERVICES

  return (
    <CorporatePageClient
      hero={hero}
      sectionHeaders={sectionHeaders}
      services={services}
      trustPillars={trustPillars}
      processSteps={processSteps}
      stats={stats}
      leadForm={leadForm}
      cta={cta}
    />
  )
}
