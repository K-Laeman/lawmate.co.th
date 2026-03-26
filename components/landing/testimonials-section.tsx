'use client';

import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { mockTestimonials } from '@/data/testimonials';
import type { Testimonial as CMSTestimonial } from '@/lib/cms';
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

interface TestimonialsSectionProps {
  testimonials?: CMSTestimonial[];
  sectionHeader?: SectionHeader;
}

export function TestimonialsSection({ testimonials, sectionHeader }: TestimonialsSectionProps) {
  // Use CMS data if available, otherwise fall back to mock data
  // Transform CMS data to match expected structure (authorName -> userName)
  const data = testimonials && testimonials.length > 0
    ? testimonials.map((t) => ({
        id: t.id,
        userName: t.authorName,
        rating: t.rating,
        quote: t.quote,
        caseType: t.caseType,
        date: t.date,
      }))
    : mockTestimonials;
  return (
    <section className="section-padding relative overflow-hidden text-white">
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

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
            {sectionHeader?.label || 'รีวิวจากลูกค้า'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            {sectionHeader?.title || 'เสียงจากผู้ใช้งานจริง'}
          </h2>
          <p className="text-gray-300 text-lg">
            {sectionHeader?.description || 'ดูว่าลูกค้าของเราพูดถึงประสบการณ์การใช้บริการอย่างไร'}
          </p>
        </AnimationWrapper>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" delayChildren={0.2}>
          {data.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Quote className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 leading-relaxed mb-8 flex-grow italic">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* User Info */}
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar className="border-2 border-white/10">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                          {testimonial.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">
                          {testimonial.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(testimonial.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-blue-200 hover:bg-white/20 border-0">
                      {testimonial.caseType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
