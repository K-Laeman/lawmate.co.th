'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  CheckCircle,
  Calendar,
  Clock,
  Phone,
  Mail,
  Share2,
  Home,
  MessageCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useBookingStore } from '@/lib/stores/booking-store';
import { formatPrice, formatDuration } from '@/data/packages';
import { GridPattern } from '@/components/ui/grid-pattern';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

export default function ConfirmationPage() {
  const router = useRouter();
  const {
    bookingCode,
    bookingId,
    selectedLawyer,
    selectedPackage,
    selectedDate,
    selectedTime,
    contactPhone,
    contactEmail,
    reset,
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  // Fetch consultation data from backend to verify
  useEffect(() => {
    async function fetchConsultation() {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/v1/consultations/${bookingId}/payment-status`);
        const result = await response.json();

        if (result.success) {
          const data = result.data;
          if (data.isConfirmed) {
            setIsVerified(true);
          } else {
            setError('การชำระเงินยังไม่สำเร็จ');
          }
        } else {
          setError(result.error?.message || 'ไม่พบข้อมูลการจอง');
        }
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      } finally {
        setIsLoading(false);
      }
    }

    fetchConsultation();
  }, [bookingId]);

  // Redirect if no booking
  useEffect(() => {
    if (!bookingId || !selectedPackage) {
      router.replace('/booking');
    }
  }, [bookingId, selectedPackage, router]);

  const handleNewBooking = () => {
    reset();
    router.push('/booking');
  };

  const handleShare = async () => {
    const shareText = `นัดหมายปรึกษาทนาย LawMate\nรหัสการจอง: ${bookingCode}\nวันที่: ${selectedDate ? selectedDate.toLocaleDateString('th-TH') : ''} เวลา: ${selectedTime} น.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'นัดหมาย LawMate', text: shareText });
      } catch {
        // User cancelled share, ignore
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('คัดลอกข้อมูลการนัดหมายแล้ว');
    }
  };

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold text-navy-dark mb-2">
              กำลังตรวจสอบการจอง...
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if verification failed
  if (error || !isVerified) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-navy-dark mb-2">
              {error || 'การจองยังไม่เสร็จสมบูรณ์'}
            </h2>
            <p className="text-gray-600 mb-4">
              กรุณาตรวจสอบการชำระเงินหรือทำรายการใหม่
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/booking/payment')}>
                กลับไปชำระเงิน
              </Button>
              <Button onClick={handleNewBooking}>
                ทำรายการใหม่
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedPackage || !selectedDate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-navy-dark pt-24 md:pt-40 pb-10">
        <GridPattern
          width={40}
          height={40}
          className="absolute inset-0 stroke-white/10 fill-white/5 [mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        />
        <div className="relative z-10 container-wide mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">จองสำเร็จ!</h1>
          <p className="text-blue-100">ขอบคุณที่ใช้บริการเพื่อนทนาย</p>
        </div>
      </div>
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Booking Details */}
          <Card className="mb-6">
            <CardHeader className="text-center pb-2">
              <p className="text-sm text-gray-500">รหัสการจอง</p>
              <CardTitle className="text-2xl font-mono">{bookingCode}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date & Time */}
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-navy-dark text-lg">
                    {format(selectedDate, 'วันEEEE ที่ d MMMM yyyy', { locale: th })}
                  </p>
                  <p className="text-gray-600">
                    เวลา {selectedTime} น. ({formatDuration(selectedPackage.durationMinutes)})
                  </p>
                </div>
              </div>

              <Separator />

              {/* Package Info */}
              <div>
                <h3 className="font-semibold text-navy-dark mb-3">แพ็คเกจที่เลือก</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{selectedPackage.nameTh}</p>
                    <p className="text-sm text-gray-500">{selectedPackage.name}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">
                    {formatPrice(selectedPackage.price)} บาท
                  </p>
                </div>
              </div>

              {/* Lawyer Info */}
              {selectedLawyer && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-navy-dark mb-3">ทนายความ</h3>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedLawyer.profileImageUrl} />
                        <AvatarFallback>
                          {selectedLawyer.firstName[0]}{selectedLawyer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedLawyer.firstName} {selectedLawyer.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          ใบอนุญาตเลขที่ {selectedLawyer.licenseNo}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-navy-dark mb-3">ข้อมูลติดต่อ</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{contactPhone}</span>
                  </div>
                  {contactEmail && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">ขั้นตอนถัดไป</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-navy-dark">ตรวจสอบ SMS</p>
                    <p className="text-sm text-gray-500">
                      คุณจะได้รับ SMS ยืนยันการนัดหมายพร้อมรายละเอียด
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-navy-dark">เตรียมเอกสาร</p>
                    <p className="text-sm text-gray-500">
                      เตรียมเอกสารที่เกี่ยวข้องกับคดีของคุณให้พร้อม
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-navy-dark">รอรับสาย</p>
                    <p className="text-sm text-gray-500">
                      ทนายจะโทรหาคุณตามเวลาที่นัดหมาย
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Manage Booking at Dashboard */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-navy-dark mb-1">ต้องการจัดการการนัดหมาย?</p>
                  <p className="text-sm text-gray-600 mb-3">
                    ดูประวัติการจอง ดาวน์โหลดใบเสร็จ และติดตามสถานะได้ที่แดชบอร์ด
                  </p>
                  <a
                    href={`${DASHBOARD_URL}/dashboard/bookings`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                  >
                    ไปที่แดชบอร์ด
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Button variant="outline" size="lg" onClick={handleShare}>
              <Share2 className="mr-2 w-5 h-5" />
              แชร์การนัดหมาย
            </Button>
            <Button size="lg" onClick={handleNewBooking}>
              <MessageCircle className="mr-2 w-5 h-5" />
              จองใหม่อีกครั้ง
            </Button>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" size="lg" className="flex-1" asChild>
              <Link href="/">
                <Home className="mr-2 w-5 h-5" />
                กลับหน้าหลัก
              </Link>
            </Button>
          </div>

          {/* Support */}
          <p className="text-center text-sm text-gray-500 mt-8">
            มีคำถาม? ติดต่อเราได้ที่{' '}
            <a href="tel:024567890" className="text-primary font-medium">
              02-456-7890
            </a>{' '}
            หรือ Line:{' '}
            <a href="https://line.me/ti/p/@lawmate" className="text-primary font-medium">
              @lawmate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
