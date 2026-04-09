'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import {
  Clock,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  QrCode,
  Building,
  RefreshCw,
  Upload,
  ImageIcon,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useBookingStore } from '@/lib/stores/booking-store';
import { formatPrice } from '@/data/packages';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { GridPattern } from '@/components/ui/grid-pattern';

const DEFAULT_BANK_INFO = {
  bankName: 'ธนาคารกสิกรไทย',
  accountName: 'บริษัท ลอว์เมท จำกัด',
  accountNumber: '123-4-56789-0',
};

export default function PaymentPage() {
  const router = useRouter();
  const {
    selectedPackage,
    paymentMethod,
    bookingCode,
    bookingId,
    paymentExpiresAt,
    reset,
  } = useBookingStore();
  const [timeLeft, setTimeLeft] = useState(() => {
    if (paymentExpiresAt) {
      const remaining = Math.floor((new Date(paymentExpiresAt).getTime() - Date.now()) / 1000);
      return Math.max(0, remaining);
    }
    return 15 * 60;
  });
  const [copied, setCopied] = useState(false);
  const [isManualChecking, setIsManualChecking] = useState(false);
  const [localPaymentStatus, setLocalPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'expired'>('pending');
  const [bankInfo, setBankInfo] = useState(DEFAULT_BANK_INFO);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);
  const [slipSubmitted, setSlipSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is already logged in
  useEffect(() => {
    fetch('/api/v1/auth/session')
      .then((r) => r.json())
      .then((data) => { if (data.user) setIsLoggedIn(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/v1/payment-config')
      .then((r) => r.json())
      .then((result) => {
        if (result.success && result.data) {
          setBankInfo({
            bankName: result.data.bankName,
            accountName: result.data.accountName,
            accountNumber: result.data.accountNumber,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Payment status polling hook
  const { data: paymentStatusData, isLoading: isPolling, refetch } = usePaymentStatus({
    consultationId: bookingId,
    pollingInterval: 5000, // Poll every 5 seconds
    enabled: !!bookingId && localPaymentStatus === 'pending',
    onPaymentComplete: useCallback(() => {
      setLocalPaymentStatus('success');
      // Redirect to confirmation after a brief delay
      setTimeout(() => {
        router.push('/booking/confirmation');
      }, 1500);
    }, [router]),
    onPaymentFailed: useCallback(() => {
      setLocalPaymentStatus('failed');
    }, []),
    onPaymentExpired: useCallback(() => {
      setLocalPaymentStatus('expired');
    }, []),
  });

  // Redirect if no booking
  useEffect(() => {
    if (!bookingId || !selectedPackage) {
      router.replace('/booking');
    }
  }, [bookingId, selectedPackage, router]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || localPaymentStatus !== 'pending') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setLocalPaymentStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, localPaymentStatus]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์ต้องมีขนาดไม่เกิน 10 MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitSlip = async () => {
    if (!selectedFile || !bookingId) return;
    setIsUploadingSlip(true);
    try {
      // Step 1: Get presigned URL
      const docRes = await fetch('/api/v1/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
          consultationId: bookingId,
        }),
      });
      const docJson = await docRes.json();
      if (!docJson.success) throw new Error(docJson.error?.message || 'อัปโหลดไม่สำเร็จ');
      const { document, uploadUrl } = docJson.data;

      // Step 2: Upload file via proxy
      const uploadRes = await fetch(`/api/v1/proxy-upload?url=${encodeURIComponent(uploadUrl)}`, {
        method: 'PUT',
        credentials: 'include',
        body: selectedFile,
        headers: { 'Content-Type': selectedFile.type },
      });
      if (!uploadRes.ok) throw new Error('อัปโหลดไฟล์ไม่สำเร็จ');

      // Step 3: Submit slip
      const slipRes = await fetch(`/api/v1/consultations/${bookingId}/submit-slip`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, slipUrl: document.s3Url }),
      });
      const slipJson = await slipRes.json();
      if (!slipJson.success) throw new Error(slipJson.error?.message || 'ส่งสลิปไม่สำเร็จ');

      setSlipSubmitted(true);
      toast.success('ส่งหลักฐานการโอนเงินสำเร็จ');
    } catch (err: any) {
      toast.error(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsUploadingSlip(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Manual check payment — verifies directly with Omise then falls back to DB poll
  const handleManualCheck = async () => {
    setIsManualChecking(true);
    try {
      const res = await fetch(`/api/v1/consultations/${bookingId}/verify-payment`, {
        method: 'POST',
      });
      const result = await res.json();
      if (result.success && result.data?.isPaymentCompleted) {
        setLocalPaymentStatus('success');
        setTimeout(() => router.push('/booking/confirmation'), 1500);
        return;
      }
      if (result.success && result.data?.isPaymentFailed) {
        setLocalPaymentStatus('failed');
        return;
      }
      if (result.success && result.data?.isPaymentExpired) {
        setLocalPaymentStatus('expired');
        return;
      }
      // Payment still pending — show feedback
      toast.info('ยังไม่ได้รับการชำระเงิน', {
        description: 'กรุณาทำการชำระเงินแล้วรอสักครู่',
      });
    } catch {
      // Fallback to polling if verify endpoint fails
      await refetch();
    } finally {
      setIsManualChecking(false);
    }
  };

  if (!selectedPackage) {
    return null;
  }

  // Bank transfer slip submitted — show "under review" screen with LINE login CTA
  if (slipSubmitted && paymentMethod !== 'promptpay') {
    const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://app.lawmate.co.th';
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardContent className="pt-8 pb-8 space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-dark mb-2">
                อยู่ระหว่างตรวจสอบการชำระเงิน
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                เราได้รับหลักฐานการโอนเงินของคุณแล้ว<br />
                แอดมินจะตรวจสอบและยืนยันภายใน 1–2 ชั่วโมง
              </p>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              รหัสการจอง: {bookingCode}
            </div>
            <Separator />
            {isLoggedIn ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  ติดตามสถานะการนัดหมายได้ที่
                </p>
                <a href={`${DASHBOARD_URL}/dashboard/bookings`}>
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold h-12">
                    ไปที่ Dashboard
                  </Button>
                </a>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Login ด้วย LINE เพื่อติดตามการนัดหมาย<br />และรับการแจ้งเตือนอื่นๆ
                </p>
                <a href={`${DASHBOARD_URL}/api/v1/auth/line`}>
                  <Button className="w-full bg-[#06C755] hover:bg-[#05b34d] text-white font-semibold h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    เข้าสู่ระบบด้วย LINE
                  </Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (localPaymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-dark mb-2">
              ชำระเงินสำเร็จ!
            </h2>
            <p className="text-gray-600 mb-4">
              กำลังนำคุณไปหน้ายืนยันการจอง...
            </p>
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (localPaymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-navy-dark mb-2">
              การชำระเงินล้มเหลว
            </h2>
            <p className="text-gray-600 mb-4">
              กรุณาลองใหม่อีกครั้ง หรือติดต่อฝ่ายสนับสนุน
            </p>
            <Button onClick={() => router.push('/booking')} className="mt-4">
              ทำรายการใหม่
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-white mb-2">ชำระเงิน</h1>
          <p className="text-blue-100">
            รหัสการจอง: <span className="font-mono font-bold">{bookingCode}</span>
          </p>
        </div>
      </div>
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Timer Warning */}
          {timeLeft > 0 ? (
            <Card className="mb-6 border-yellow-300 bg-yellow-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">
                    กรุณาชำระเงินภายใน {formatTime(timeLeft)} นาที
                  </p>
                  <p className="text-sm text-yellow-700">
                    หากหมดเวลา การจองจะถูกยกเลิกอัตโนมัติ
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border-red-300 bg-red-50">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">หมดเวลาชำระเงิน</p>
                  <p className="text-sm text-red-700">กรุณาทำรายการใหม่อีกครั้ง</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {paymentMethod === 'promptpay' ? (
                  <>
                    <QrCode className="w-5 h-5" />
                    ชำระด้วย PromptPay
                  </>
                ) : (
                  <>
                    <Building className="w-5 h-5" />
                    โอนเงินผ่านธนาคาร
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentMethod === 'promptpay' ? (
                <div className="text-center">
                  {/* Real QR Code from Omise */}
                  <div className="w-64 h-64 mx-auto mb-4 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {bookingId ? (
                      <Image
                        src={`/api/v1/payments/qr-image/${bookingId}`}
                        alt="PromptPay QR Code"
                        width={256}
                        height={256}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-32 h-32 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">กำลังสร้าง QR Code...</p>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">
                    สแกน QR Code ด้วยแอปธนาคารของคุณ
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(selectedPackage.price)} บาท
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">ธนาคาร</span>
                      <span className="font-medium">{bankInfo.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">ชื่อบัญชี</span>
                      <span className="font-medium">{bankInfo.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">เลขบัญชี</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{bankInfo.accountNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(bankInfo.accountNumber.replace(/-/g, ''))}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">ยอดที่ต้องชำระ</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(selectedPackage.price)} บาท
                    </span>
                  </div>

                  <Separator />

                  {/* Slip Upload */}
                  {!slipSubmitted ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        แนบสลิปการโอนเงิน
                      </p>
                      {!selectedFile ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">คลิกเพื่อเลือกรูปสลิป</p>
                          <p className="text-xs text-gray-400">JPG, PNG, WebP ไม่เกิน 10 MB</p>
                        </button>
                      ) : (
                        <div className="relative">
                          <img
                            src={previewUrl!}
                            alt="ตัวอย่างสลิป"
                            className="w-full max-h-48 object-contain rounded-lg border bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 text-center truncate">{selectedFile.name}</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Button
                        className="w-full"
                        onClick={handleSubmitSlip}
                        disabled={!selectedFile || isUploadingSlip}
                      >
                        {isUploadingSlip ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            กำลังส่งหลักฐาน...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            ส่งหลักฐานการโอนเงิน
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">ส่งหลักฐานสำเร็จ</p>
                        <p className="text-xs text-green-700 mt-0.5">
                          แอดมินจะตรวจสอบและยืนยันการชำระเงินภายใน 1–2 ชั่วโมง
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* PromptPay only: status polling + manual check */}
          {paymentMethod === 'promptpay' && (
            <>
              {isPolling && localPaymentStatus === 'pending' && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังรอการชำระเงิน...</span>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleManualCheck}
                disabled={timeLeft <= 0 || isManualChecking || localPaymentStatus !== 'pending'}
              >
                {isManualChecking ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 w-5 h-5" />
                    ตรวจสอบสถานะการชำระเงิน
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 mt-4">
                ระบบจะตรวจสอบการชำระเงินอัตโนมัติทุก 5 วินาที
                <br />
                หรือกดปุ่มด้านบนเพื่อตรวจสอบทันที
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
