'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { LawyerCard } from '@/components/lawyers/lawyer-card';
import { useLawyers } from '@/hooks/useLawyers';
import { cn } from '@/lib/utils';
import { GridPattern } from '../ui/grid-pattern';
import AnimationWrapper from '../ui/AnimationWrapper';
import { Skeleton } from '@/components/ui/skeleton';

type LawyerTab = 'recommended' | 'all';

export function LawyerSlider() {
  const [activeTab, setActiveTab] = useState<LawyerTab>('recommended');
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Fetch lawyers from API
  const { lawyers, isLoading } = useLawyers();

  // Filter lawyers based on tab
  const recommendedLawyers = useMemo(
    () => lawyers.filter((l) => l.isRecommended && l.isAvailable),
    [lawyers]
  );
  const allLawyers = useMemo(
    () => lawyers.filter((l) => l.isAvailable).slice(0, 8),
    [lawyers]
  );

  const displayLawyers = activeTab === 'recommended' ? recommendedLawyers : allLawyers;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      skipSnaps: false,
      dragFree: true,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Reset carousel when tab changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [activeTab, emblaApi]);

  return (
    <section id="lawyers" className="section-padding relative overflow-hidden bg-slate-50">
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <AnimationWrapper animation="fade-in-up">
            <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
              ทนายความของเรา
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-dark mb-4 font-display">
              พบทนายความที่เหมาะกับคุณ
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              ทนายความผู้เชี่ยวชาญที่ผ่านการคัดสรรอย่างดี พร้อมให้คำปรึกษาและช่วยเหลือคุณ
            </p>
          </AnimationWrapper>

          {/* View All Button (Desktop) */}
          <div className="hidden md:block">
            <Button variant="outline" size="lg" asChild className="rounded-xl border-slate-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300">
              <a href={"/lawyers"}>
                ดูทนายทั้งหมด
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-white/50 backdrop-blur-sm p-1.5 rounded-full inline-flex border border-slate-200/60">
          <button
            onClick={() => setActiveTab('recommended')}
            className={cn(
              'px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
              activeTab === 'recommended'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-white/80'
            )}
          >
            ทนายแนะนำ
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300',
              activeTab === 'all'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600 hover:bg-white/80'
            )}
          >
            ทนายทั้งหมด
          </button>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20',
              'w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100',
              'flex items-center justify-center text-gray-700',
              'hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300',
              'hidden lg:flex opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0',
              !canScrollPrev && 'opacity-50 cursor-not-allowed hidden'
            )}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollNext}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20',
              'w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100',
              'flex items-center justify-center text-gray-700',
              'hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300',
              'hidden lg:flex opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-0',
              !canScrollNext && 'opacity-50 cursor-not-allowed hidden'
            )}
            disabled={!canScrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden p-1 -m-1" ref={emblaRef}>
            <div className="flex -ml-4 items-stretch py-4">
              {isLoading ? (
                // Loading skeleton
                [...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-none pl-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex"
                  >
                    <div className="w-full rounded-lg border bg-white p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ))
              ) : displayLawyers.length === 0 ? (
                <div className="flex-none pl-4 w-full text-center py-8">
                  <p className="text-gray-500">ไม่พบทนายความ</p>
                </div>
              ) : (
                displayLawyers.map((lawyer) => (
                  <div
                    key={lawyer.id}
                    className="flex-none pl-4 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex"
                  >
                    <AnimationWrapper animation="scale-up" className="w-full h-full">
                       <LawyerCard lawyer={lawyer} />
                    </AnimationWrapper>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-8 md:hidden">
          <Button variant="outline" size="lg" className="w-full rounded-xl" asChild>
            <a href={"/lawyers"}>
              ดูทนายทั้งหมด
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
