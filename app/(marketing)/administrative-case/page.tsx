import type { Metadata } from 'next'
import { getAdministrativeCasePage } from '@/lib/cms'
import { AdministrativeCasePageClient } from '@/components/administrative-case/administrative-case-page-client'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const revalidate = 3600

const FALLBACK_HERO = {
  badge: 'คดีปกครอง',
  headline: 'บริการกฎหมาย',
  highlightedText: 'คดีปกครอง',
  subheadline:
    'บริการด้านคดีปกครองครบวงจร ปกป้องสิทธิของคุณต่อหน่วยงานรัฐ โดยทีมทนายความผู้เชี่ยวชาญด้านกฎหมายปกครอง',
  checkpoints: [
    { text: 'ปรึกษาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย' },
    { text: 'ทีมทนายผู้เชี่ยวชาญด้านคดีปกครอง' },
    { text: 'ประสบการณ์ว่าความในศาลปกครองกว่า 10 ปี' },
  ],
}

const FALLBACK_SECTION_HEADERS = {
  services: {
    label: 'บริการของเรา',
    title: 'บริการด้านคดีปกครองครบวงจร',
    description: 'ครอบคลุมทุกด้านของคดีปกครองที่คุณต้องการ',
  },
  whyUs: {
    title: 'ทำไมต้องเลือกเรา',
    description: 'เราพร้อมเป็นพันธมิตรทางกฎหมายที่คุณไว้วางใจได้',
  },
  process: {
    title: 'ขั้นตอนการทำงาน',
    description: 'กระบวนการทำงานที่ชัดเจน โปร่งใส และมีประสิทธิภาพ',
  },
  contact: {
    title: 'ปรึกษาคดีปกครองฟรี',
    description: 'กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับโดยเร็วที่สุด',
  },
}

const FALLBACK_SERVICES = [
  {
    id: '1',
    title: 'ฟ้องเพิกถอนคำสั่งทางปกครอง',
    description: 'ดำเนินคดีเพิกถอนคำสั่งของเจ้าหน้าที่รัฐที่ไม่ชอบด้วยกฎหมาย',
    icon: 'Scale',
  },
  {
    id: '2',
    title: 'คดีละเมิดทางปกครอง',
    description: 'เรียกค่าเสียหายจากการกระทำละเมิดของหน่วยงานรัฐหรือเจ้าหน้าที่',
    icon: 'Shield',
  },
  {
    id: '3',
    title: 'คดีสัญญาทางปกครอง',
    description: 'พิพาทจากสัญญาสัมปทาน สัญญาจ้างก่อสร้าง และสัญญาบริการสาธารณะ',
    icon: 'FileText',
  },
  {
    id: '4',
    title: 'คดีที่ดินและผังเมือง',
    description: 'โต้แย้งการเวนคืน การออกโฉนด และการใช้ที่ดินตามผังเมือง',
    icon: 'Building2',
  },
  {
    id: '5',
    title: 'คดีภาษีอากร',
    description: 'อุทธรณ์การประเมินภาษีและโต้แย้งคำสั่งทางภาษีของกรมสรรพากร',
    icon: 'Briefcase',
  },
  {
    id: '6',
    title: 'คดีวินัยและการเลิกจ้าง',
    description: 'ปกป้องสิทธิข้าราชการและพนักงานรัฐจากการดำเนินการทางวินัยที่ไม่เป็นธรรม',
    icon: 'Users',
  },
]

const FALLBACK_TRUST_PILLARS = [
  {
    icon: 'Scale',
    title: 'ทีมทนายผู้เชี่ยวชาญ',
    description: 'ทนายความที่มีประสบการณ์ด้านคดีปกครองและศาลปกครองโดยเฉพาะ',
  },
  {
    icon: 'Briefcase',
    title: 'ประวัติชนะคดีสูง',
    description: 'ผลงานที่พิสูจน์ได้จากคดีปกครองที่ผ่านมากกว่า 10 ปี',
  },
  {
    icon: 'CheckCircle',
    title: 'ให้คำปรึกษาทันที',
    description: 'ทีมพร้อมให้คำปรึกษาและประเมินคดีเบื้องต้นโดยไม่คิดค่าใช้จ่าย',
  },
]

