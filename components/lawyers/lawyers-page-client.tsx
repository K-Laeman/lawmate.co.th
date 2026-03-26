'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LawyerCard } from './lawyer-card';
import { useLawyers } from '@/hooks/useLawyers';
import { Skeleton } from '@/components/ui/skeleton';
import { GridPattern } from '@/components/ui/grid-pattern';
import AnimationWrapper from '@/components/ui/AnimationWrapper';
import { cn } from '@/lib/utils';
import type { Lawyer } from '@/types';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

type CaseTypeFilter = 'all' | 'civil' | 'criminal' | 'corporate';

const CASE_TYPE_OPTIONS: { value: CaseTypeFilter; label: string }[] = [
  { value: 'all', label: 'ทุกประเภทคดี' },
  { value: 'civil', label: 'คดีแพ่ง' },
  { value: 'criminal', label: 'คดีอาญา' },
  { value: 'corporate', label: 'นิติบุคคล' },
];

interface LawyersPageClientProps {
  initialLawyers: Lawyer[];
}

export function LawyersPageClient({ initialLawyers }: LawyersPageClientProps) {
  const searchParams = useSearchParams();
  const urlProvinceId = searchParams.get('province') ? parseInt(searchParams.get('province')!, 10) : null;
  const urlCaseType = (searchParams.get('type') as CaseTypeFilter | null) ?? null;
  const urlAvailable = searchParams.get('available') === 'true';

  const [search, setSearch] = useState('');
  const [caseType, setCaseType] = useState<CaseTypeFilter>(urlCaseType ?? 'all');
  const [availableOnly, setAvailableOnly] = useState(urlAvailable);

  const { lawyers, isLoading } = useLawyers({ initialData: initialLawyers });

  const filtered = useMemo(() => {
    return lawyers.filter((l) => {
      // Province filter: exact match or nationwide
      if (urlProvinceId) {
        const servesProvince = l.serviceAreas.some((area) => area.id === urlProvinceId);
        if (!l.isNationwide && !servesProvince) return false;
      }
      if (availableOnly && !l.isAvailable) return false;
      if (caseType !== 'all' && !l.specializations.some((s) => s.caseType === caseType)) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = `${l.firstName} ${l.lastName}`.toLowerCase();
        const bio = (l.bio || '').toLowerCase();
        if (!name.includes(q) && !bio.includes(q)) return false;
      }
      return true;
    });
  }, [lawyers, search, caseType, availableOnly, urlProvinceId]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-navy-dark py-20 md:py-28 overflow-hidden">
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            'absolute inset-0 h-full w-full stroke-white/10 fill-white/5',
            '[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]'
          )}
        />
        <div className="container mx-auto px-4 relative z-10">
          <AnimationWrapper animation="fade-in-up">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 px-4 py-1.5 text-sm font-medium rounded-full">
                ทนายความที่ผ่านการรับรอง
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display mb-6 leading-tight">
                ค้นหาทนายความ
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                เลือกทนายความที่เชี่ยวชาญตรงกับประเภทคดีของคุณ ผ่านการรับรองจากสภาทนายความ
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อทนายความ หรือความเชี่ยวชาญ..."
                  className="pl-12 h-14 text-base rounded-2xl border-0 bg-white/10 text-white placeholder:text-blue-200 focus-visible:ring-white/30 focus-visible:bg-white/15"
                />
              </div>
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-2">
              {CASE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCaseType(opt.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                    caseType === opt.value
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setAvailableOnly((v) => !v)}
                className={cn(
                  'flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                  availableOnly
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-500 hover:text-green-600'
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', availableOnly ? 'bg-white' : 'bg-green-500')} />
                ว่างตอนนี้
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Count */}
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            {isLoading ? (
              <span>กำลังโหลด...</span>
            ) : (
              <span>พบทนายความ <span className="font-semibold text-gray-900">{filtered.length}</span> ท่าน</span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-[480px] rounded-[2rem]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">ไม่พบทนายความที่ตรงกัน</p>
              <p className="text-sm">ลองเปลี่ยนเงื่อนไขการค้นหา</p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => { setSearch(''); setCaseType('all'); setAvailableOnly(false); }}
              >
                ล้างตัวกรอง
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-50 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-navy-dark mb-3 font-display">ต้องการคำแนะนำเพิ่มเติม?</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            ทีมงานของเราพร้อมช่วยให้คุณเลือกทนายความที่เหมาะสมที่สุดสำหรับคดีของคุณ
          </p>
          <Button asChild size="lg" className="rounded-xl px-8">
            <a href={`${DASHBOARD_URL}/register`}>เริ่มต้นใช้งาน</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
