import type { Metadata } from 'next'

// CMS imports
import { getFAQPage, getFAQ, getFAQCategories } from '@/lib/cms'

// Client component for interactive features
import { FAQPageClient } from '@/components/faq/faq-page-client'
import { generatePageMetadata } from '@/lib/seo/metadata'
import { generateFAQJsonLd, JsonLdScript } from '@/lib/seo/json-ld'

// ISR revalidation interval (60 seconds)
export const revalidate = 3600

// Fallback FAQs when CMS is unavailable
const FALLBACK_FAQS = [
  {
    id: '1',
    category: 'getting-started',
    question: 'เพื่อนทนายคืออะไร?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'เพื่อนทนายเป็นแพลตฟอร์มออนไลน์ที่เชื่อมต่อประชาชนกับทนายความที่ผ่านการรับรอง คุณสามารถปรึกษาทนายความได้ง่ายๆ ผ่านวิดีโอคอล ไม่ว่าจะอยู่ที่ไหนก็ตาม ด้วยราคาที่โปร่งใสและแพ็กเกจหลากหลาย',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '2',
    category: 'getting-started',
    question: 'ฉันต้องสมัครสมาชิกก่อนใช้งานหรือไม่?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'ใช่ครับ คุณต้องสมัครสมาชิกก่อนเพื่อจองการปรึกษา โดยใช้เบอร์โทรศัพท์มือถือในการลงทะเบียน ระบบจะส่งรหัส OTP เพื่อยืนยันตัวตน การสมัครใช้เวลาไม่ถึง 2 นาที',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '3',
    category: 'getting-started',
    question: 'ทนายความที่ให้บริการมีคุณสมบัติอย่างไร?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'ทนายความทุกคนบนแพลตฟอร์มต้องมีใบอนุญาตว่าความจากสภาทนายความ ผ่านการตรวจสอบประวัติ และยืนยันตัวตนแล้ว เราคัดเลือกทนายความที่มีประสบการณ์และเชี่ยวชาญในแต่ละประเภทคดี',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '4',
    category: 'booking',
    question: 'ฉันจะค้นหาทนายความที่เหมาะกับคดีของฉันได้อย่างไร?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'คุณสามารถค้นหาทนายความได้จากหน้า "ค้นหาทนาย" โดยกรองตามประเภทคดี จังหวัด ราคา และคะแนนรีวิว ระบบจะแสดงทนายความที่เชี่ยวชาญตรงกับความต้องการของคุณ',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '5',
    category: 'payment',
    question: 'รองรับการชำระเงินแบบใดบ้าง?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'เรารองรับการชำระเงินหลายช่องทาง: บัตรเครดิต/เดบิต (Visa, MasterCard, JCB), พร้อมเพย์ (PromptPay), โอนเงินผ่านธนาคาร และ TrueMoney Wallet',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '6',
    category: 'consultation',
    question: 'การปรึกษาทำอย่างไร?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'เมื่อถึงเวลานัดหมาย ให้เข้าสู่ระบบและกด "เริ่มการปรึกษา" ระบบจะเปิดห้องวิดีโอคอลที่คุณสามารถพูดคุยกับทนายความแบบ real-time มีฟีเจอร์แชทและแชร์เอกสารระหว่างการปรึกษาด้วย',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  {
    id: '7',
    category: 'security',
    question: 'ข้อมูลของฉันปลอดภัยหรือไม่?',
    answer: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            version: 1,
            children: [
              {
                type: 'text',
                version: 1,
                text: 'เราให้ความสำคัญกับความปลอดภัยสูงสุด: เข้ารหัสข้อมูลทั้งหมดด้วย SSL/TLS, การสนทนาเป็นแบบ End-to-End Encryption, ไม่เก็บข้อมูลบัตรเครดิตในระบบ และปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
]

const FALLBACK_CATEGORIES = [
  { id: '1', slug: 'getting-started', label: 'เริ่มต้นใช้งาน', icon: 'Users' },
  { id: '2', slug: 'booking', label: 'การจองและนัดหมาย', icon: 'Clock' },
  { id: '3', slug: 'payment', label: 'การชำระเงิน', icon: 'CreditCard' },
  { id: '4', slug: 'consultation', label: 'การปรึกษา', icon: 'Video' },
  { id: '5', slug: 'security', label: 'ความปลอดภัย', icon: 'Shield' },
]

const FALLBACK_PAGE = {
  hero: {
    badge: 'Support Center',
    headline: 'คำถามที่พบบ่อย',
    subheadline:
      'ค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการของเรา การใช้งาน และการช่วยเหลือ เพื่อให้คุณใช้งานแพลตฟอร์มได้อย่างราบรื่น',
    searchPlaceholder: 'ค้นหาคำถาม...',
  },
  emptyState: {
    icon: 'HelpCircle',
    title: 'ไม่พบคำถามที่ค้นหา',
    description: 'ลองใช้คำค้นหาอื่น หรือดูหมวดหมู่ทั้งหมด เพื่อค้นหาข้อมูลที่คุณต้องการ',
    buttonText: 'ติดต่อเจ้าหน้าที่',
  },
  stillHaveQuestions: {
    icon: 'MessageCircle',
    title: 'ยังมีคำถามอยู่?',
    description: 'หากคุณไม่พบคำตอบที่ต้องการ ทีมงานซัพพอร์ตของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง',
    primaryButton: {
      text: 'ติดต่อเรา',
      url: '/contact',
    },
    secondaryButton: {
      text: 'โทร 02-123-4567',
      phone: '021234567',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const faqPage = await getFAQPage('th')

  return generatePageMetadata({
    title: faqPage?.seo?.metaTitle || 'คำถามที่พบบ่อย | เพื่อนทนาย',
    description:
      faqPage?.seo?.metaDescription ||
      'ค้นหาคำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับบริการปรึกษาทนายออนไลน์ การจอง การชำระเงิน และอื่นๆ',
    path: '/faq',
    ogImage: faqPage?.seo?.ogImage?.url,
  })
}

/** Extract plain text from Lexical rich text structure for use in JSON-LD */
function extractLexicalText(answer: unknown): string {
  try {
    const root = (answer as { root: { children: unknown[] } })?.root
    if (!root?.children) return ''
    const collect = (nodes: unknown[]): string =>
      nodes
        .flatMap((node) => {
          const n = node as { type?: string; text?: string; children?: unknown[] }
          if (n.type === 'text' && n.text) return [n.text]
          if (n.children) return [collect(n.children)]
          return []
        })
        .join(' ')
    return collect(root.children).trim()
  } catch {
    return ''
  }
}

export default async function FAQPage() {
  // Fetch all CMS data in parallel
  const [faqPage, cmsFaqs, cmsCategories] = await Promise.all([
    getFAQPage('th'),
    getFAQ('th', { limit: 50 }),
    getFAQCategories('th'),
  ])

  // Use CMS data with fallbacks
  const hero = faqPage?.hero ?? FALLBACK_PAGE.hero
  const emptyState = faqPage?.emptyState ?? FALLBACK_PAGE.emptyState
  const stillHaveQuestions = faqPage?.stillHaveQuestions ?? FALLBACK_PAGE.stillHaveQuestions

  const faqs = cmsFaqs.length ? cmsFaqs : FALLBACK_FAQS
  const categories = cmsCategories.length ? cmsCategories : FALLBACK_CATEGORIES

  // Build FAQ items for JSON-LD structured data
  const faqJsonLdItems = faqs
    .map((faq) => ({
      question: faq.question,
      answer: extractLexicalText(faq.answer),
    }))
    .filter((item) => item.question && item.answer.length > 0)

  return (
    <>
      {faqJsonLdItems.length > 0 && (
        <JsonLdScript data={generateFAQJsonLd(faqJsonLdItems)} />
      )}
      <main className="overflow-hidden">
        <FAQPageClient
          hero={hero}
          faqs={faqs}
          categories={categories}
          emptyState={emptyState}
          stillHaveQuestions={stillHaveQuestions}
        />
      </main>
    </>
  )
}
