'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { mockFAQs } from '@/data/testimonials';
import type { FAQ as CMSFAQ } from '@/lib/cms';
import { extractTextFromLexical } from '@/lib/cms/lexical-utils';

import AnimationWrapper from '../ui/AnimationWrapper';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '@/lib/utils';

interface SectionHeader {
  label?: string;
  title?: string;
  description?: string;
  contactNote?: string;
}

interface FAQSectionProps {
  faqs?: CMSFAQ[];
  sectionHeader?: SectionHeader;
}

export function FAQSection({ faqs, sectionHeader }: FAQSectionProps) {
  // Use CMS data if available, otherwise fall back to mock data
  const data = faqs && faqs.length > 0
    ? faqs.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: extractTextFromLexical(faq.answer),
        category: faq.category,
      }))
    : mockFAQs;
  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-white">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full stroke-blue-500/5 fill-blue-500/5",
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />
      
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            {sectionHeader?.label || 'คำถามที่พบบ่อย'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-dark mb-4 font-display">
            {sectionHeader?.title || 'มีคำถาม? เรามีคำตอบ'}
          </h2>
          <p className="text-gray-600 text-lg">
            {sectionHeader?.description || 'คำถามที่พบบ่อยเกี่ยวกับการใช้บริการเพื่อนทนาย'}
          </p>
        </AnimationWrapper>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <AnimationWrapper animation="fade-in" delay={0.2}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {data.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-slate-200 rounded-xl px-6 bg-white hover:border-primary/30 transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:shadow-md data-[state=open]:bg-slate-50/50"
                >
                  <AccordionTrigger className="text-left font-bold text-navy-dark hover:text-primary hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-6 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimationWrapper>
        </div>

        {/* Contact Note */}
        <div className="text-center mt-12">
          <AnimationWrapper animation="fade-in" delay={0.4}>
            <p className="text-gray-500 bg-slate-50 inline-block px-6 py-3 rounded-full border border-slate-100">
              ยังมีคำถามเพิ่มเติม?{' '}
              <a href="#contact" className="text-primary font-bold hover:underline">
                ติดต่อทีมงาน
              </a>
            </p>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
