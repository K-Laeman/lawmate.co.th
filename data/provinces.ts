import type { Province } from '@/types';

export const mockProvinces: Province[] = [
  // Central Region
  { id: 1, nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'central' },
  { id: 2, nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'central' },
  { id: 3, nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'central' },
  { id: 4, nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'central' },
  { id: 5, nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'central' },
  { id: 6, nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'central' },
  { id: 7, nameTh: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'central' },
  { id: 8, nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'central' },
  { id: 9, nameTh: 'ลพบุรี', nameEn: 'Lopburi', region: 'central' },
  { id: 10, nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'central' },
  { id: 11, nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'central' },
  { id: 12, nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'central' },

  // North Region
  { id: 13, nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'north' },
  { id: 14, nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'north' },
  { id: 15, nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'north' },
  { id: 16, nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'north' },
  { id: 17, nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'north' },
  { id: 18, nameTh: 'น่าน', nameEn: 'Nan', region: 'north' },
  { id: 19, nameTh: 'พะเยา', nameEn: 'Phayao', region: 'north' },
  { id: 20, nameTh: 'แพร่', nameEn: 'Phrae', region: 'north' },
  { id: 21, nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'north' },
  { id: 22, nameTh: 'ตาก', nameEn: 'Tak', region: 'north' },
  { id: 23, nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'north' },
  { id: 24, nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'north' },
  { id: 25, nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'north' },
  { id: 26, nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'north' },
  { id: 27, nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'north' },
  { id: 28, nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'north' },
  { id: 29, nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'north' },

  // Northeast Region (Isan)
  { id: 30, nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'northeast' },
  { id: 31, nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'northeast' },
  { id: 32, nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'northeast' },
  { id: 33, nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'northeast' },
  { id: 34, nameTh: 'บุรีรัมย์', nameEn: 'Buriram', region: 'northeast' },
  { id: 35, nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'northeast' },
  { id: 36, nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'northeast' },
  { id: 37, nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'northeast' },
  { id: 38, nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'northeast' },
  { id: 39, nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'northeast' },
  { id: 40, nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'northeast' },
  { id: 41, nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'northeast' },
  { id: 42, nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'northeast' },
  { id: 43, nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'northeast' },
  { id: 44, nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'northeast' },
  { id: 45, nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lamphu', region: 'northeast' },
  { id: 46, nameTh: 'เลย', nameEn: 'Loei', region: 'northeast' },
  { id: 47, nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'northeast' },
  { id: 48, nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'northeast' },
  { id: 49, nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'northeast' },

  // East Region
  { id: 50, nameTh: 'ชลบุรี', nameEn: 'Chon Buri', region: 'east' },
  { id: 51, nameTh: 'ระยอง', nameEn: 'Rayong', region: 'east' },
  { id: 52, nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'east' },
  { id: 53, nameTh: 'ตราด', nameEn: 'Trat', region: 'east' },
  { id: 54, nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'east' },
  { id: 55, nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'east' },
  { id: 56, nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'east' },
  { id: 57, nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'east' },

  // West Region
  { id: 58, nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'west' },
  { id: 59, nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'west' },
  { id: 60, nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'west' },
  { id: 61, nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'west' },
  { id: 62, nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'west' },
  { id: 63, nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'west' },

  // South Region
  { id: 64, nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'south' },
  { id: 65, nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'south' },
  { id: 66, nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'south' },
  { id: 67, nameTh: 'กระบี่', nameEn: 'Krabi', region: 'south' },
  { id: 68, nameTh: 'พังงา', nameEn: 'Phang Nga', region: 'south' },
  { id: 69, nameTh: 'สงขลา', nameEn: 'Songkhla', region: 'south' },
  { id: 70, nameTh: 'ตรัง', nameEn: 'Trang', region: 'south' },
  { id: 71, nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'south' },
  { id: 72, nameTh: 'สตูล', nameEn: 'Satun', region: 'south' },
  { id: 73, nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'south' },
  { id: 74, nameTh: 'ระนอง', nameEn: 'Ranong', region: 'south' },
  { id: 75, nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'south' },
  { id: 76, nameTh: 'ยะลา', nameEn: 'Yala', region: 'south' },
  { id: 77, nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'south' },
];

export function getProvinceById(id: number): Province | undefined {
  return mockProvinces.find((p) => p.id === id);
}

export function getProvincesByRegion(region: Province['region']): Province[] {
  return mockProvinces.filter((p) => p.region === region);
}