const FALLBACK_PROCESS_STEPS = [
  {
    step: 1,
    icon: 'Phone',
    title: 'ปรึกษาเบื้องต้น',
    description: 'ติดต่อทีมเพื่อประเมินข้อเท็จจริงและแนวทางการต่อสู้คดี',
  },
  {
    step: 2,
    icon: 'Target',
    title: 'วางแผนคดี',
    description: 'ทีมทนายวิเคราะห์และวางกลยุทธ์การดำเนินคดีที่เหมาะสม',
  },
  {
    step: 3,
    icon: 'Handshake',
    title: 'ดำเนินคดี',
    description: 'ยื่นฟ้องและว่าความในศาลปกครองพร้อมรายงานความคืบหน้าอย่างสม่ำเสมอ',
  },
]

const FALLBACK_STATS = [
  { value: '200+', label: 'คดีที่ชนะ' },
  { value: '10+', label: 'ปีประสบการณ์' },
  { value: '95%', label: 'ความพึงพอใจ' },
  { value: '24/7', label: 'พร้อมให้บริการ' },
]

const FALLBACK_LEAD_FORM = {
  title: 'ปรึกษาคดีปกครองฟรี',
  subtitle: 'กรอกข้อมูลเพื่อให้ทีมงานติดต่อกลับโดยเร็วที่สุด',
  successMessage: 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
  fields: {
    companyNameLabel: 'ชื่อบริษัท/หน่วยงาน',
    contactPersonLabel: 'ชื่อผู้ติดต่อ',
    emailLabel: 'อีเมล',
    phoneLabel: 'เบอร์โทรศัพท์',
    messageLabel: 'รายละเอียดคดี',
    submitButtonText: 'ปรึกษาคดีปกครองฟรี',
  },
}

const FALLBACK_CTA = {
  headline: 'พร้อมสู้คดีปกครองด้วยกันหรือยัง?',
  description: 'ติดต่อเราวันนี้เพื่อรับคำปรึกษาเบื้องต้นฟรี และให้เราช่วยปกป้องสิทธิของคุณ',
  primaryButton: { text: 'ติดต่อทีมคดีปกครอง', url: '/contact' },
  phoneNumber: '02-123-4567',
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAdministrativeCasePage('th')
  return generatePageMetadata({
    title: page?.seo?.metaTitle || 'คดีปกครอง | เพื่อนทนาย',
    description:
      page?.seo?.metaDescription ||
      'บริการด้านคดีปกครองครบวงจร ปกป้องสิทธิของคุณต่อหน่วยงานรัฐ โดยทีมทนายความผู้เชี่ยวชาญ',
    path: '/administrative-case',
    ogImage: page?.seo?.ogImage?.url,
  })
}

export default async function AdministrativeCasePage() {
  const page = await getAdministrativeCasePage('th')

  const hero = page?.hero ?? FALLBACK_HERO
  const sectionHeaders = page?.sectionHeaders ?? FALLBACK_SECTION_HEADERS
  const trustPillars = page?.trustPillars ?? FALLBACK_TRUST_PILLARS
  const processSteps = page?.processSteps ?? FALLBACK_PROCESS_STEPS
  const stats = page?.stats ?? FALLBACK_STATS
  const leadForm = page?.leadForm ?? FALLBACK_LEAD_FORM
  const cta = page?.cta ?? FALLBACK_CTA

  const cmsServices = page?.services?.filter((s) => s.isActive !== false) ?? []
  const services =
    cmsServices.length > 0
      ? cmsServices.map((s) => ({ id: s.id, title: s.title, description: s.description, icon: s.icon }))
      : FALLBACK_SERVICES

  return (
    <AdministrativeCasePageClient
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
