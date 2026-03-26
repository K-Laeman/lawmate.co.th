import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo';

export const metadata: Metadata = {
  title: PAGE_TITLES.contact,
  description: PAGE_DESCRIPTIONS.contact,
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
