import type { ServicePackage } from '@/types';

export const mockPackages: ServicePackage[] = [
  {
    id: 1,
    name: 'Quick Consult',
    nameTh: 'ปรึกษาด่วน',
    durationMinutes: 30,
    price: 700,
    description: 'ปรึกษาเบื้องต้น รับคำแนะนำทิศทางคดี',
    features: [
      'ปรึกษาเบื้องต้น 30 นาที',
      'รับคำแนะนำทิศทางคดี',
      'สรุปประเด็นสำคัญ',
      'แนะนำขั้นตอนถัดไป',
    ],
  },
  {
    id: 2,
    name: 'Standard',
    nameTh: 'มาตรฐาน',
    durationMinutes: 60,
    price: 1000,
    description: 'ปรึกษาเชิงลึก วิเคราะห์คดีอย่างละเอียด',
    features: [
      'ปรึกษาเชิงลึก 1 ชั่วโมง',
      'วิเคราะห์คดีอย่างละเอียด',
      'แนะนำแนวทางดำเนินคดี',
      'สรุปเอกสารที่ต้องเตรียม',
      'ประเมินโอกาสชนะคดี',
    ],
    isPopular: true,
  },
  {
    id: 3,
    name: 'Extended',
    nameTh: 'ขยายเวลา',
    durationMinutes: 120,
    price: 1800,
    description: 'ปรึกษาเต็มรูปแบบ พร้อมร่างเอกสารเบื้องต้น',
    features: [
      'ปรึกษาเต็มรูปแบบ 2 ชั่วโมง',
      'วิเคราะห์คดีครบทุกมิติ',
      'วางแผนกลยุทธ์คดี',
      'ร่างเอกสารเบื้องต้น',
      'ประเมินค่าใช้จ่ายทั้งหมด',
      'แนะนำทนายความเฉพาะทาง',
    ],
  },
  {
    id: 4,
    name: 'Premium',
    nameTh: 'พรีเมียม',
    durationMinutes: 180,
    price: 2500,
    description: 'ปรึกษาครบวงจร พร้อมติดตามผลหลังการปรึกษา',
    features: [
      'ปรึกษาครบวงจร 3 ชั่วโมง',
      'วิเคราะห์และวางแผนคดีเต็มรูปแบบ',
      'ร่างเอกสารที่จำเป็น',
      'ประเมินความเสี่ยงและโอกาส',
      'ติดตามผลหลังปรึกษา 7 วัน',
      'ช่องทางติดต่อสอบถามเพิ่มเติม',
    ],
  },
];

export function getPackageById(id: number): ServicePackage | undefined {
  return mockPackages.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('th-TH').format(price);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} ชั่วโมง`;
  }
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
}
