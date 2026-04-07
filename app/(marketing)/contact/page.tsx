import type { Metadata } from 'next'

// CMS imports
import { getContactPage, getInquiryTypes, getQuickLinks } from '@/lib/cms'

// Client component for interactive features
import { ContactPageClient } from '@/components/contact/contact-page-client'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateOrganizationJsonLd, JsonLdScript } from '@/lib/seo/json-ld'

// ISR revalidation interval (60 seconds)
export const revalidate = 3600

// Fallback data when CMS is unavailable
const FALLBACK_CONTACT_INFO = [
  {
    icon: 'MapPin',
    title: 'ที่อยู่',
    content: '129/176 หมู่บ้านพฤกษา 3 ซอย 1\nบางคูรัด บางบัวทอง\nนนทบุรี 11110',
  },
  {
    icon: 'Phone',
    title: 'โทรศัพท์',
    content: '062-4134665',
  },
  {
    icon: 'Mail',
    title: 'อีเมล',
    content: 'lawmatesolutions@gmail.com',
  },
  {
    icon: 'Clock',
    title: 'เวลาทำการ',
    content: 'จันทร์ - ศุกร์: 09:00 - 20:00\nเสาร์ - อาทิตย์: 10:00 - 21:00',
  },
]

const FALLBACK_INQUIRY_TYPES = [
  { value: 'general', label: 'สอบถามทั่วไป' },
  { value: 'support', label: 'ขอความช่วยเหลือ' },
  { value: 'complaint', label: 'ร้องเรียน' },
  { value: 'partnership', label: 'พันธมิตรธุรกิจ' },
  { value: 'lawyer', label: 'สมัครเป็นทนายความ' },
  { value: 'media', label: 'สื่อมวลชน' },
]

const FALLBACK_QUICK_LINKS = [
  {
    icon: 'HelpCircle',
    title: 'ศูนย์ช่วยเหลือ',
    description: 'คำถามที่พบบ่อยและวิธีการใช้งาน',
    href: '/faq',
  },
  {
    icon: 'MessageCircle',
    title: 'แชทกับเรา',
    description: 'พูดคุยกับทีมงานผ่านแชท',
    href: '#',
  },
  {
    icon: 'FileText',
    title: 'สมัครเป็นทนาย',
    description: 'เข้าร่วมเป็นทนายความกับเรา',
    href: '/register',
  },
]

const FALLBACK_PAGE = {
  hero: {
    badge: 'Contact Us',
    headline: 'ติดต่อเรา',
    subheadline:
      'มีคำถามหรือต้องการความช่วยเหลือ? ทีมงานของเราพร้อมให้บริการคุณ เพื่อให้คุณเข้าถึงความยุติธรรมได้อย่างมั่นใจ',
  },
  form: {
    title: 'ส่งข้อความถึงเรา',
    labels: {
      name: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'เบอร์โทรศัพท์',
      inquiryType: 'ประเภทการติดต่อ',
      subject: 'หัวข้อ',
      message: 'ข้อความ',
    },
    placeholders: {
      name: 'กรอกชื่อ-นามสกุล',
      email: 'example@email.com',
      phone: '08X-XXX-XXXX',
      inquiryType: 'เลือกประเภท',
      subject: 'หัวข้อที่ต้องการติดต่อ',
      message: 'รายละเอียดที่ต้องการสอบถาม...',
    },
    submitButtonText: 'ส่งข้อความ',
    successTitle: 'ส่งข้อความสำเร็จ!',
    successMessage:
      'ขอบคุณที่ติดต่อเรา เราได้รับข้อความของคุณแล้วและจะรีบติดต่อกลับภายใน 24 ชั่วโมง',
    resetButtonText: 'ส่งข้อความใหม่',
  },
  sectionHeaders: {
    contactInfoTitle: 'ข้อมูลติดต่อ',
    contactInfoDescription:
      'ติดต่อเราได้หลายช่องทาง เราพร้อมตอบทุกคำถามและให้ความช่วยเหลือคุณอย่างเต็มที่',
    quickLinksTitle: 'ลิงก์ด่วน',
    mapComingSoonText: 'Google Maps Embed Integration',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await getContactPage('th')

  return generatePageMetadata({
    title: contactPage?.seo?.metaTitle || 'ติดต่อเรา | เพื่อนทนาย',
    description:
      contactPage?.seo?.metaDescription ||
      'ติดต่อทีมงานเพื่อนทนายได้หลายช่องทาง ไม่ว่าจะโทรศัพท์ อีเมล หรือผ่านแบบฟอร์ม เราพร้อมให้ความช่วยเหลือคุณ',
    path: '/contact',
    ogImage: contactPage?.seo?.ogImage?.url,
  })
}

export default async function ContactPage() {
  // Fetch all CMS data in parallel
  const [contactPage, cmsInquiryTypes, cmsQuickLinks] = await Promise.all([
    getContactPage('th'),
    getInquiryTypes('th'),
    getQuickLinks('th'),
  ])

  // Use CMS data with fallbacks
  const hero = contactPage?.hero ?? FALLBACK_PAGE.hero
  const contactInfo = contactPage?.contactInfo?.length
    ? contactPage.contactInfo
    : FALLBACK_CONTACT_INFO
  const formConfig = contactPage?.form ?? FALLBACK_PAGE.form
  const sectionHeaders = contactPage?.sectionHeaders ?? FALLBACK_PAGE.sectionHeaders

  const inquiryTypes = (cmsInquiryTypes?.length ?? 0) > 0
    ? cmsInquiryTypes.map(t => ({ value: t.value || '', label: t.label || '' }))
    : FALLBACK_INQUIRY_TYPES

  const quickLinks = (cmsQuickLinks?.length ?? 0) > 0
    ? cmsQuickLinks.map(l => ({
        title: l.title || '',
        description: l.description || '',
        icon: l.icon || '',
        href: l.href || '#',
      }))
    : FALLBACK_QUICK_LINKS

  return (
    <>
      <JsonLdScript data={generateOrganizationJsonLd()} />
      <main className="overflow-hidden">
        <ContactPageClient
          hero={hero}
          contactInfo={contactInfo}
          inquiryTypes={inquiryTypes}
          quickLinks={quickLinks}
          formConfig={formConfig}
          sectionHeaders={sectionHeaders}
        />
      </main>
    </>
  )
}
