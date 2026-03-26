'use client';

import { Scale, Gavel, Building2, HelpCircle, ArrowRight, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingStore, type CaseStatus, type CaseType } from '@/lib/stores/booking-store';
import { mockCaseTypes } from '@/data/case-types';
import { mockProvinces } from '@/data/provinces';
import { cn } from '@/lib/utils';

// Group provinces by region for better UX
const regionLabels: Record<string, string> = {
  central: 'ภาคกลาง',
  north: 'ภาคเหนือ',
  northeast: 'ภาคตะวันออกเฉียงเหนือ',
  east: 'ภาคตะวันออก',
  west: 'ภาคตะวันตก',
  south: 'ภาคใต้',
};

const provincesByRegion = mockProvinces.reduce((acc, province) => {
  if (!acc[province.region]) {
    acc[province.region] = [];
  }
  acc[province.region].push(province);
  return acc;
}, {} as Record<string, typeof mockProvinces>);

const caseStatusOptions: { value: CaseStatus; label: string; description: string; disabled?: boolean }[] = [
  { value: 'being_sued', label: 'ถูกฟ้อง', description: 'มีคนฟ้องร้องดำเนินคดีกับฉัน' },
  { value: 'will_sue', label: 'จะฟ้อง', description: 'ต้องการฟ้องร้องดำเนินคดี' },
  { value: 'consultation', label: 'ปรึกษาทั่วไป', description: 'ต้องการคำปรึกษาเท่านั้น' },
  { value: 'bail', label: 'ประกันตัว', description: 'ต้องการยื่นประกันตัว', disabled: true },
];

const caseTypeOptions: { value: CaseType; label: string; icon: React.ReactNode }[] = [
  { value: 'civil', label: 'คดีแพ่ง', icon: <Scale className="w-6 h-6" /> },
  { value: 'criminal', label: 'คดีอาญา', icon: <Gavel className="w-6 h-6" /> },
  { value: 'corporate', label: 'นิติบุคคล', icon: <Building2 className="w-6 h-6" /> },
];

interface CaseInfoFormProps {
  onNext: () => void;
}

export function CaseInfoForm({ onNext }: CaseInfoFormProps) {
  const { caseStatus, caseType, caseSubtypeId, caseDescription, selectedProvince, setCaseInfo, setProvince } = useBookingStore();

  const selectedCaseType = mockCaseTypes.find((ct) => ct.code === caseType);

  const isComplete = caseStatus && caseType && selectedProvince;

  const handleNext = () => {
    if (!isComplete) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน', {
        description: 'กรุณาเลือกสถานะคดี ประเภทคดี และจังหวัด',
      });
      return;
    }
    toast.success('บันทึกข้อมูลคดีเรียบร้อย');
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Case Status */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">สถานะคดีของคุณ</Label>
        <div className="grid sm:grid-cols-3 gap-4">
          {caseStatusOptions.map((option) => (
            <Card
              key={option.value}
              className={cn(
                'transition-all',
                option.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'cursor-pointer hover:border-primary/50',
                caseStatus === option.value && 'border-primary bg-primary/5'
              )}
              onClick={() => !option.disabled && setCaseInfo({ caseStatus: option.value })}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold text-navy-dark mb-1">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Case Type */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">ประเภทคดี</Label>
        <div className="grid sm:grid-cols-3 gap-4">
          {caseTypeOptions.map((option) => (
            <Card
              key={option.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                caseType === option.value && 'border-primary bg-primary/5'
              )}
              onClick={() => setCaseInfo({ caseType: option.value, caseSubtypeId: undefined })}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={cn(
                    'w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center',
                    caseType === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {option.icon}
                </div>
                <p className="font-semibold text-navy-dark">{option.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Case Subtype */}
      {selectedCaseType && (
        <div className="space-y-2">
          <Label className="text-base font-semibold">ประเภทย่อย (ไม่บังคับ)</Label>
          <Select
            value={caseSubtypeId?.toString() || ''}
            onValueChange={(value) =>
              setCaseInfo({ caseSubtypeId: value ? parseInt(value) : undefined })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="เลือกประเภทย่อย" />
            </SelectTrigger>
            <SelectContent>
              {selectedCaseType.subtypes.map((subtype) => (
                <SelectItem key={subtype.id} value={subtype.id.toString()}>
                  {subtype.nameTh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Province Selection */}
      <div className="space-y-2">
        <Label className="text-base font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          จังหวัดที่ต้องการใช้บริการ
        </Label>
        <Select
          value={selectedProvince?.id.toString() || ''}
          onValueChange={(value) => {
            const province = mockProvinces.find((p) => p.id === parseInt(value));
            setProvince(province || null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกจังหวัด" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Object.entries(provincesByRegion).map(([region, provinces]) => (
              <SelectGroup key={region}>
                <SelectLabel className="font-semibold text-primary">
                  {regionLabels[region]}
                </SelectLabel>
                {provinces.map((province) => (
                  <SelectItem key={province.id} value={province.id.toString()}>
                    {province.nameTh}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          ระบบจะแสดงทนายความที่ให้บริการในจังหวัดที่เลือก
        </p>
      </div>

      {/* Case Description */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          รายละเอียดเบื้องต้น (ไม่บังคับ)
        </Label>
        <Textarea
          placeholder="อธิบายปัญหาหรือคำถามของคุณโดยสังเขป..."
          value={caseDescription}
          onChange={(e) => setCaseInfo({ caseDescription: e.target.value })}
          rows={4}
        />
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <HelpCircle className="w-4 h-4" />
          ข้อมูลนี้จะช่วยให้ทนายเตรียมตัวก่อนการปรึกษา
        </p>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleNext} disabled={!isComplete} className="w-full sm:w-auto min-h-[48px]">
          ถัดไป
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
