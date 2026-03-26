import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo';
import { generateFAQJsonLd, JsonLdScript } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: PAGE_TITLES.faq,
  description: PAGE_DESCRIPTIONS.faq,
};

// FAQ data for JSON-LD schema (subset of main FAQs for SEO)
const faqSchemaData = [
  {
    question: 'เพื่อนทนายคืออะไร?',
    answer:
      'เพื่อนทนายเป็นแพลตฟอร์มออนไลน์ที่เชื่อมต่อประชาชนกับทนายความที่ผ่านการรับรอง คุณสามารถปรึกษาทนายความได้ง่ายๆ ผ่านวิดีโอคอล ไม่ว่าจะอยู่ที่ไหนก็ตาม ด้วยราคาที่โปร่งใสและแพ็กเกจหลากหลาย',
  },
  {
    question: 'ฉันต้องสมัครสมาชิกก่อนใช้งานหรือไม่?',
    answer:
      'ใช่ครับ คุณต้องสมัครสมาชิกก่อนเพื่อจองการปรึกษา โดยใช้เบอร์โทรศัพท์มือถือในการลงทะเบียน ระบบจะส่งรหัส OTP เพื่อยืนยันตัวตน การสมัครใช้เวลาไม่ถึง 2 นาที',
  },
  {
    question: 'ทนายความที่ให้บริการมีคุณสมบัติอย่างไร?',
    answer:
      'ทนายความทุกคนบนแพลตฟอร์มต้องมีใบอนุญาตว่าความจากสภาทนายความ ผ่านการตรวจสอบประวัติ และยืนยันตัวตนแล้ว เราคัดเลือกทนายความที่มีประสบการณ์และเชี่ยวชาญในแต่ละประเภทคดี',
  },
  {
    question: 'รองรับการชำระเงินแบบใดบ้าง?',
    answer:
      'เรารองรับการชำระเงินหลายช่องทาง: บัตรเครดิต/เดบิต (Visa, MasterCard, JCB), พร้อมเพย์ (PromptPay), โอนเงินผ่านธนาคาร, TrueMoney Wallet',
  },
  {
    question: 'ข้อมูลของฉันปลอดภัยหรือไม่?',
    answer:
      'เราให้ความสำคัญกับความปลอดภัยสูงสุด: เข้ารหัสข้อมูลทั้งหมดด้วย SSL/TLS, การสนทนาเป็นแบบ End-to-End Encryption, ไม่เก็บข้อมูลบัตรเครดิตในระบบ, ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
  },
];

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLdScript data={generateFAQJsonLd(faqSchemaData)} />
      {children}
    </>
  );
}
