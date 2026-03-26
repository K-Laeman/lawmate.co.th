'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { mockProvinces, getProvincesByRegion } from '@/data/provinces';
import { mockCaseTypes, getSubtypeById } from '@/data/case-types';

export interface LawyerFilters {
  search: string;
  provinceId: number | null;
  caseType: 'civil' | 'criminal' | 'corporate' | null;
  subtypeId: number | null;
  isAvailable: boolean | null;
  sortBy: 'rating' | 'experience' | 'price' | 'reviews';
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  selectedTags: number[];
}

export const defaultFilters: LawyerFilters = {
  search: '',
  provinceId: null,
  caseType: null,
  subtypeId: null,
  isAvailable: null,
  sortBy: 'rating',
  minPrice: null,
  maxPrice: null,
  minRating: null,
  selectedTags: [],
};

interface LawyerFilterProps {
  filters: LawyerFilters;
  onFiltersChange: (filters: LawyerFilters) => void;
  resultCount: number;
}

const regions = [
  { id: 'central', name: 'ภาคกลาง' },
  { id: 'north', name: 'ภาคเหนือ' },
  { id: 'northeast', name: 'ภาคอีสาน' },
  { id: 'east', name: 'ภาคตะวันออก' },
  { id: 'west', name: 'ภาคตะวันตก' },
  { id: 'south', name: 'ภาคใต้' },
] as const;

const ratingOptions = [
  { label: 'ทุกคะแนน', value: null },
  { label: '4.5+ ดาว', value: 4.5 },
  { label: '4.0+ ดาว', value: 4.0 },
  { label: '3.5+ ดาว', value: 3.5 },
  { label: '3.0+ ดาว', value: 3.0 },
];

