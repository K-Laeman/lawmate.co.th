'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog/blog-card';
import { getLatestBlogs } from '@/data/blogs';
import type { BlogPost as CMSBlogPost } from '@/lib/cms';
import { transformCMSBlogPost } from '@/lib/cms/transformBlogPost';
import BackgroundPattern from '../ui/BackgroundPattern';
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '@/lib/utils';

interface SectionHeader {
  label?: string;
  title?: string;
  description?: string;
}

interface BlogsSectionProps {
  blogs?: CMSBlogPost[];
  sectionHeader?: SectionHeader;
}

export function BlogsSection({ blogs, sectionHeader }: BlogsSectionProps) {
  // Use CMS data if available, otherwise fall back to mock data
  const latestBlogs = blogs && blogs.length > 0
    ? blogs.map(transformCMSBlogPost)
    : getLatestBlogs(3);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-slate-50">
      <BackgroundPattern variant="light" />
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full stroke-slate-200 fill-slate-50",
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center mb-12">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            {sectionHeader?.label || 'บทความน่ารู้'}
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
            {sectionHeader?.title || 'บทความกฎหมาย'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {sectionHeader?.description || 'เรียนรู้ความรู้กฎหมายที่จำเป็น อัพเดทข่าวสารใหม่ และเคล็ดลับปกป้องสิทธิของคุณ'}
          </p>
        </AnimationWrapper>

        {/* Blog Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10" delayChildren={0.2}>
          {latestBlogs.map((blog) => (
             <motion.div
              key={blog.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="h-full"
            >
              <div className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl bg-white border border-slate-100 overflow-hidden">
                <BlogCard blog={blog} />
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <div className="text-center">
          <AnimationWrapper animation="fade-in" delay={0.4}>
            <Button variant="outline" size="lg" asChild className="rounded-xl border-slate-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300">
              <Link href="/blogs" className="flex items-center gap-2">
                ดูบทความทั้งหมด
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
