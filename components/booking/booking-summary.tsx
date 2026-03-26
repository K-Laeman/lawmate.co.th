'use client';

import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Scale,
  Gavel,
  Building2,
  Clock,
  Phone,
  User,
  CreditCard,
  ArrowLeft,
  Loader2,
  Check,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBookingStore } from '@/lib/stores/booking-store';
import { mockCaseTypes, getSubtypeById } from '@/data/case-types';
import { formatPrice, formatDuration } from '@/data/packages';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TermsConsent } from './terms-consent';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

const caseTypeIcons: Record<string, React.ReactNode> = {
  civil: <Scale className="w-5 h-5" />,
  criminal: <Gavel className="w-5 h-5" />,
  corporate: <Building2 className="w-5 h-5" />,
};

const caseStatusLabels: Record<string, string> = {
  being_sued: 'ถูกฟ้อง',
  will_sue: 'จะฟ้อง',
  consultation: 'ปรึกษาทั่วไป',
  bail: 'ประกันตัว',
};

// Calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}

interface BookingSummaryProps {
  onBack: () => void;
}

export function BookingSummary({ onBack }: BookingSummaryProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    caseStatus,
    caseType,
    caseSubtypeId,
    caseDescription,
    selectedProvince,
    selectedLawyer,
    selectedPackage,
    selectedDate,
    selectedTime,
    contactPhone,
    contactEmail,
    paymentMethod,
    setPaymentMethod,
    termsAccepted,
    setTermsAccepted,
    setBookingResult,
  } = useBookingStore();

  const caseTypeInfo = mockCaseTypes.find((ct) => ct.code === caseType);
  const subtypeInfo = caseSubtypeId ? getSubtypeById(caseSubtypeId) : null;

  const handleConfirmClick = () => {
    if (!paymentMethod) {
      toast.error('กรุณาเลือกวิธีชำระเงิน');
      return;
    }
    if (!termsAccepted) {
      toast.error('กรุณายอมรับข้อกำหนดและเงื่อนไขการใช้งาน');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!selectedDate || !selectedTime || !selectedPackage || !paymentMethod) {
      toast.error('ข้อมูลการจองไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      // Prepare consultation data
      const pad = (n: number) => String(n).padStart(2, '0');
      const localDateStr = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;
      const scheduledDatetime = new Date(`${localDateStr}T${selectedTime}`).toISOString();

      const consultationData = {
        lawyerId: selectedLawyer?.id,
        packageId: typeof selectedPackage.id === 'string' ? parseInt(selectedPackage.id, 10) : selectedPackage.id,
        provinceId: selectedProvince?.id || 1, // Default to Bangkok if not selected
        caseStatus,
        caseType,
        caseSubtypeId: caseSubtypeId || undefined,
        caseDescription: caseDescription || undefined,
        scheduledDatetime,
        contactPhone,
        contactEmail: contactEmail || undefined,
        paymentMethod: paymentMethod,
      };

      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting consultation data:', consultationData);
      }

      // Call real API
      const response = await fetch('/api/v1/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) {
        let errorMessage = 'ไม่สามารถสร้างการจองได้';
        try {
          const errorData = await response.json();
          // Check for validation errors array
          if (errorData.error?.details?.length > 0) {
            errorMessage = errorData.error.details.map((d: { message: string }) => d.message).join(', ');
          } else {
            errorMessage = errorData.error?.message || errorMessage;
          }
        } catch {
          // Response body was not JSON
        }
        // Phone belongs to existing account — redirect to dashboard login
        if (errorMessage.includes('มีบัญชีผู้ใช้แล้ว')) {
          toast.error('กรุณาเข้าสู่ระบบก่อนทำการจอง', {
            description: 'หมายเลขโทรศัพท์นี้มีบัญชีอยู่แล้ว',
            action: {
              label: 'เข้าสู่ระบบ',
              onClick: () => { window.location.href = `${DASHBOARD_URL}/login?redirect=/booking`; },
            },
          });
          setIsSubmitting(false);
          return;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.data?.consultation || !result.data?.payment) {
        throw new Error('ได้รับข้อมูลไม่ถูกต้องจากเซิร์ฟเวอร์');
      }

      const { consultation, payment } = result.data;

      // Store booking result with payment info
      setBookingResult(
        consultation.id,
        consultation.bookingCode,
        payment.qrCodeUrl,
        payment.expiresAt
      );

      toast.success('สร้างการจองสำเร็จ', {
        description: `รหัสการจอง: ${consultation.bookingCode}`,
      });

      // Redirect to payment page
      router.push('/booking/payment');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = paymentMethod !== null && termsAccepted;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        {/* Left Column - Consent only */}
        <div className="lg:col-span-2 space-y-6">
          {/* Terms Consent */}
          <TermsConsent
            accepted={termsAccepted}
            onAcceptedChange={setTermsAccepted}
          />
        </div>

        {/* Right Column - Summary & Details */}
        <div className="space-y-6">
          {/* Details Section */}
          <div className="space-y-6">
            {/* Case Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {caseType && caseTypeIcons[caseType]}
                  ข้อมูลคดี
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">สถานะ</span>
                  <span className="font-medium text-right">{caseStatus && caseStatusLabels[caseStatus]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ประเภทคดี</span>
                  <span className="font-medium text-right">{caseTypeInfo?.nameTh}</span>
                </div>
                {subtypeInfo && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">ประเภทย่อย</span>
                    <span className="font-medium text-right">{subtypeInfo.subtype.nameTh}</span>
                  </div>
                )}
                {selectedProvince && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      จังหวัด
                    </span>
                    <span className="font-medium text-right">{selectedProvince.nameTh}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lawyer Info (if selected) */}
            {selectedLawyer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    ทนายความ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedLawyer.profileImageUrl} />
                      <AvatarFallback>
                        {selectedLawyer.firstName[0]}{selectedLawyer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">
                        {selectedLawyer.firstName} {selectedLawyer.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ใบอนุญาตเลขที่ {selectedLawyer.licenseNo}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Package & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  แพ็คเกจและเวลา
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">แพ็คเกจ</span>
                  <span className="font-medium text-right">{selectedPackage?.nameTh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ระยะเวลา</span>
                  <span className="font-medium text-right">
                    {selectedPackage && formatDuration(selectedPackage.durationMinutes)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่</span>
                  <span className="font-medium text-right">
                    {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: th })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">เวลา</span>
                  <span className="font-medium text-right">
                    {selectedTime} - {selectedTime && selectedPackage && calculateEndTime(selectedTime, selectedPackage.durationMinutes)} น.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  ข้อมูลติดต่อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">โทรศัพท์</span>
                  <span className="font-medium text-right">{contactPhone}</span>
                </div>
                {contactEmail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">อีเมล</span>
                    <span className="font-medium text-right">{contactEmail}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  วิธีชำระเงิน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod || ''}
                  onValueChange={(value) =>
                    setPaymentMethod(value as 'promptpay' | 'bank_transfer')
                  }
                  className="space-y-2"
                >
                  <div
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer',
                      paymentMethod === 'promptpay' && 'border-primary bg-primary/5'
                    )}
                  >
                    <RadioGroupItem value="promptpay" id="promptpay" className="h-4 w-4" />
                    <Label htmlFor="promptpay" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">PromptPay QR</span>
                      <p className="text-xs text-gray-500">สแกน QR Code ชำระเงินทันที</p>
                    </Label>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">แนะนำ</Badge>
                  </div>

                  <div
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg border cursor-pointer',
                      paymentMethod === 'bank_transfer' && 'border-primary bg-primary/5'
                    )}
                  >
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" className="h-4 w-4" />
                    <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">โอนเงินผ่านธนาคาร</span>
                      <p className="text-xs text-gray-500">โอนเงินและแนบหลักฐาน</p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Price Summary Panel */}
          <Card>
            <CardHeader>
              <CardTitle>สรุปค่าใช้จ่าย</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">ค่าปรึกษา ({selectedPackage?.nameTh})</span>
                <span>{selectedPackage && formatPrice(selectedPackage.price)} บาท</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>รวมทั้งหมด</span>
                <span className="text-primary">
                  {selectedPackage && formatPrice(selectedPackage.price)} บาท
                </span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleConfirmClick}
                disabled={!isComplete || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    กำลังสร้างการจอง...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    ยืนยันและชำระเงิน
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                เมื่อกดยืนยัน คุณจะถูกนำไปหน้าชำระเงิน
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Button variant="outline" size="lg" onClick={onBack} disabled={isSubmitting} className="w-full sm:w-auto min-h-[48px]">
          <ArrowLeft className="mr-2 w-5 h-5" />
          ย้อนกลับ
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              ยืนยันการจอง
            </DialogTitle>
            <DialogDescription>
              กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {/* Lawyer Info */}
            {selectedLawyer && (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedLawyer.profileImageUrl} />
                    <AvatarFallback>
                      {selectedLawyer.firstName[0]}{selectedLawyer.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {selectedLawyer.firstName} {selectedLawyer.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      ใบอนุญาตเลขที่ {selectedLawyer.licenseNo}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">แพ็คเกจ</span>
              <span className="font-medium">{selectedPackage?.nameTh}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">วันที่</span>
              <span className="font-medium">
                {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: th })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">เวลา</span>
              <span className="font-medium">{selectedTime} น.</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>ยอดชำระ</span>
              <span className="text-primary">
                {selectedPackage && formatPrice(selectedPackage.price)} บาท
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmit}>
              <Check className="mr-2 w-4 h-4" />
              ยืนยันการจอง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
