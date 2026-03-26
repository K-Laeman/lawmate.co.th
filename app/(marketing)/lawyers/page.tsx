import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LawyersPageClient } from '@/components/lawyers/lawyers-page-client';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { SITE_CONFIG } from '@/lib/seo/constants';
import { mockLawyers } from '@/data/lawyers';
import type { Lawyer } from '@/types';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'ค้นหาทนายความ | เพื่อนทนาย',
    description: 'ค้นหาทนายความที่ผ่านการรับรองจากสภาทนายความ เชี่ยวชาญในคดีแพ่ง อาญา และนิติบุคคล พร้อมให้คำปรึกษาออนไลน์',
    path: '/lawyers',
  });
}

async function fetchLawyers(): Promise<Lawyer[]> {
  try {
    const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
    const res = await fetch(`${dashboardUrl}/api/v1/lawyers?limit=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return mockLawyers;
    const result = await res.json();
    if (!result.success) return mockLawyers;
    const lawyersArray: unknown[] = Array.isArray(result.data) ? result.data : result.data?.data ?? [];
    if (lawyersArray.length === 0) return mockLawyers;
    return lawyersArray.map((l: any): Lawyer => ({
      id: l.id,
      firstName: l.firstName,
      lastName: l.lastName,
      licenseNo: l.licenseNo,
      profileImageUrl: l.profileImageUrl || '',
      bio: l.bio || '',
      experienceYears: l.experienceYears,
      rating: l.rating,
      totalReviews: l.totalReviews,
      totalCases: l.totalCases,
      isAvailable: l.isAvailable,
      pricePerHour: l.pricePerHour,
      specializations: l.specializations || [],
      serviceAreas: l.serviceAreas || [],
      isRecommended: l.isRecommended ?? false,
      isNationwide: l.isNationwide ?? false,
    }));
  } catch {
    return mockLawyers;
  }
}

export default async function LawyersPage() {
  const lawyers = await fetchLawyers();

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'หน้าแรก', url: SITE_CONFIG.url },
    { name: 'ค้นหาทนายความ', url: `${SITE_CONFIG.url}/lawyers` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd} />
      <Suspense>
        <LawyersPageClient initialLawyers={lawyers} />
      </Suspense>
    </>
  );
}
