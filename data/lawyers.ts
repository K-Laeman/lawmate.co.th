import type { Lawyer, LawyerAvailability } from '@/types';
import { mockProvinces } from './provinces';

// Thai day names (short)
export const thaiDayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
export const thaiDayNamesFull = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// Common availability patterns
const weekdaySchedule: LawyerAvailability[] = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isActive: true }, // Monday
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isActive: true }, // Tuesday
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isActive: true }, // Wednesday
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isActive: true }, // Thursday
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isActive: true }, // Friday
];

const weekdayWithSaturdaySchedule: LawyerAvailability[] = [
  ...weekdaySchedule,
  { dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isActive: true }, // Saturday morning
];

const flexibleSchedule: LawyerAvailability[] = [
  { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isActive: true },
  { dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isActive: true },
  { dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isActive: true },
  { dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isActive: true },
  { dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isActive: true },
  { dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isActive: true },
];

const morningOnlySchedule: LawyerAvailability[] = [
  { dayOfWeek: 1, startTime: '08:00', endTime: '12:00', isActive: true },
  { dayOfWeek: 2, startTime: '08:00', endTime: '12:00', isActive: true },
  { dayOfWeek: 3, startTime: '08:00', endTime: '12:00', isActive: true },
  { dayOfWeek: 4, startTime: '08:00', endTime: '12:00', isActive: true },
  { dayOfWeek: 5, startTime: '08:00', endTime: '12:00', isActive: true },
];

