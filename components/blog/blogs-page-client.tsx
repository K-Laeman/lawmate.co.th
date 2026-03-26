'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog/blog-card';
import { cn } from '@/lib/utils';
import type { BlogPost } from '@/types';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import AnimationWrapper, { StaggerContainer } from '@/components/ui/AnimationWrapper';
import { GridPattern } from '@/components/ui/grid-pattern';
import { motion } from 'framer-motion';

interface CategoryItem {
  id: string;
  label: string;
  slug: string;
}

interface HeroData {
  badge?: string;
  headline: string;
  subheadline: string;
  searchPlaceholder?: string;
}

interface CTAData {
  headline: string;
  description?: string;
  primaryButton?: { text?: string; url?: string };
  secondaryButton?: { text?: string; url?: string };
}

interface BlogsPageClientProps {
  blogs: BlogPost[];
  featuredBlogs: BlogPost[];
  categories: CategoryItem[];
  hero: HeroData;
  cta: CTAData;
}

export function BlogsPageClient({
  blogs,
  featuredBlogs,
  categories,
  hero,
  cta,
}: BlogsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        searchQuery === '' ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        activeCategory === 'all' || blog.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, activeCategory]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32 text-white">
        <BackgroundPattern variant="navy" />
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            "absolute inset-0 h-full w-full stroke-white/5 fill-white/5",
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimationWrapper animation="fade-in-up" className="max-w-3xl mx-auto">
            {hero.badge && (
              <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {hero.badge}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display">
              {hero.headline}
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              {hero.subheadline}
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                type="text"
                placeholder={hero.searchPlaceholder || 'ค้นหาบทความ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 py-7 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl focus-visible:bg-white focus-visible:text-navy-dark focus-visible:ring-offset-0 focus-visible:ring-primary/20 transition-all duration-300 shadow-lg"
              />
            </div>
          </AnimationWrapper>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b sticky top-16 z-30 shadow-sm/50 backdrop-blur-md bg-white/90 support-[backdrop-filter]:bg-white/90">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide justify-start lg:justify-center">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-navy-dark'
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Blogs (only shown when no search/filter) */}
      {activeCategory === 'all' && searchQuery === '' && featuredBlogs.length > 0 && (
        <section className="py-16 bg-white relative">
          <div className="container mx-auto px-4">
            <AnimationWrapper animation="fade-in-up" className="mb-10 flex items-end justify-between">
              <h2 className="text-3xl font-bold text-navy-dark font-display">
                บทความแนะนำ
              </h2>
            </AnimationWrapper>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" delayChildren={0.1}>
              {featuredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
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
          </div>
        </section>
      )}

      {/* All Blogs */}
      <section className="py-16 bg-slate-50 min-h-[50vh]">
        <div className="container mx-auto px-4">
          <AnimationWrapper animation="fade-in-up" className="mb-10">
            {activeCategory === 'all' && searchQuery === '' && (
              <h2 className="text-3xl font-bold text-navy-dark font-display">
                บทความทั้งหมด
              </h2>
            )}
            {activeCategory !== 'all' && (
              <h2 className="text-3xl font-bold text-navy-dark font-display">
                {categories.find((c) => c.id === activeCategory)?.label}
              </h2>
            )}
            {searchQuery !== '' && (
              <h2 className="text-3xl font-bold text-navy-dark font-display">
                ผลการค้นหา &quot;{searchQuery}&quot;
              </h2>
            )}
          </AnimationWrapper>

          {filteredBlogs.length === 0 ? (
            <AnimationWrapper animation="scale-up" className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy-dark mb-2">
                ไม่พบบทความที่ค้นหา
              </h3>
              <p className="text-gray-500 mb-8">
                ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="rounded-xl"
              >
                ดูบทความทั้งหมด
              </Button>
            </AnimationWrapper>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" delayChildren={0.2}>
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
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
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden text-white bg-navy-dark">
         <BackgroundPattern variant="hero" />
         <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          className={cn(
            "absolute inset-0 h-full w-full stroke-white/10 fill-white/10",
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
          )}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimationWrapper animation="scale-up" className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 font-display">
              {cta.headline}
            </h2>
            {cta.description && (
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                {cta.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="rounded-xl shadow-lg shadow-blue-900/20 px-8 py-6 text-base font-bold">
                <Link href={cta.primaryButton?.url || '/lawyers'}>
                  {cta.primaryButton?.text || 'ค้นหาทนายความ'}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl text-white border-white/20 hover:bg-white/10 px-8 py-6 text-base bg-transparent" asChild>
                <Link href={cta.secondaryButton?.url || '/contact'}>
                  {cta.secondaryButton?.text || 'ติดต่อเรา'}
                </Link>
              </Button>
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </>
  );
}
