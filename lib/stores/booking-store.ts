import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Lawyer, ServicePackage, Province } from '@/types';

export type CaseStatus = 'being_sued' | 'will_sue' | 'consultation' | 'bail';
export type CaseType = 'civil' | 'criminal' | 'corporate';

export interface BookingState {
  // Step tracking
  currentStep: number;

  // Hydration state for SSR
  _hasHydrated: boolean;

  // Case info
  caseStatus: CaseStatus | null;
  caseType: CaseType | null;
  caseSubtypeId: number | null;
  caseDescription: string;

  // Location
  selectedProvince: Province | null;

  // Lawyer & Package
  selectedLawyer: Lawyer | null;
  selectedPackage: ServicePackage | null;

  // Schedule
  selectedDate: Date | null;
  selectedTime: string | null;

  // Contact
  contactPhone: string;
  contactEmail: string;

  // Payment
  paymentMethod: 'promptpay' | 'bank_transfer' | null;

  // Terms consent
  termsAccepted: boolean;

  // Booking result
  bookingId: string | null;
  bookingCode: string | null;
  qrCodeUrl: string | null;
  paymentExpiresAt: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setCaseInfo: (info: {
    caseStatus?: CaseStatus;
    caseType?: CaseType;
    caseSubtypeId?: number;
    caseDescription?: string;
  }) => void;

  setProvince: (province: Province | null) => void;
  setLawyer: (lawyer: Lawyer | null) => void;
  setPackage: (pkg: ServicePackage | null) => void;
  setSchedule: (date: Date | null, time: string | null) => void;
  setContact: (phone: string, email: string) => void;
  setPaymentMethod: (method: 'promptpay' | 'bank_transfer') => void;
  setTermsAccepted: (accepted: boolean) => void;
  setBookingResult: (id: string, code: string, qrCodeUrl?: string, expiresAt?: string) => void;

  reset: () => void;

  // Computed
  getTotalPrice: () => number;
  getEndTime: () => string | null;
  isStepComplete: (step: number) => boolean;
}

const initialState = {
  currentStep: 1,
  _hasHydrated: false,
  caseStatus: null as CaseStatus | null,
  caseType: null as CaseType | null,
  caseSubtypeId: null as number | null,
  caseDescription: '',
  selectedProvince: null as Province | null,
  selectedLawyer: null as Lawyer | null,
  selectedPackage: null as ServicePackage | null,
  selectedDate: null as Date | null,
  selectedTime: null as string | null,
  contactPhone: '',
  contactEmail: '',
  paymentMethod: null as 'promptpay' | 'bank_transfer' | null,
  termsAccepted: false,
  bookingId: null as string | null,
  bookingCode: null as string | null,
  qrCodeUrl: null as string | null,
  paymentExpiresAt: null as string | null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      setCaseInfo: (info) =>
        set((state) => ({
          caseStatus: info.caseStatus ?? state.caseStatus,
          caseType: info.caseType ?? state.caseType,
          caseSubtypeId: info.caseSubtypeId ?? state.caseSubtypeId,
          caseDescription: info.caseDescription ?? state.caseDescription,
        })),

      setProvince: (province) => set({ selectedProvince: province }),

      setLawyer: (lawyer) => set({ selectedLawyer: lawyer }),

      setPackage: (pkg) => set({ selectedPackage: pkg }),

      setSchedule: (date, time) => set({ selectedDate: date, selectedTime: time }),

      setContact: (phone, email) => set({ contactPhone: phone, contactEmail: email }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      setBookingResult: (id, code, qrCodeUrl, expiresAt) =>
        set({
          bookingId: id,
          bookingCode: code,
          qrCodeUrl: qrCodeUrl || null,
          paymentExpiresAt: expiresAt || null,
        }),

      reset: () => set({ ...initialState, _hasHydrated: true }),

      getTotalPrice: () => {
        const { selectedPackage } = get();
        return selectedPackage?.price ?? 0;
      },

      getEndTime: () => {
        const { selectedTime, selectedPackage } = get();
        if (!selectedTime || !selectedPackage) return null;

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + selectedPackage.durationMinutes;
        const endHours = Math.floor(totalMinutes / 60);
        const endMins = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      },

      isStepComplete: (step) => {
        const state = get();
        switch (step) {
          case 1: // Case info
            return !!(state.caseStatus && state.caseType);
          case 2: // Package
            return !!state.selectedPackage;
          case 3: // Schedule
            return !!(state.selectedDate && state.selectedTime);
          case 4: // Contact
            return !!(state.contactPhone);
          default:
            return false;
        }
      },
    }),
    {
      name: 'lawmate-booking',
      storage: createJSONStorage(() => localStorage),
      // Only persist form data, not functions or computed values
      partialize: (state) => ({
        currentStep: state.currentStep,
        caseStatus: state.caseStatus,
        caseType: state.caseType,
        caseSubtypeId: state.caseSubtypeId,
        caseDescription: state.caseDescription,
        selectedProvince: state.selectedProvince,
        selectedLawyer: state.selectedLawyer,
        selectedPackage: state.selectedPackage,
        selectedDate: state.selectedDate,
        selectedTime: state.selectedTime,
        contactPhone: state.contactPhone,
        contactEmail: state.contactEmail,
        paymentMethod: state.paymentMethod,
        // Note: termsAccepted is intentionally NOT persisted
        // Users must explicitly accept terms for each booking session
      }),
      // Handle Date serialization
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
          // Restore Date object from ISO string
          if (state.selectedDate && typeof state.selectedDate === 'string') {
            state.selectedDate = new Date(state.selectedDate);
          }
        }
      },
    }
  )
);
