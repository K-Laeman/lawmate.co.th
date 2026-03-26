import type { Metadata } from 'next';
import {
  getBlogPosts,
  getFeaturedBlogPosts,
  getBlogsPage,
  getBlogCategories,
  type BlogPost as CMSBlogPost,
  type BlogCategory as CMSBlogCategory,
} from '@/lib/cms';
import { transformCMSBlogPost } from '@/lib/cms/transformBlogPost';
import { mockBlogs, getFeaturedBlogs } from '@/data/blogs';
import { BlogsPageClient } from '@/components/blog/blogs-page-client';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { SITE_CONFIG } from '@/lib/seo/constants';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const blogsPage = await getBlogsPage('th');

  return generatePageMetadata({
    title: blogsPage?.seo?.metaTitle || 'บทความกฎหมาย | เพื่อนทนาย',
    description:
      blogsPage?.seo?.metaDescription ||
      'เรียนรู้ความรู้กฎหมายที่จำเป็น อัพเดทข่าวสารกฎหมายใหม่ และเคล็ดลับปกป้องสิทธิของคุณ',
    path: '/blogs',
    ogImage: blogsPage?.seo?.ogImage?.url,
  });
}

export default async function BlogsPage() {
  const [blogsPage, blogResult, featuredCMS, cmsCategories] = await Promise.all([
    getBlogsPage('th'),
    getBlogPosts('th', { limit: 50 }),
    getFeaturedBlogPosts('th', 3),
    getBlogCategories('th'),
  ]);

  // Transform CMS data to frontend format, fall back to mock data
  const hasCMSBlogs = (blogResult?.docs?.length ?? 0) > 0;
  const blogs = hasCMSBlogs
    ? blogResult.docs.map(transformCMSBlogPost)
    : mockBlogs;
  const featured = hasCMSBlogs && (featuredCMS?.length ?? 0) > 0
    ? featuredCMS.map(transformCMSBlogPost)
    : getFeaturedBlogs(3);

  // Build categories from CMS data or use defaults
  const categories = (cmsCategories?.length ?? 0) > 0
    ? [
        { id: 'all' as const, label: 'ทั้งหมด', slug: 'all' },
        ...cmsCategories.map((c) => ({ id: c.slug || '', label: c.name || '', slug: c.slug || '' })),
      ]
    : [
        { id: 'all' as const, label: 'ทั้งหมด', slug: 'all' },
        { id: 'civil', label: 'กฎหมายแพ่ง', slug: 'civil' },
        { id: 'criminal', label: 'กฎหมายอาญา', slug: 'criminal' },
        { id: 'corporate', label: 'กฎหมายธุรกิจ', slug: 'corporate' },
        { id: 'general', label: 'ทั่วไป', slug: 'general' },
      ];

  // Hero content from CMS or defaults
  const hero = blogsPage?.hero ?? {
    badge: 'Knowledge Hub',
    headline: 'บทความกฎหมาย',
    subheadline: 'เรียนรู้ความรู้กฎหมายที่จำเป็น อัพเดทข่าวสารกฎหมายใหม่ และเคล็ดลับปกป้องสิทธิของคุณ',
    searchPlaceholder: 'ค้นหาบทความ...',
  };

  const cta = blogsPage?.cta ?? {
    headline: 'มีคำถามกฎหมาย?',
    description: 'หากคุณมีปัญหากฎหมายที่ต้องการปรึกษา ทนายความของเราพร้อมช่วยเหลือคุณ',
  };

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'หน้าแรก', url: SITE_CONFIG.url },
    { name: 'บทความกฎหมาย', url: `${SITE_CONFIG.url}/blogs` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd} />
      <main className="overflow-hidden">
        <BlogsPageClient
          blogs={blogs}
          featuredBlogs={featured}
          categories={categories}
          hero={hero}
          cta={cta}
        />
      </main>
    </>
  );
}
