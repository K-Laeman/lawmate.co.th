'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import BackgroundPattern from '@/components/ui/BackgroundPattern'
import AnimationWrapper from '@/components/ui/AnimationWrapper'
import { GridPattern } from '@/components/ui/grid-pattern'
import { RichTextRenderer } from '@/components/ui/rich-text-renderer'
import { getIconWithFallback } from '@/lib/utils/icon-mapper'

interface FAQ {
  id: string
  question: string
  answer: unknown
  category: string
}

interface FAQCategory {
  id: string
  slug: string
  label: string
  icon: string
}

interface Hero {
  badge?: string
  headline: string
  subheadline: string
  searchPlaceholder?: string
}

interface EmptyState {
  icon?: string
  title?: string
  description?: string
  buttonText?: string
}

interface StillHaveQuestions {
  icon?: string
  title: string
  description?: string
  primaryButton?: {
    text?: string
    url?: string
  }
  secondaryButton?: {
    text?: string
    phone?: string
  }
}

interface FAQPageClientProps {
  hero: Hero
  faqs: FAQ[]
  categories: FAQCategory[]
  emptyState: EmptyState
  stillHaveQuestions: StillHaveQuestions
}

export function FAQPageClient({
  hero,
  faqs,
  categories,
  emptyState,
  stillHaveQuestions,
}: FAQPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  // Create full category list with "All" option
  const allCategories = useMemo(() => {
    return [{ id: 'all', slug: 'all', label: 'ทั้งหมด', icon: 'HelpCircle' }, ...categories]
  }, [categories])

  // Filter FAQs based on search and category
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch =
        !searchQuery || faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [faqs, searchQuery, activeCategory])

  const EmptyIcon = getIconWithFallback(emptyState.icon, 'HelpCircle')
  const StillQuestionsIcon = getIconWithFallback(stillHaveQuestions.icon, 'MessageCircle')

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
            'absolute inset-0 h-full w-full stroke-white/5 fill-white/5',
            '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
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
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">{hero.subheadline}</p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
              <Input
                type="text"
                placeholder={hero.searchPlaceholder || 'ค้นหาคำถาม...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
            {allCategories.map(category => {
              const Icon = getIconWithFallback(category.icon, 'HelpCircle')
              const isActive = activeCategory === category.slug
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.slug)}
                  className={cn(
                    'flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300',
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-navy-dark'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-gray-500')} />
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-20 bg-slate-50 relative min-h-[50vh]">
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          className={cn(
            'absolute inset-0 h-full w-full stroke-slate-200/50 fill-white/50',
            '[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]'
          )}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <AnimationWrapper animation="fade-in-up" delay={0.2}>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <EmptyIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-dark mb-2">
                    {emptyState.title || 'ไม่พบคำถามที่ค้นหา'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    {emptyState.description ||
                      'ลองใช้คำค้นหาอื่น หรือดูหมวดหมู่ทั้งหมด เพื่อค้นหาข้อมูลที่คุณต้องการ'}
                  </p>
                  <Button asChild size="lg" className="rounded-xl">
                    <Link href="/contact">{emptyState.buttonText || 'ติดต่อเจ้าหน้าที่'}</Link>
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id || index}
                      value={`faq-${faq.id || index}`}
                      className="bg-white rounded-2xl border border-slate-200 px-6 py-2 hover:border-primary/30 hover:shadow-md transition-all duration-300 data-[state=open]:border-primary/50 data-[state=open]:shadow-lg data-[state=open]:bg-white"
                    >
                      <AccordionTrigger className="text-left font-bold text-lg text-navy-dark hover:text-primary hover:no-underline py-5 [&[data-state=open]>svg]:text-primary">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pb-5 leading-relaxed text-base">
                        <RichTextRenderer content={faq.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </AnimationWrapper>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-white relative overflow-hidden">
        <BackgroundPattern variant="light" />
        <div className="absolute inset-0 bg-primary/5 clip-path-slant opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimationWrapper animation="scale-up">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <StillQuestionsIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-navy-dark mb-4 font-display">
              {stillHaveQuestions.title}
            </h2>
            {stillHaveQuestions.description && (
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                {stillHaveQuestions.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {stillHaveQuestions.primaryButton?.text && stillHaveQuestions.primaryButton?.url && (
                <Button
                  size="lg"
                  asChild
                  className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold"
                >
                  <Link href={stillHaveQuestions.primaryButton.url}>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {stillHaveQuestions.primaryButton.text}
                  </Link>
                </Button>
              )}
              {stillHaveQuestions.secondaryButton?.text &&
                stillHaveQuestions.secondaryButton?.phone && (
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="h-12 px-8 rounded-xl border-slate-200 hover:bg-slate-50 text-navy-dark font-medium"
                  >
                    <a href={`tel:${stillHaveQuestions.secondaryButton.phone}`}>
                      {stillHaveQuestions.secondaryButton.text}
                    </a>
                  </Button>
                )}
            </div>
          </AnimationWrapper>
        </div>
      </section>
    </>
  )
}

export default FAQPageClient
