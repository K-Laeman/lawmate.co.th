import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Briefcase,
  Clock,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { GridPattern } from '@/components/ui/grid-pattern';
import { thaiDayNamesFull } from '@/data/lawyers';
import { getSubtypeById } from '@/data/case-types';
import { formatPrice } from '@/data/packages';
import { cn } from '@/lib/utils';
import { generateDynamicMetadata } from '@/lib/seo/metadata';
import { SITE_CONFIG } from '@/lib/seo/constants';
import type { Lawyer } from '@/types';
import { getLawyerPageSettings } from '@/lib/cms/getLawyerPageSettings';

// Utility function for getting availability for a specific day
function getAvailabilityForDay(
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>,
  dayOfWeek: number
) {
  return availability.find((a) => a.dayOfWeek === dayOfWeek && a.isActive) || null;
}

// Get full week schedule for a lawyer
function getWeekSchedule(
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>
) {
  const thaiDayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  return [1, 2, 3, 4, 5, 6, 0].map((dayIndex) => ({
    day: thaiDayNames[dayIndex],
    dayIndex,
    availability: getAvailabilityForDay(availability, dayIndex),
  }));
}

async function fetchLawyer(id: string): Promise<Lawyer | null> {
  try {
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
    const res = await fetch(`${dashboardUrl}/api/v1/lawyers/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const result = await res.json();
    if (!result.success || !result.data) return null;
    return result.data as Lawyer;
  } catch {
    return null;
  }
}

interface LawyerDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LawyerDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const lawyer = await fetchLawyer(id);

  if (!lawyer) {
    return {
      title: 'ไม่พบทนายความ | เพื่อนทนาย by LawMate',
    };
  }

  const fullName = `${lawyer.firstName} ${lawyer.lastName}`;
  const bio = lawyer.bio || '';
  const description = bio.length > 160
    ? bio.substring(0, 157) + '...'
    : bio;

  return generateDynamicMetadata({
    title: fullName,
    description: description || 'ทนายความผู้เชี่ยวชาญพร้อมให้คำปรึกษา',
    path: `/lawyers/${lawyer.id}`,
    ogImage: lawyer.profileImageUrl || undefined,
    type: 'profile',
  });
}

export default async function LawyerDetailPage({ params }: LawyerDetailPageProps) {
  const { id } = await params;
  const [lawyer, pageSettings] = await Promise.all([
    fetchLawyer(id),
    getLawyerPageSettings(),
  ]);

  if (!lawyer) {
    notFound();
  }

  const fullName = `${lawyer.firstName} ${lawyer.lastName}`;
  const initials = `${lawyer.firstName[0]}${lawyer.lastName[0]}`;

  // Get specialization details
  const specializations = lawyer.specializations.map((spec) => {
    const result = getSubtypeById(spec.subtypeId);
    return {
      caseType: result?.caseType.nameTh || '',
      subtype: result?.subtype.nameTh || '',
    };
  });

  // Get weekly schedule from lawyer availability
  const weekSchedule = getWeekSchedule(lawyer.availability || []);
  const today = new Date().getDay();

  return (
    <div className="bg-muted min-h-screen">
      {/* Page Header */}
      <section className="relative bg-navy-dark overflow-hidden pt-16 md:pt-28">
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
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="pt-6 pb-2">
            <Link
              href="/lawyers"
              className="inline-flex items-center text-blue-300 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              กลับไปหน้าค้นหา
            </Link>
          </div>

          {/* Lawyer Profile Hero */}
          <div className="pb-10 pt-4">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Avatar */}
              <Avatar className="w-28 h-28 md:w-32 md:h-32 ring-4 ring-white/20 flex-shrink-0">
                <AvatarImage src={lawyer.profileImageUrl || undefined} alt={fullName} />
                <AvatarFallback className="text-3xl font-bold bg-primary/30 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white font-display">
                    {fullName}
                  </h1>
                  <BadgeCheck className="w-6 h-6 text-primary flex-shrink-0" />
                </div>

                <p className="flex items-center justify-center md:justify-start gap-1.5 text-blue-300 text-sm mb-4">
                  <BadgeCheck className="w-4 h-4 text-green-400" />
                  {pageSettings.verificationBadgeText}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-5">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">
                      {lawyer.rating.toFixed(1)}
                    </span>
                    <span className="text-blue-300 text-sm">
                      ({lawyer.totalReviews} รีวิว)
                    </span>
                  </div>

                  <div className="w-px h-4 bg-white/20 hidden sm:block" />

                  <div className="flex items-center gap-1.5 text-blue-200">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{lawyer.totalCases} คดี</span>
                  </div>

                  <div className="w-px h-4 bg-white/20 hidden sm:block" />

                  <div className="flex items-center gap-1.5 text-blue-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">ประสบการณ์ {lawyer.experienceYears} ปี</span>
                  </div>
                </div>

                {/* Availability badge */}
                {lawyer.isAvailable ? (
                  <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                    ว่างรับงาน
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-white/10 text-blue-200 border-white/20">
                    ไม่ว่าง
                  </Badge>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-3 md:self-center flex-shrink-0">
                <Button size="lg" disabled={!lawyer.isAvailable} asChild className="shadow-lg">
                  <Link href={`/booking?lawyer=${lawyer.id}`}>
                    <Calendar className="mr-2 w-5 h-5" />
                    นัดหมายปรึกษา
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  ประวัติและความเชี่ยวชาญ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{lawyer.bio || 'ไม่มีข้อมูลประวัติ'}</p>
              </CardContent>
            </Card>

            {/* Specializations */}
            {specializations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ความเชี่ยวชาญ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        {spec.subtype}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Areas */}
            {lawyer.serviceAreas && lawyer.serviceAreas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    พื้นที่ให้บริการ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.serviceAreas.map((area) => (
                      <Badge key={area.id} variant="secondary">
                        {area.nameTh}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card>
              <CardHeader>
                <CardTitle>นัดหมายปรึกษา</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
<Button
                  className="w-full"
                  size="lg"
                  disabled={!lawyer.isAvailable}
                  asChild
                >
                  <Link href={`/booking?lawyer=${lawyer.id}`}>
                    <Calendar className="mr-2 w-5 h-5" />
                    เลือกวันนัดหมาย
                  </Link>
                </Button>

                {!lawyer.isAvailable && (
                  <p className="text-sm text-center text-gray-500">
                    ทนายความท่านนี้ไม่ว่างในขณะนี้
                  </p>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span>{pageSettings.licenseVerifiedText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span>{pageSettings.confidentialityText}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span>{pageSettings.moneyBackGuaranteeText}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  ตารางเวลา
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lawyer.availability && lawyer.availability.length > 0 ? (
                  <div className="space-y-2">
                    {weekSchedule.map((day) => (
                      <div
                        key={day.dayIndex}
                        className={cn(
                          'flex items-center justify-between py-2 px-3 rounded-lg',
                          day.dayIndex === today && 'bg-primary/5 ring-1 ring-primary/20'
                        )}
                      >
                        <span className={cn(
                          'font-medium',
                          day.dayIndex === today ? 'text-primary' : 'text-gray-700'
                        )}>
                          {thaiDayNamesFull[day.dayIndex]}
                          {day.dayIndex === today && (
                            <span className="ml-1 text-xs text-primary">(วันนี้)</span>
                          )}
                        </span>
                        {day.availability ? (
                          <span className="text-sm text-green-600">
                            {day.availability.startTime} - {day.availability.endTime}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">ไม่ว่าง</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="font-medium text-gray-700">ตรวจสอบเวลานัดหมาย</p>
                    <p className="text-sm text-gray-500">ติดต่อ admin เพื่อนัดหมายทนาย</p>
                    <p className="text-xs text-gray-400">(เวลาทนายคิวแน่น)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
