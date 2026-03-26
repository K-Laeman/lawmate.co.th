'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Gavel, Building2, MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { type CaseStatus, type CaseType } from '@/lib/stores/booking-store';
import { mockCaseTypes } from '@/data/case-types';
import { mockProvinces } from '@/data/provinces';
import { cn } from '@/lib/utils';

// Group provinces by region
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

const caseStatusLabels: Record<CaseStatus, string> = {
  being_sued: 'ถูกฟ้อง',
  will_sue: 'จะฟ้อง',
  consultation: 'ปรึกษาทั่วไป',
  bail: 'ประกันตัว',
};

const caseTypeOptions: { value: CaseType; label: string; icon: React.ReactNode }[] = [
  { value: 'civil', label: 'คดีแพ่ง', icon: <Scale className="w-5 h-5" /> },
  { value: 'criminal', label: 'คดีอาญา', icon: <Gavel className="w-5 h-5" /> },
  { value: 'corporate', label: 'อื่น ๆ/ไม่ทราบ', icon: <Building2 className="w-5 h-5" /> },
];

interface LawyerSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: CaseStatus | null;
}

export function LawyerSearchModal({ isOpen, onClose, initialStatus }: LawyerSearchModalProps) {
  const router = useRouter();
  const [caseType, setCaseType] = useState<CaseType | null>(null);
  const [subtypeId, setSubtypeId] = useState<number | null>(null);
  const [provinceId, setProvinceId] = useState<number | null>(null);

  const selectedCaseType = mockCaseTypes.find((ct) => ct.code === caseType);
  const isComplete = caseType && provinceId;

  const handleSearch = () => {
    if (!initialStatus || !isComplete) return;

    const params = new URLSearchParams();
    params.set('status', initialStatus);
    params.set('type', caseType);
    if (subtypeId) params.set('subtype', subtypeId.toString());
    params.set('province', provinceId.toString());
    params.set('available', 'true');

    window.location.href = `/lawyers?${params.toString()}`;
    handleClose();
  };

  const handleClose = () => {
    // Reset state when closing
    setCaseType(null);
    setSubtypeId(null);
    setProvinceId(null);
    onClose();
  };

  if (!initialStatus) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            ค้นหาทนายความ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Display */}
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">สถานะของคุณ</p>
            <p className="text-lg font-semibold text-primary">
              {caseStatusLabels[initialStatus]}
            </p>
          </div>

          {/* Case Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              ประเภทคดี <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {caseTypeOptions.map((option) => (
                <Card
                  key={option.value}
                  className={cn(
                    'cursor-pointer transition-all hover:border-primary/50',
                    caseType === option.value && 'border-primary bg-primary/5'
                  )}
                  onClick={() => {
                    setCaseType(option.value);
                    setSubtypeId(null); // Reset subtype when case type changes
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div
                      className={cn(
                        'w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center',
                        caseType === option.value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {option.icon}
                    </div>
                    <p className="text-sm font-medium text-navy-dark">{option.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subtype Selection (Conditional) */}
          {selectedCaseType && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">ประเภทย่อย (ไม่บังคับ)</Label>
              <div className="flex flex-wrap gap-2">
                {selectedCaseType.subtypes.map((subtype) => (
                  <button
                    key={subtype.id}
                    type="button"
                    onClick={() => setSubtypeId(subtypeId === subtype.id ? null : subtype.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all',
                      'border hover:border-primary/50',
                      subtypeId === subtype.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {subtype.nameTh}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Province Selection */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              จังหวัด <span className="text-red-500">*</span>
            </Label>
            <Select
              value={provinceId?.toString() || ''}
              onValueChange={(value) => setProvinceId(value ? parseInt(value) : null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือกจังหวัด" />
              </SelectTrigger>
              <SelectContent className="max-h-[250px]">
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
          </div>

          {/* Search Button */}
          <Button
            size="lg"
            className="w-full"
            onClick={handleSearch}
            disabled={!isComplete}
          >
            <Search className="w-5 h-5 mr-2" />
            ค้นหาทนายความ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
