'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PaymentStatusData {
  consultationId: string;
  bookingCode: string;
  consultationStatus: string;
  consultationPaymentStatus: string;
  confirmedAt: string | null;
  payment: {
    id: string;
    status: string;
    amount: number;
    paidAt: string | null;
    expiresAt: string | null;
  } | null;
  isPaymentCompleted: boolean;
  isPaymentFailed: boolean;
  isPaymentExpired: boolean;
  isConfirmed: boolean;
}

interface UsePaymentStatusOptions {
  consultationId: string | null;
  pollingInterval?: number; // in milliseconds
  enabled?: boolean;
  onPaymentComplete?: (data: PaymentStatusData) => void;
  onPaymentFailed?: (data: PaymentStatusData) => void;
  onPaymentExpired?: (data: PaymentStatusData) => void;
}

interface UsePaymentStatusReturn {
  data: PaymentStatusData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for polling payment status from the backend
 * Automatically polls at the specified interval and stops when payment is complete/failed/expired
 */
export function usePaymentStatus({
  consultationId,
  pollingInterval = 5000, // Default 5 seconds
  enabled = true,
  onPaymentComplete,
  onPaymentFailed,
  onPaymentExpired,
}: UsePaymentStatusOptions): UsePaymentStatusReturn {
  const [data, setData] = useState<PaymentStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const fetchStatus = useCallback(async () => {
    if (!consultationId || !isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/consultations/${consultationId}/payment-status`);
      const result = await response.json();

      if (!isMountedRef.current) return;

      if (result.success) {
        const newData = result.data as PaymentStatusData;
        setData(newData);

        // Trigger callbacks
        if (newData.isPaymentCompleted && onPaymentComplete) {
          onPaymentComplete(newData);
        }
        if (newData.isPaymentFailed && onPaymentFailed) {
          onPaymentFailed(newData);
        }
        if (newData.isPaymentExpired && onPaymentExpired) {
          onPaymentExpired(newData);
        }

        // Stop polling if payment is in a terminal state
        if (newData.isPaymentCompleted || newData.isPaymentFailed || newData.isPaymentExpired) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } else {
        setError(result.error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      console.error('Error fetching payment status:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [consultationId, onPaymentComplete, onPaymentFailed, onPaymentExpired]);

  // Initial fetch and setup polling — pauses when tab is hidden to reduce API cost
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled || !consultationId) {
      return;
    }

    const startPolling = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(fetchStatus, pollingInterval);
    };

    const stopPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopPolling();
      } else {
        fetchStatus(); // Immediate fetch when tab regains focus
        startPolling();
      }
    };

    // Initial fetch and start polling
    fetchStatus();
    startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [consultationId, pollingInterval, enabled, fetchStatus]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}

export type { PaymentStatusData, UsePaymentStatusOptions, UsePaymentStatusReturn };
