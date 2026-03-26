'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Lawyer } from '@/types';

interface UseLawyersOptions {
  initialData?: Lawyer[];
}

interface UseLawyersReturn {
  lawyers: Lawyer[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching lawyers from the API
 * Fetches all approved lawyers for client-side filtering
 */
export function useLawyers(options: UseLawyersOptions = {}): UseLawyersReturn {
  const [lawyers, setLawyers] = useState<Lawyer[]>(options.initialData || []);
  const [isLoading, setIsLoading] = useState(!options.initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/lawyers?limit=100&isAvailable=true`);
      const result = await response.json();

      if (result.success) {
        // Transform API response to match Lawyer type
        const lawyersArray = Array.isArray(result.data) ? result.data : result.data?.data || [];
        const transformedLawyers: Lawyer[] = lawyersArray.map((lawyer: any) => ({
          id: lawyer.id,
          firstName: lawyer.firstName,
          lastName: lawyer.lastName,
          licenseNo: lawyer.licenseNo,
          profileImageUrl: lawyer.profileImageUrl || '',
          bio: lawyer.bio || '',
          experienceYears: lawyer.experienceYears,
          rating: lawyer.rating,
          totalReviews: lawyer.totalReviews,
          totalCases: lawyer.totalCases,
          isAvailable: lawyer.isAvailable,
          pricePerHour: lawyer.pricePerHour,
          specializations: lawyer.specializations || [],
          serviceAreas: lawyer.serviceAreas || [],
          isRecommended: lawyer.isRecommended ?? false,
        }));

        setLawyers(transformedLawyers);
      } else {
        setError(result.error?.message || 'ไม่สามารถโหลดข้อมูลทนายความได้');
      }
    } catch (err) {
      console.error('Error fetching lawyers:', err);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!options.initialData) {
      fetchLawyers();
    }
  }, [fetchLawyers, options.initialData]);

  return {
    lawyers,
    isLoading,
    error,
    refetch: fetchLawyers,
  };
}

interface UseLawyerDetailReturn {
  lawyer: Lawyer | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching a single lawyer's details
 */
export function useLawyerDetail(lawyerId: string | null): UseLawyerDetailReturn {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(!!lawyerId);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyer = useCallback(async () => {
    if (!lawyerId) {
      setLawyer(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/lawyers/${lawyerId}`);
      const result = await response.json();

      if (result.success) {
        const data = result.data;
        setLawyer({
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          licenseNo: data.licenseNo,
          profileImageUrl: data.profileImageUrl || '',
          bio: data.bio || '',
          experienceYears: data.experienceYears,
          rating: data.rating,
          totalReviews: data.totalReviews,
          totalCases: data.totalCases,
          isAvailable: data.isAvailable,
          pricePerHour: data.pricePerHour,
          specializations: data.specializations || [],
          serviceAreas: data.serviceAreas || [],
          isRecommended: data.isRecommended ?? false,
        });
      } else {
        setError(result.error?.message || 'ไม่พบทนายความที่ระบุ');
      }
    } catch (err) {
      console.error('Error fetching lawyer:', err);
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setIsLoading(false);
    }
  }, [lawyerId]);

  useEffect(() => {
    fetchLawyer();
  }, [fetchLawyer]);

  return {
    lawyer,
    isLoading,
    error,
    refetch: fetchLawyer,
  };
}
