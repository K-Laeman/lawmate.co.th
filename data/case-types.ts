import type { CaseType } from '@/types';

export const mockCaseTypes: CaseType[] = [
  {
    id: 1,
    code: 'civil',
    nameTh: 'คดีแพ่ง',
    nameEn: 'Civil Case',
    subtypes: [
      { id: 1, code: 'contract', nameTh: 'สัญญา', nameEn: 'Contract' },
      { id: 2, code: 'property', nameTh: 'ที่ดิน/อสังหาริมทรัพย์', nameEn: 'Property/Real Estate' },
      { id: 3, code: 'debt', nameTh: 'หนี้สิน', nameEn: 'Debt' },
      { id: 4, code: 'family', nameTh: 'ครอบครัว', nameEn: 'Family' },
      { id: 5, code: 'inheritance', nameTh: 'มรดก', nameEn: 'Inheritance' },
      { id: 6, code: 'consumer', nameTh: 'คุ้มครองผู้บริโภค', nameEn: 'Consumer Protection' },
      { id: 7, code: 'labor', nameTh: 'แรงงาน', nameEn: 'Labor' },
      { id: 8, code: 'insurance', nameTh: 'ประกันภัย', nameEn: 'Insurance' },
    ],
  },
  {
    id: 2,
    code: 'criminal',
    nameTh: 'คดีอาญา',
    nameEn: 'Criminal Case',
    subtypes: [
      { id: 9, code: 'fraud', nameTh: 'ฉ้อโกง', nameEn: 'Fraud' },
      { id: 10, code: 'assault', nameTh: 'ทำร้ายร่างกาย', nameEn: 'Assault' },
      { id: 11, code: 'theft', nameTh: 'ลักทรัพย์', nameEn: 'Theft' },
      { id: 12, code: 'embezzlement', nameTh: 'ยักยอก', nameEn: 'Embezzlement' },
      { id: 13, code: 'defamation', nameTh: 'หมิ่นประมาท', nameEn: 'Defamation' },
      { id: 14, code: 'cheque', nameTh: 'เช็ค', nameEn: 'Cheque' },
      { id: 15, code: 'traffic', nameTh: 'จราจร', nameEn: 'Traffic' },
      { id: 16, code: 'cyber', nameTh: 'อาชญากรรมไซเบอร์', nameEn: 'Cybercrime' },
    ],
  },
  {
    id: 3,
    code: 'corporate',
    nameTh: 'นิติบุคคล/องค์กร',
    nameEn: 'Corporate',
    subtypes: [
      { id: 17, code: 'tax', nameTh: 'ภาษี', nameEn: 'Tax' },
      { id: 18, code: 'labor_corporate', nameTh: 'แรงงาน (นิติบุคคล)', nameEn: 'Corporate Labor' },
      { id: 19, code: 'pdpa', nameTh: 'PDPA', nameEn: 'PDPA' },
      { id: 20, code: 'ma', nameTh: 'M&A', nameEn: 'M&A' },
      { id: 21, code: 'ip', nameTh: 'ทรัพย์สินทางปัญญา', nameEn: 'Intellectual Property' },
      { id: 22, code: 'sec', nameTh: 'กลต. (IPO/ICO)', nameEn: 'SEC (IPO/ICO)' },
      { id: 23, code: 'contract_corporate', nameTh: 'สัญญาธุรกิจ', nameEn: 'Business Contract' },
      { id: 24, code: 'compliance', nameTh: 'กำกับดูแล', nameEn: 'Compliance' },
    ],
  },
];

export function getCaseTypeByCode(code: string): CaseType | undefined {
  return mockCaseTypes.find((ct) => ct.code === code);
}

export function getSubtypeById(subtypeId: number): { caseType: CaseType; subtype: CaseType['subtypes'][0] } | undefined {
  for (const caseType of mockCaseTypes) {
    const subtype = caseType.subtypes.find((st) => st.id === subtypeId);
    if (subtype) {
      return { caseType, subtype };
    }
  }
  return undefined;
}