export function LawyerFilter({ filters, onFiltersChange, resultCount }: LawyerFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedCaseType = mockCaseTypes.find((ct) => ct.code === filters.caseType);

  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };

  const activeFilterCount = [
    filters.provinceId,
    filters.caseType,
    filters.subtypeId,
    filters.isAvailable !== null,
    filters.minRating !== null,
    filters.selectedTags && filters.selectedTags.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="ค้นหาทนายความ..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Sort Select */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value as LawyerFilters['sortBy'] })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="เรียงตาม" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">คะแนนสูงสุด</SelectItem>
            <SelectItem value="experience">ประสบการณ์</SelectItem>
            <SelectItem value="reviews">รีวิวมากสุด</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Button (Mobile) */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline ml-2">ตัวกรอง</span>
              {activeFilterCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-[2rem] p-0 flex flex-col">
            <SheetHeader className="px-6 py-4 border-b border-gray-100 flex-shrink-0">
              <SheetTitle className="text-xl font-bold text-navy-dark text-left">ตัวกรอง</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
              {/* Province Filter */}
              <div className="space-y-2">
                <Label>จังหวัด</Label>
                <Select
                  value={filters.provinceId?.toString() || 'all'}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, provinceId: value === 'all' ? null : parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ทุกจังหวัด" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกจังหวัด</SelectItem>
                    {regions.map((region) => (
                      <div key={region.id}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50">
                          {region.name}
                        </div>
                        {getProvincesByRegion(region.id).map((province) => (
                          <SelectItem key={province.id} value={province.id.toString()}>
                            {province.nameTh}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Case Type Filter */}
              <div className="space-y-2">
                <Label>ประเภทคดี</Label>
                <Select
                  value={filters.caseType || 'all'}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      caseType: value === 'all' ? null : value as LawyerFilters['caseType'],
                      subtypeId: null,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ทุกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกประเภท</SelectItem>
                    {mockCaseTypes.map((caseType) => (
                      <SelectItem key={caseType.code} value={caseType.code}>
                        {caseType.nameTh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subtype Filter */}
              {selectedCaseType && (
                <div className="space-y-2">
                  <Label>ประเภทย่อย</Label>
                  <Select
                    value={filters.subtypeId?.toString() || 'all'}
                    onValueChange={(value) =>
                      onFiltersChange({ ...filters, subtypeId: value === 'all' ? null : parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="ทุกประเภทย่อย" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกประเภทย่อย</SelectItem>
                      {selectedCaseType.subtypes.map((subtype) => (
                        <SelectItem key={subtype.id} value={subtype.id.toString()}>
                          {subtype.nameTh}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Rating Filter */}
              <div className="space-y-2">
                <Label>คะแนนขั้นต่ำ</Label>
                <Select
                  value={filters.minRating?.toString() || 'all'}
                  onValueChange={(value) =>
                    onFiltersChange({ ...filters, minRating: value === 'all' ? null : parseFloat(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ทุกคะแนน" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingOptions.map((option, index) => (
                      <SelectItem key={index} value={option.value?.toString() || 'all'}>
                        <span className="flex items-center gap-1">
                          {option.value && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <Label>สถานะ</Label>
                <Select
                  value={filters.isAvailable === null ? 'all' : filters.isAvailable.toString()}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      isAvailable: value === 'all' ? null : value === 'true',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="ทุกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="true">ว่างรับงาน</SelectItem>
                    <SelectItem value="false">ไม่ว่าง</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specialization Tags */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>ความเชี่ยวชาญ</Label>
                  {filters.selectedTags && filters.selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onFiltersChange({ ...filters, selectedTags: [] })}
                      className="text-xs text-gray-500 h-auto py-1"
                    >
                      ล้างทั้งหมด ({filters.selectedTags.length})
                    </Button>
                  )}
                </div>

                {/* Tag groups by case type */}
                <div className="space-y-4">
                  {mockCaseTypes.map((caseType) => (
                    <div key={caseType.code}>
                      <h4 className="text-xs font-medium text-gray-500 mb-1.5">{caseType.nameTh}</h4>
                      <div className="flex flex-wrap gap-2">
                        {caseType.subtypes.map((subtype) => {
                          const isSelected = filters.selectedTags && filters.selectedTags.includes(subtype.id);
                          return (
                            <Badge
                              key={subtype.id}
                              variant={isSelected ? 'default' : 'outline'}
                              className="cursor-pointer transition-colors"
                              onClick={() => {
                                const currentTags = filters.selectedTags || [];
                                const newTags = isSelected
                                  ? currentTags.filter((id) => id !== subtype.id)
                                  : [...currentTags, subtype.id];
                                onFiltersChange({ ...filters, selectedTags: newTags });
                              }}
                            >
                              {subtype.nameTh}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 gap-3 z-10 flex-row">
              <Button variant="outline" onClick={handleReset} className="flex-1 h-12 rounded-xl text-base font-medium">
                ล้างตัวกรอง
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1 h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20">
                ดูผลลัพธ์ ({resultCount})
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">ตัวกรอง:</span>

          {filters.provinceId && (
            <Badge variant="secondary" className="gap-1">
              {mockProvinces.find((p) => p.id === filters.provinceId)?.nameTh}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, provinceId: null })}
              />
            </Badge>
          )}

          {filters.caseType && (
            <Badge variant="secondary" className="gap-1">
              {mockCaseTypes.find((ct) => ct.code === filters.caseType)?.nameTh}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, caseType: null, subtypeId: null })}
              />
            </Badge>
          )}

          {filters.subtypeId && selectedCaseType && (
            <Badge variant="secondary" className="gap-1">
              {selectedCaseType.subtypes.find((st) => st.id === filters.subtypeId)?.nameTh}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, subtypeId: null })}
              />
            </Badge>
          )}

          {filters.minRating !== null && (
            <Badge variant="secondary" className="gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {filters.minRating}+
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, minRating: null })}
              />
            </Badge>
          )}

          {filters.isAvailable !== null && (
            <Badge variant="secondary" className="gap-1">
              {filters.isAvailable ? 'ว่างรับงาน' : 'ไม่ว่าง'}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFiltersChange({ ...filters, isAvailable: null })}
              />
            </Badge>
          )}

          {filters.selectedTags && filters.selectedTags.length > 0 && filters.selectedTags.map((tagId) => {
            const tagInfo = getSubtypeById(tagId);
            if (!tagInfo) return null;
            return (
              <Badge key={tagId} variant="secondary" className="gap-1">
                {tagInfo.subtype.nameTh}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => onFiltersChange({
                    ...filters,
                    selectedTags: (filters.selectedTags || []).filter((id) => id !== tagId)
                  })}
                />
              </Badge>
            );
          })}

          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500">
            ล้างทั้งหมด
          </Button>
        </div>
      )}
    </div>
  );
}
