'use client';

import { useMemo } from 'react';
import { Scale } from 'lucide-react';
import { LawyerCard } from './lawyer-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import type { Lawyer } from '@/types';
import type { LawyerFilters } from './lawyer-filter';

interface LawyerListProps {
  lawyers: Lawyer[];
  filters: LawyerFilters;
  isLoading?: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LawyerList({
  lawyers,
  filters,
  isLoading = false,
  currentPage,
  pageSize,
  onPageChange,
}: LawyerListProps) {
  const { filteredLawyers, totalCount } = useMemo(() => {
    let result = [...lawyers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (lawyer) =>
          lawyer.firstName.toLowerCase().includes(searchLower) ||
          lawyer.lastName.toLowerCase().includes(searchLower) ||
          lawyer.licenseNo.toLowerCase().includes(searchLower)
      );
    }

    // Province filter
    if (filters.provinceId) {
      result = result.filter((lawyer) =>
        lawyer.serviceAreas.some((area) => area.id === filters.provinceId)
      );
    }

    // Case type filter
    if (filters.caseType) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) => spec.caseType === filters.caseType)
      );
    }

    // Subtype filter
    if (filters.subtypeId) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) => spec.subtypeId === filters.subtypeId)
      );
    }

    // Tag filter (OR logic - lawyer matches ANY selected tag)
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) =>
          filters.selectedTags.includes(spec.subtypeId)
        )
      );
    }

    // Price range filter
    if (filters.minPrice !== null) {
      result = result.filter((lawyer) => lawyer.pricePerHour >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
      result = result.filter((lawyer) => lawyer.pricePerHour <= filters.maxPrice!);
    }

    // Rating filter
    if (filters.minRating !== null) {
      result = result.filter((lawyer) => lawyer.rating >= filters.minRating!);
    }

    // Availability filter
    if (filters.isAvailable !== null) {
      result = result.filter((lawyer) => lawyer.isAvailable === filters.isAvailable);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        result.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'price':
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'reviews':
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
    }

    const totalCount = result.length;

    // Pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedResult = result.slice(startIndex, startIndex + pageSize);

    return { filteredLawyers: paginatedResult, totalCount };
  }, [lawyers, filters, currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: pageSize }).map((_, i) => (
          <LawyerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredLawyers.length === 0) {
    // Get alternative lawyers (recommended or top-rated)
    const recommendedLawyers = lawyers
      .filter((l) => l.isAvailable && l.isRecommended)
      .slice(0, 3);

    // Fallback to top-rated if no recommended
    const alternativeLawyers =
      recommendedLawyers.length > 0
        ? recommendedLawyers
        : lawyers
            .filter((l) => l.isAvailable)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3);

    return (
      <div className="space-y-8">
        {/* Empty state message */}
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Scale className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-navy-dark mb-2">
            ไม่พบทนายความที่ตรงกับเงื่อนไข
          </h3>
          <p className="text-gray-500">
            ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น
          </p>
        </div>

        {/* Alternative lawyers section */}
        {alternativeLawyers.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-navy-dark mb-4">
              ทนายความแนะนำ
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alternativeLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Result Info */}
      <div className="flex items-center justify-between">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalCount}
        />
      </div>

      {/* Lawyer Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      )}
    </div>
  );
}

function LawyerCardSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-14" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Export filtered count for use in filter component
export function useFilteredLawyerCount(lawyers: Lawyer[], filters: LawyerFilters): number {
  return useMemo(() => {
    let result = [...lawyers];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (lawyer) =>
          lawyer.firstName.toLowerCase().includes(searchLower) ||
          lawyer.lastName.toLowerCase().includes(searchLower) ||
          lawyer.licenseNo.toLowerCase().includes(searchLower)
      );
    }

    if (filters.provinceId) {
      result = result.filter((lawyer) =>
        lawyer.serviceAreas.some((area) => area.id === filters.provinceId)
      );
    }

    if (filters.caseType) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) => spec.caseType === filters.caseType)
      );
    }

    if (filters.subtypeId) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) => spec.subtypeId === filters.subtypeId)
      );
    }

    // Tag filter (OR logic - lawyer matches ANY selected tag)
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      result = result.filter((lawyer) =>
        lawyer.specializations.some((spec) =>
          filters.selectedTags.includes(spec.subtypeId)
        )
      );
    }

    if (filters.minPrice !== null) {
      result = result.filter((lawyer) => lawyer.pricePerHour >= filters.minPrice!);
    }

    if (filters.maxPrice !== null) {
      result = result.filter((lawyer) => lawyer.pricePerHour <= filters.maxPrice!);
    }

    if (filters.minRating !== null) {
      result = result.filter((lawyer) => lawyer.rating >= filters.minRating!);
    }

    if (filters.isAvailable !== null) {
      result = result.filter((lawyer) => lawyer.isAvailable === filters.isAvailable);
    }

    return result.length;
  }, [lawyers, filters]);
}
