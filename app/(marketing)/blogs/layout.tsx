import type { Metadata } from 'next';
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from '@/lib/seo';

export const metadata: Metadata = {
  title: PAGE_TITLES.blogs,
  description: PAGE_DESCRIPTIONS.blogs,
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
