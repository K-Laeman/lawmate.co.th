import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogCard } from '@/components/blog/blog-card';
import { BlogHeroImage } from '@/components/blog/blog-hero-image';
import {
  getBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getBlogsPage,
} from '@/lib/cms';
import { transformCMSBlogPost } from '@/lib/cms/transformBlogPost';
import { getBlogBySlug, getRelatedBlogs, mockBlogs } from '@/data/blogs';
import { generateDynamicMetadata } from '@/lib/seo/metadata';
import { generateArticleJsonLd, generateBreadcrumbJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { SITE_CONFIG } from '@/lib/seo/constants';
import { RichTextRenderer, getNodeText, slugifyText } from '@/components/ui/rich-text-renderer';
import { TableOfContents, type TocItem } from '@/components/blog/table-of-contents';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import AnimationWrapper from '@/components/ui/AnimationWrapper';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Try CMS first, fall back to mock data
  const result = await getBlogPosts('th', { limit: 100 });
  if (result.docs.length > 0) {
    return result.docs.map((post) => ({
      slug: post.slug.startsWith('/') ? post.slug.slice(1) : post.slug,
    }));
  }
  return mockBlogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Try CMS first
  const cmsPost = await getBlogPostBySlug(slug, 'th');
  if (cmsPost) {
    const blog = transformCMSBlogPost(cmsPost);
    return generateDynamicMetadata({
      title: blog.title,
      description: blog.excerpt,
      path: `/blogs/${blog.slug}`,
      ogImage: blog.featuredImage,
      publishedTime: blog.publishedDate,
      authors: [blog.author],
      type: 'article',
    });
  }

  // Fall back to mock data
  const blog = getBlogBySlug(slug);
  if (!blog) {
    return { title: 'ไม่พบบทความ | เพื่อนทนาย' };
  }

  return generateDynamicMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${blog.slug}`,
    ogImage: blog.featuredImage,
    publishedTime: blog.publishedDate,
    authors: [blog.author],
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  // Fetch blog post and CMS page data in parallel
  const [cmsPost, blogsPage] = await Promise.all([
    getBlogPostBySlug(slug, 'th'),
    getBlogsPage('th'),
  ]);
  let blog;
  let relatedBlogs;
  let richTextContent: unknown = null;

  if (cmsPost) {
    blog = transformCMSBlogPost(cmsPost);
    richTextContent = cmsPost.content;

    // Get related posts from CMS
    const categorySlug = typeof cmsPost.category === 'object' ? cmsPost.category?.slug : '';
    const cmsRelated = categorySlug
      ? await getRelatedBlogPosts(slug, categorySlug, 'th', 3)
      : [];
    relatedBlogs = cmsRelated.length > 0
      ? cmsRelated.map(transformCMSBlogPost)
      : [];
  } else {
    // Fall back to mock data
    const mockBlog = getBlogBySlug(slug);
    if (!mockBlog) {
      notFound();
    }
    blog = mockBlog;
    relatedBlogs = getRelatedBlogs(slug);
  }

  const formattedDate = new Date(blog.publishedDate).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate Article JSON-LD
  const articleJsonLd = generateArticleJsonLd({
    title: blog.title,
    excerpt: blog.excerpt,
    imageUrl: blog.featuredImage ? `${SITE_CONFIG.url}${blog.featuredImage}` : undefined,
    author: blog.author,
    publishedDate: blog.publishedDate,
    url: `${SITE_CONFIG.url}/blogs/${blog.slug}`,
  });

  const blogDetailCta = blogsPage?.blogDetailCta

  // Extract headings for Table of Contents
  function extractHeadings(content: unknown): TocItem[] {
    const items: TocItem[] = []
    interface LexicalLike { root?: { children?: unknown[] }; type?: string; tag?: string; children?: unknown[] }
    function walk(node: LexicalLike) {
      if (node.type === 'heading' && (node.tag === 'h2' || node.tag === 'h3')) {
        const text = getNodeText(node as Parameters<typeof getNodeText>[0])
        const id = slugifyText(text)
        if (text && id) {
          items.push({ id, text, level: node.tag === 'h2' ? 2 : 3 })
        }
      }
      if (node.children) {
        for (const child of node.children) walk(child as LexicalLike)
      }
    }
    const lexical = content as LexicalLike
    if (lexical?.root?.children) {
      for (const child of lexical.root.children) walk(child as LexicalLike)
    }
    return items
  }

  function extractHeadingsFromMarkdown(content: string): TocItem[] {
    return content.split('\n').flatMap((line) => {
      if (line.startsWith('### ')) {
        const text = line.slice(4).trim()
        return [{ id: slugifyText(text), text, level: 3 }]
      }
      if (line.startsWith('## ')) {
        const text = line.slice(3).trim()
        return [{ id: slugifyText(text), text, level: 2 }]
      }
      return []
    })
  }

  const tocItems = richTextContent
    ? extractHeadings(richTextContent)
    : extractHeadingsFromMarkdown(blog.content || '')

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'หน้าแรก', url: SITE_CONFIG.url },
    { name: 'บทความกฎหมาย', url: `${SITE_CONFIG.url}/blogs` },
    { name: blog.title, url: `${SITE_CONFIG.url}/blogs/${blog.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <JsonLdScript data={breadcrumbJsonLd} />
      <main className="min-h-screen bg-white">
        {/* Primary backdrop — shows through transparent header, makes white nav text readable */}
        <div className="h-16 md:h-28 bg-primary" />
        {/* Back Navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blogs" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                กลับไปหน้าบทความ
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <section className="relative h-[400px] md:h-[500px] bg-gray-900 group overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <BlogHeroImage src={blog.featuredImage} alt={blog.title} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
           <GridPattern
            width={40}
            height={40}
            x={-1}
            y={-1}
            className={cn(
              "absolute inset-0 h-full w-full stroke-white/10 fill-white/5",
              "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
            )}
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
            <div className="container mx-auto">
              <AnimationWrapper animation="fade-in-up">
                <Badge className="bg-primary hover:bg-primary/90 text-white border-0 mb-4 px-4 py-1.5 text-base font-medium rounded-full">
                  {blog.categoryLabel}
                </Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white max-w-5xl leading-tight font-display drop-shadow-lg">
                  {blog.title}
                </h1>
              </AnimationWrapper>
            </div>
          </div>
        </section>

        {/* Meta Info */}
        <section className="border-b bg-white relative z-20 -mt-0">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>อ่าน {blog.readTime} นาที</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>โดย <span className="font-semibold text-navy-dark">{blog.author}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_256px] xl:gap-12 max-w-5xl mx-auto">
              <div>
                {/* Excerpt */}
                <p className="text-xl md:text-2xl text-gray-700 mb-10 font-medium leading-relaxed border-l-4 border-primary pl-6">
                  {blog.excerpt}
                </p>

                {/* Main Content */}
                <div className="max-w-none">
                  {richTextContent ? (
                    <RichTextRenderer content={richTextContent} />
                  ) : (
                    // Fallback: parse plain text content (mock data format)
                    (blog.content || '').split('\n\n').map((paragraph, index) => {
                      if (paragraph.startsWith('## ')) {
                        const text = paragraph.slice(3).trim()
                        return (
                          <h2 key={index} id={slugifyText(text)} className="text-2xl md:text-3xl font-bold text-navy-dark mt-12 mb-6 scroll-m-20">
                            {text}
                          </h2>
                        );
                      }
                      if (paragraph.startsWith('### ')) {
                        const text = paragraph.slice(4).trim()
                        return (
                          <h3 key={index} id={slugifyText(text)} className="text-xl md:text-2xl font-bold text-navy-dark mt-10 mb-4 scroll-m-20">
                            {text}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').map((item) => item.replace('- ', ''));
                        return (
                          <ul key={index} className="space-y-3 my-6">
                            {items.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={index} className="mb-6">
                          {paragraph}
                        </p>
                      );
                    })
                  )}
                </div>

                {/* Tags */}
                <div className="mt-16 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-gray-900">แท็ก:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(blog.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm px-4 py-1.5 bg-slate-100 text-gray-700 hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {tocItems.length > 1 && (
                <aside className="hidden xl:block">
                  <TableOfContents items={tocItems} />
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden bg-navy-dark">
          <BackgroundPattern variant="navy" />
           <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            className={cn(
              "absolute inset-0 h-full w-full stroke-white/5 fill-white/5",
              "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
            )}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6 font-display">
              {blogDetailCta?.heading || 'ต้องการปรึกษาทนายความ?'}
            </h2>
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              {blogDetailCta?.description || 'หากคุณมีปัญหากฎหมายที่เกี่ยวข้องกับบทความนี้ ทนายความของเราพร้อมให้คำปรึกษา'}
            </p>
            <Button size="lg" asChild className="rounded-xl bg-white text-navy-dark hover:bg-blue-50 font-bold px-8 h-12">
              <a href={blogDetailCta?.buttonUrl || '/lawyers'}>
                {blogDetailCta?.buttonText || 'ค้นหาทนายความ'}
              </a>
            </Button>
          </div>
        </section>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-navy-dark mb-6">
                {blogDetailCta?.relatedArticlesTitle || 'บทความที่เกี่ยวข้อง'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <BlogCard key={relatedBlog.id} blog={relatedBlog} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
