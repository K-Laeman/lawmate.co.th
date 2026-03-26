import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo';

export const metadata: Metadata = {
  title: PAGE_TITLES.corporate,
  description: PAGE_DESCRIPTIONS.corporate,
};

export default function CorporateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
