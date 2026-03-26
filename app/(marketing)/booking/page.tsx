'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { CaseInfoForm } from '@/components/booking/case-info-form';
import { PackageSelector } from '@/components/booking/package-selector';
import { TimeSlotPicker } from '@/components/booking/time-slot-picker';
import { ContactForm } from '@/components/booking/contact-form';
import { BookingSummary } from '@/components/booking/booking-summary';
import { useBookingStore } from '@/lib/stores/booking-store';
import { cn } from '@/lib/utils';
import { GridPattern } from '@/components/ui/grid-pattern';
import type { Lawyer, ServicePackage } from '@/types';

const steps = [
  { id: 1, title: 'ข้อมูลคดี' },
  { id: 2, title: 'แพ็คเกจ' },
  { id: 3, title: 'วันเวลา' },
  { id: 4, title: 'ติดต่อ' },
  { id: 5, title: 'สรุป' },
];

function BookingContent() {
  const searchParams = useSearchParams();
  const { currentStep, setStep, setLawyer, setPackage } = useBookingStore();

  // Initialize from URL params using real API
  useEffect(() => {
    const lawyerId = searchParams.get('lawyer');
    const packageId = searchParams.get('package');

    async function loadInitialData() {
      const fetches: Promise<void>[] = [];

      if (lawyerId) {
        fetches.push(
          fetch(`/api/v1/lawyers/${lawyerId}`)
            .then((res) => res.json())
            .then((result) => {
              if (result.success && result.data) {
                setLawyer(result.data as Lawyer);
              }
            })
            .catch(() => {})
        );
      }

      if (packageId) {
        fetches.push(
          fetch(`/api/v1/packages?id=${packageId}`)
            .then((res) => res.json())
            .then((result) => {
              if (result.success && result.data) {
                setPackage(result.data as ServicePackage);
              }
            })
            .catch(() => {})
        );
      }

      await Promise.all(fetches);
    }

    loadInitialData();
  }, [searchParams, setLawyer, setPackage]);

  const handleNext = () => setStep(currentStep + 1);
  const handleBack = () => setStep(currentStep - 1);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="relative overflow-hidden bg-navy-dark pt-20 md:pt-36">
        <GridPattern
          width={40}
          height={40}
          className="absolute inset-0 stroke-white/10 fill-white/5 [mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
        />
        <div className="relative z-10 container-wide mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-white mb-6">นัดหมายปรึกษาทนาย</h1>

          {/* Step Indicator - Desktop */}
          <div className="hidden sm:flex items-center w-full max-w-5xl mx-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className={cn("flex items-center", index < steps.length - 1 ? "flex-1" : "")}>
                {/* Step Circle - Clickable for completed steps */}
                <button
                  type="button"
                  onClick={() => currentStep > step.id && setStep(step.id)}
                  disabled={currentStep <= step.id}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors shrink-0',
                    currentStep > step.id
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : currentStep === step.id
                        ? 'bg-primary text-white'
                        : 'bg-white/20 text-white/50 cursor-default'
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </button>

                {/* Step Title */}
                <span
                  className={cn(
                    'ml-3 text-sm font-medium whitespace-nowrap',
                    currentStep >= step.id ? 'text-white' : 'text-white/50'
                  )}
                >
                  {step.title}
                </span>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4',
                      currentStep > step.id ? 'bg-green-500' : 'bg-white/20'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Indicator - Mobile (simplified with current step highlight) */}
          <div className="sm:hidden">
            {/* Current Step Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-white/60">ขั้นตอนที่ {currentStep}/5:</span>
              <span className="font-semibold text-primary">
                {steps.find(s => s.id === currentStep)?.title}
              </span>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => currentStep > step.id && setStep(step.id)}
                  disabled={currentStep <= step.id}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all',
                    currentStep > step.id
                      ? 'bg-green-500 cursor-pointer'
                      : currentStep === step.id
                        ? 'bg-primary w-8'
                        : 'bg-white/30 cursor-default'
                  )}
                  aria-label={`ไปยัง${step.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && <CaseInfoForm onNext={handleNext} />}
        {currentStep === 2 && <PackageSelector onNext={handleNext} onBack={handleBack} />}
        {currentStep === 3 && <TimeSlotPicker onNext={handleNext} onBack={handleBack} />}
        {currentStep === 4 && <ContactForm onNext={handleNext} onBack={handleBack} />}
        {currentStep === 5 && <BookingSummary onBack={handleBack} />}
      </div>
    </div>
  );
}

function BookingLoading() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingContent />
    </Suspense>
  );
}