export const mockLawyers: Lawyer[] = [
  {
    id: 'law-001',
    firstName: 'สมชาย',
    lastName: 'ยุติธรรม',
    licenseNo: '1234/2550',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านคดีแพ่งและพาณิชย์ มีประสบการณ์กว่า 15 ปี ในการให้คำปรึกษาและว่าความคดีสัญญา หนี้สิน และอสังหาริมทรัพย์ จบการศึกษาจากคณะนิติศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
    experienceYears: 15,
    rating: 4.8,
    totalReviews: 127,
    totalCases: 342,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'civil', subtypeId: 1 },
      { caseType: 'civil', subtypeId: 2 },
      { caseType: 'civil', subtypeId: 3 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[2]],
    pricePerHour: 1000,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-002',
    firstName: 'สุดา',
    lastName: 'กฎหมายดี',
    licenseNo: '2345/2555',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความหญิงผู้เชี่ยวชาญด้านกฎหมายครอบครัวและมรดก มีความเข้าใจและเอาใจใส่ในทุกคดี จบการศึกษาจากคณะนิติศาสตร์ มหาวิทยาลัยธรรมศาสตร์ และศึกษาต่อด้านกฎหมายครอบครัวที่ประเทศอังกฤษ',
    experienceYears: 10,
    rating: 4.9,
    totalReviews: 89,
    totalCases: 215,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'civil', subtypeId: 4 },
      { caseType: 'civil', subtypeId: 5 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[3]],
    pricePerHour: 1200,
    availability: weekdaySchedule,
  },
  {
    id: 'law-003',
    firstName: 'วิชัย',
    lastName: 'เนติบัณฑิต',
    licenseNo: '3456/2552',
    profileImageUrl: '/images/lawyers/demo-lawyer-3.png',
    bio: 'ทนายความอาวุโสผู้เชี่ยวชาญด้านคดีอาญา มีประสบการณ์ในการว่าความคดีอาญาทุกประเภท รวมถึงคดีฉ้อโกง ยักยอก และความผิดต่อชีวิตและร่างกาย เคยเป็นอัยการมาก่อน',
    experienceYears: 20,
    rating: 4.7,
    totalReviews: 156,
    totalCases: 489,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 9 },
      { caseType: 'criminal', subtypeId: 10 },
      { caseType: 'criminal', subtypeId: 11 },
      { caseType: 'criminal', subtypeId: 12 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[49]],
    pricePerHour: 1500,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-004',
    firstName: 'ปิยะ',
    lastName: 'ธุรกิจการ',
    licenseNo: '4567/2558',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความด้านกฎหมายธุรกิจและนิติบุคคล มีความเชี่ยวชาญด้าน M&A, สัญญาธุรกิจ และกฎหมาย PDPA เคยทำงานกับบริษัทกฎหมายชั้นนำระดับนานาชาติ',
    experienceYears: 8,
    rating: 4.6,
    totalReviews: 45,
    totalCases: 98,
    isAvailable: true,
    specializations: [
      { caseType: 'corporate', subtypeId: 19 },
      { caseType: 'corporate', subtypeId: 20 },
      { caseType: 'corporate', subtypeId: 23 },
    ],
    serviceAreas: [mockProvinces[0]],
    pricePerHour: 2000,
    availability: flexibleSchedule,
  },
  {
    id: 'law-005',
    firstName: 'มานะ',
    lastName: 'แรงงานศาสตร์',
    licenseNo: '5678/2556',
    profileImageUrl: '/images/lawyers/demo-lawyer-3.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านกฎหมายแรงงาน ให้คำปรึกษาทั้งฝั่งนายจ้างและลูกจ้าง มีประสบการณ์ในการเจรจาไกล่เกลี่ยและว่าความในศาลแรงงาน',
    experienceYears: 12,
    rating: 4.8,
    totalReviews: 78,
    totalCases: 267,
    isAvailable: true,
    specializations: [
      { caseType: 'civil', subtypeId: 7 },
      { caseType: 'corporate', subtypeId: 18 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[12], mockProvinces[30]],
    pricePerHour: 1100,
    availability: weekdaySchedule,
  },
  {
    id: 'law-006',
    firstName: 'นภา',
    lastName: 'ไซเบอร์ลอว์',
    licenseNo: '6789/2560',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความรุ่นใหม่ผู้เชี่ยวชาญด้านกฎหมายไซเบอร์และเทคโนโลยี รวมถึงคดีหมิ่นประมาทออนไลน์ และกฎหมาย พ.ร.บ.คอมพิวเตอร์ จบการศึกษาด้านกฎหมายไซเบอร์จากต่างประเทศ',
    experienceYears: 5,
    rating: 4.9,
    totalReviews: 34,
    totalCases: 67,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 13 },
      { caseType: 'criminal', subtypeId: 16 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1]],
    pricePerHour: 1300,
    availability: flexibleSchedule,
  },
  {
    id: 'law-007',
    firstName: 'ธนา',
    lastName: 'ภาษีกร',
    licenseNo: '7890/2554',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความและที่ปรึกษาภาษีมืออาชีพ มีประสบการณ์ในการวางแผนภาษีและแก้ไขปัญหาข้อพิพาทกับกรมสรรพากร เคยทำงานที่บริษัทตรวจสอบบัญชีระดับโลก',
    experienceYears: 14,
    rating: 4.7,
    totalReviews: 52,
    totalCases: 143,
    isAvailable: false,
    specializations: [
      { caseType: 'corporate', subtypeId: 17 },
      { caseType: 'corporate', subtypeId: 24 },
    ],
    serviceAreas: [mockProvinces[0]],
    pricePerHour: 2500,
    availability: morningOnlySchedule,
  },
  {
    id: 'law-008',
    firstName: 'พิมพ์',
    lastName: 'ทรัพย์สินปัญญา',
    licenseNo: '8901/2559',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านทรัพย์สินทางปัญญา ลิขสิทธิ์ สิทธิบัตร และเครื่องหมายการค้า มีประสบการณ์ในการจดทะเบียนและปกป้องสิทธิ์ทั้งในและต่างประเทศ',
    experienceYears: 9,
    rating: 4.8,
    totalReviews: 41,
    totalCases: 112,
    isAvailable: true,
    specializations: [
      { caseType: 'corporate', subtypeId: 21 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[65]],
    pricePerHour: 1800,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-009',
    firstName: 'ประสิทธิ์',
    lastName: 'อสังหาริมทรัพย์',
    licenseNo: '9012/2553',
    profileImageUrl: '/images/lawyers/demo-lawyer-3.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านคดีที่ดินและอสังหาริมทรัพย์โดยเฉพาะ มีประสบการณ์กว่า 18 ปี ในการจัดการข้อพิพาทที่ดิน การซื้อขาย และการจดทะเบียนสิทธิ์',
    experienceYears: 18,
    rating: 4.9,
    totalReviews: 203,
    totalCases: 456,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'civil', subtypeId: 2 },
      { caseType: 'civil', subtypeId: 1 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[20], mockProvinces[25]],
    pricePerHour: 1400,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-010',
    firstName: 'รัตนา',
    lastName: 'คุ้มครองสิทธิ์',
    licenseNo: '1023/2561',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความหญิงผู้เชี่ยวชาญด้านคุ้มครองผู้บริโภค และคดีประกันภัย มีความมุ่งมั่นในการปกป้องสิทธิ์ของผู้บริโภคจากการเอาเปรียบของธุรกิจ',
    experienceYears: 6,
    rating: 4.7,
    totalReviews: 56,
    totalCases: 134,
    isAvailable: true,
    specializations: [
      { caseType: 'civil', subtypeId: 6 },
      { caseType: 'civil', subtypeId: 8 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[10], mockProvinces[15]],
    pricePerHour: 900,
    availability: weekdaySchedule,
  },
  {
    id: 'law-011',
    firstName: 'ชัยวัฒน์',
    lastName: 'อาชญากรรม',
    licenseNo: '1134/2549',
    profileImageUrl: '/images/lawyers/demo-lawyer-3.png',
    bio: 'อดีตพนักงานอัยการ ปัจจุบันเป็นทนายความอิสระผู้เชี่ยวชาญคดีอาญาทุกประเภท มีประสบการณ์กว่า 22 ปี รับว่าความคดียาเสพติด คดีฆาตกรรม และคดีร้ายแรง',
    experienceYears: 22,
    rating: 4.8,
    totalReviews: 189,
    totalCases: 567,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 9 },
      { caseType: 'criminal', subtypeId: 10 },
      { caseType: 'criminal', subtypeId: 11 },
      { caseType: 'criminal', subtypeId: 12 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[2], mockProvinces[5]],
    pricePerHour: 1800,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-012',
    firstName: 'อรุณี',
    lastName: 'หย่าร้าง',
    licenseNo: '1245/2557',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความหญิงผู้เชี่ยวชาญด้านกฎหมายครอบครัว การหย่าร้าง สิทธิในบุตร และการแบ่งสินสมรส มีความละเอียดอ่อนและเข้าใจในปัญหาครอบครัว',
    experienceYears: 11,
    rating: 4.9,
    totalReviews: 145,
    totalCases: 312,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'civil', subtypeId: 4 },
      { caseType: 'civil', subtypeId: 5 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[3], mockProvinces[12]],
    pricePerHour: 1100,
    availability: flexibleSchedule,
  },
  {
    id: 'law-013',
    firstName: 'ศักดิ์ชัย',
    lastName: 'เช็คเด้ง',
    licenseNo: '1356/2551',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความผู้เชี่ยวชาญคดีเช็คและตั๋วเงิน รวมถึงคดีฉ้อโกงและยักยอกทรัพย์ มีประสบการณ์ในการติดตามทวงหนี้และดำเนินคดีอาญา',
    experienceYears: 16,
    rating: 4.6,
    totalReviews: 98,
    totalCases: 389,
    isAvailable: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 14 },
      { caseType: 'criminal', subtypeId: 9 },
      { caseType: 'civil', subtypeId: 3 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[20], mockProvinces[30]],
    pricePerHour: 1000,
    availability: weekdaySchedule,
  },
  {
    id: 'law-014',
    firstName: 'กมลวรรณ',
    lastName: 'จราจร',
    licenseNo: '1467/2562',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความรุ่นใหม่ผู้เชี่ยวชาญคดีจราจรและอุบัติเหตุ รวมถึงการเรียกร้องค่าเสียหายจากประกันภัย มีความกระตือรือร้นในการช่วยเหลือลูกความ',
    experienceYears: 4,
    rating: 4.8,
    totalReviews: 67,
    totalCases: 156,
    isAvailable: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 15 },
      { caseType: 'civil', subtypeId: 8 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[5]],
    pricePerHour: 800,
    availability: flexibleSchedule,
  },
  {
    id: 'law-015',
    firstName: 'สุรเดช',
    lastName: 'สตาร์ทอัพ',
    licenseNo: '1578/2563',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านสตาร์ทอัพและเทคโนโลยี รวมถึง SEC, IPO/ICO และกฎหมายการระดมทุน จบการศึกษาด้านกฎหมายธุรกิจจาก Stanford Law School',
    experienceYears: 5,
    rating: 4.7,
    totalReviews: 34,
    totalCases: 78,
    isAvailable: true,
    specializations: [
      { caseType: 'corporate', subtypeId: 22 },
      { caseType: 'corporate', subtypeId: 20 },
      { caseType: 'corporate', subtypeId: 19 },
    ],
    serviceAreas: [mockProvinces[0]],
    pricePerHour: 2200,
    availability: flexibleSchedule,
  },
  {
    id: 'law-016',
    firstName: 'วิภาวดี',
    lastName: 'การค้าระหว่างประเทศ',
    licenseNo: '1689/2554',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านการค้าระหว่างประเทศ สัญญาธุรกิจข้ามชาติ และ M&A มีประสบการณ์ทำงานกับบริษัทข้ามชาติหลายแห่ง พูดได้ 3 ภาษา',
    experienceYears: 13,
    rating: 4.9,
    totalReviews: 78,
    totalCases: 145,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'corporate', subtypeId: 23 },
      { caseType: 'corporate', subtypeId: 20 },
      { caseType: 'corporate', subtypeId: 24 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[20]],
    pricePerHour: 2500,
    availability: weekdaySchedule,
  },
  {
    id: 'law-017',
    firstName: 'ธีรพงษ์',
    lastName: 'มรดกศาสตร์',
    licenseNo: '1790/2550',
    profileImageUrl: '/images/lawyers/demo-lawyer-3.png',
    bio: 'ทนายความอาวุโสผู้เชี่ยวชาญด้านมรดกและพินัยกรรม มีประสบการณ์กว่า 17 ปี ในการจัดการมรดก การแบ่งทรัพย์สิน และข้อพิพาททายาท',
    experienceYears: 17,
    rating: 4.8,
    totalReviews: 134,
    totalCases: 289,
    isAvailable: true,
    specializations: [
      { caseType: 'civil', subtypeId: 5 },
      { caseType: 'civil', subtypeId: 4 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[10], mockProvinces[40]],
    pricePerHour: 1300,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-018',
    firstName: 'นิรันดร์',
    lastName: 'แรงงานสัมพันธ์',
    licenseNo: '1801/2556',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความผู้เชี่ยวชาญด้านกฎหมายแรงงานทั้งฝั่งนายจ้างและลูกจ้าง มีประสบการณ์ในการเจรจาต่อรองและไกล่เกลี่ยข้อพิพาทแรงงาน',
    experienceYears: 10,
    rating: 4.7,
    totalReviews: 89,
    totalCases: 234,
    isAvailable: true,
    specializations: [
      { caseType: 'civil', subtypeId: 7 },
      { caseType: 'corporate', subtypeId: 18 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[5], mockProvinces[15], mockProvinces[20]],
    pricePerHour: 1000,
    availability: weekdaySchedule,
  },
  {
    id: 'law-019',
    firstName: 'ปราณี',
    lastName: 'หนี้สินเรียกคืน',
    licenseNo: '1912/2558',
    profileImageUrl: '/images/lawyers/demo-lawyer-2.png',
    bio: 'ทนายความหญิงผู้เชี่ยวชาญด้านการทวงหนี้และการดำเนินคดีหนี้สิน มีประสบการณ์ในการเจรจาปรับโครงสร้างหนี้และการบังคับคดี',
    experienceYears: 8,
    rating: 4.6,
    totalReviews: 112,
    totalCases: 345,
    isAvailable: true,
    specializations: [
      { caseType: 'civil', subtypeId: 3 },
      { caseType: 'civil', subtypeId: 1 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1], mockProvinces[12]],
    pricePerHour: 900,
    availability: weekdayWithSaturdaySchedule,
  },
  {
    id: 'law-020',
    firstName: 'เกียรติศักดิ์',
    lastName: 'ออนไลน์',
    licenseNo: '2023/2564',
    profileImageUrl: '/images/lawyers/demo-lawyer-1.png',
    bio: 'ทนายความรุ่นใหม่ผู้เชี่ยวชาญคดีอาชญากรรมไซเบอร์ หมิ่นประมาทออนไลน์ และการละเมิดข้อมูลส่วนบุคคล จบการศึกษาด้าน Cybersecurity Law จากต่างประเทศ',
    experienceYears: 3,
    rating: 4.9,
    totalReviews: 45,
    totalCases: 89,
    isAvailable: true,
    isRecommended: true,
    specializations: [
      { caseType: 'criminal', subtypeId: 16 },
      { caseType: 'criminal', subtypeId: 13 },
      { caseType: 'corporate', subtypeId: 19 },
    ],
    serviceAreas: [mockProvinces[0], mockProvinces[1]],
    pricePerHour: 1500,
    availability: flexibleSchedule,
  },
];

export function getLawyerById(id: string): Lawyer | undefined {
  return mockLawyers.find((l) => l.id === id);
}

export function filterLawyers(options: {
  provinceId?: number;
  caseType?: 'civil' | 'criminal' | 'corporate';
  subtypeId?: number;
  isAvailable?: boolean;
}): Lawyer[] {
  return mockLawyers.filter((lawyer) => {
    if (options.isAvailable !== undefined && lawyer.isAvailable !== options.isAvailable) {
      return false;
    }
    if (options.provinceId && !lawyer.serviceAreas.some((p) => p.id === options.provinceId)) {
      return false;
    }
    if (options.caseType && !lawyer.specializations.some((s) => s.caseType === options.caseType)) {
      return false;
    }
    if (options.subtypeId && !lawyer.specializations.some((s) => s.subtypeId === options.subtypeId)) {
      return false;
    }
    return true;
  });
}

export function getTopRatedLawyers(limit: number = 5): Lawyer[] {
  return [...mockLawyers]
    .filter((l) => l.isAvailable)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function getRecommendedLawyers(): Lawyer[] {
  return mockLawyers.filter((l) => l.isRecommended && l.isAvailable);
}

export function getRegularLawyers(): Lawyer[] {
  return mockLawyers.filter((l) => !l.isRecommended && l.isAvailable);
}

// Get availability for a specific day of week
export function getAvailabilityForDay(lawyer: Lawyer, dayOfWeek: number): LawyerAvailability | null {
  if (!lawyer.availability) return null;
  return lawyer.availability.find((a) => a.dayOfWeek === dayOfWeek && a.isActive) || null;
}

// Get today's availability for a lawyer
export function getTodayAvailability(lawyer: Lawyer): { startTime: string; endTime: string } | null {
  const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
  return getAvailabilityForDay(lawyer, today);
}

// Get next available day and time range
export function getNextAvailability(lawyer: Lawyer): { dayName: string; dayIndex: number; startTime: string; endTime: string } | null {
  if (!lawyer.availability || lawyer.availability.length === 0) return null;

  const today = new Date().getDay();

  // Check today first, then next 6 days
  for (let i = 0; i < 7; i++) {
    const checkDay = (today + i) % 7;
    const availability = getAvailabilityForDay(lawyer, checkDay);

    if (availability) {
      return {
        dayName: i === 0 ? 'วันนี้' : i === 1 ? 'พรุ่งนี้' : thaiDayNamesFull[checkDay],
        dayIndex: checkDay,
        startTime: availability.startTime,
        endTime: availability.endTime,
      };
    }
  }

  return null;
}

// Format time for display (e.g., "09:00" -> "09:00 น.")
export function formatTimeSlot(time: string): string {
  return `${time} น.`;
}

// Get full week schedule for a lawyer
export function getWeekSchedule(lawyer: Lawyer): Array<{ day: string; dayIndex: number; availability: LawyerAvailability | null }> {
  return [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
    day: thaiDayNames[dayIndex],
    dayIndex,
    availability: getAvailabilityForDay(lawyer, dayIndex),
  }));
}
