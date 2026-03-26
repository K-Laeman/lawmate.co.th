'use client';

import { useState } from 'react';
import { Shield, Rocket, X } from 'lucide-react';
import { type CaseStatus } from '@/lib/stores/booking-store';
import dynamic from 'next/dynamic';
import BackgroundPattern from '../ui/BackgroundPattern';

const LawyerSearchModal = dynamic(
  () => import('./lawyer-search-modal').then((m) => m.LawyerSearchModal),
  { ssr: false }
);
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { DottedSurface } from '../ui/dotted-surface';
import { StatusCard } from './status-card';


// Case status card configuration
const caseStatusCards: {
  id: CaseStatus;
  title: string;
  description: string;
  gradient: string;
  disabled?: boolean;
  svgImage?: { url: string; alt?: string };
}[] = [
  {
    id: 'being_sued',
    title: 'ถูกฟ้อง',
    description: 'มีหมายศาลหรือถูกฟ้องร้อง',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  {
    id: 'will_sue',
    title: 'จะฟ้อง',
    description: 'ต้องการดำเนินคดีฟ้องร้อง',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    id: 'bail',
    title: 'ประกันตัว',
    description: 'ถูกจับกุมหรือต้องการยื่นประกัน',
    gradient: 'from-purple-500/20 to-violet-500/20',
    disabled: true,
  },
  {
    id: 'consultation',
    title: 'ปรึกษาทั่วไป',
    description: 'สอบถามปัญหากฎหมาย',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
];

// CMS Props interface
interface HeroData {
  badge?: string;
  headline?: string;
  headlineHighlight?: string;
  subheadline?: string;
  caseStatusHeading?: string;
  caseStatusCards?: Array<{
    cardType: string;
    title: string;
    description: string;
    disabled?: boolean | null;
    svgImage?: { url: string; alt?: string };
  }>;
}

interface HeroSectionProps {
  heroData?: HeroData;
}

export function HeroSection({ heroData }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  // Use CMS data if available, otherwise fall back to defaults
  const badge = heroData?.badge || 'แพลตฟอร์มกฎหมายออนไลน์ #1 ของประเทศไทย';
  const headline = heroData?.headline || 'ปัญหากฎหมาย';
  const headlineHighlight = heroData?.headlineHighlight || 'มีเพื่อนทนายช่วย';
  const subheadline = heroData?.subheadline || 'เชื่อมต่อกับทนายความที่ผ่านการรับรองทั่วประเทศ ปรึกษาปัญหากฎหมายง่าย รวดเร็ว และปลอดภัย';
  const caseStatusHeading = heroData?.caseStatusHeading || 'เลือกสถานะของคุณ';

  // Merge CMS card data with defaults (preserving styling)
  const cards = heroData?.caseStatusCards?.length
    ? heroData.caseStatusCards.map((cmsCard, index) => {
        const fallback = caseStatusCards[index] || caseStatusCards[0];
        return {
          ...fallback,
          id: (cmsCard.cardType || fallback.id) as CaseStatus,
          title: cmsCard.title,
          description: cmsCard.description,
          svgImage: cmsCard.svgImage,
          disabled: cmsCard.disabled ?? fallback.disabled,
        };
      })
    : caseStatusCards;

  const handleCardClick = (status: CaseStatus, disabled?: boolean) => {
    if (disabled) {
      setComingSoonOpen(true);
      return;
    }
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <BackgroundPattern variant="hero" overlay />

      {/* Animated Dotted Surface Background */}
      <DottedSurface className="z-0" dotColor={{ r: 255, g: 255, b: 255 }} />

      <div className="container-wide relative mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-32 md:pb-24">
        <AnimationWrapper className="max-w-4xl mx-auto text-center" animation="fade-in-up">
          
          {/* Case Status Quick Select Cards - Moved to Top */}
          <div className="mb-16">
            <p className="text-2xl md:text-3xl text-white font-semibold mb-14 tracking-wide drop-shadow-md">
              {caseStatusHeading}
            </p>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto justify-items-center" delayChildren={0.1}>
              {cards.map((card) => (
                <StatusCard
                  key={card.id}
                  card={card}
                  isHovered={hoveredCardId === card.id}
                  onMouseEnter={() => !card.disabled && setHoveredCardId(card.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => handleCardClick(card.id, card.disabled)}
                />
              ))}
            </StaggerContainer>
          </div>

          {/* Badge/Headline/Subheadline - Moved below cards */}
          <div className="mt-8 space-y-6">
             {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Shield className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white/90">
                {badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
              {headline}{' '}
              <span className="relative inline-block">
                <span className="hero-text-shimmer text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-[length:200%_100%]">
                  {headlineHighlight}
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-white/70 mx-auto max-w-2xl">
              {subheadline}
            </p>
          </div>

        </AnimationWrapper>
      </div>

      {/* Text shimmer animation styles */}
      <style jsx>{`
        .hero-text-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% {
            background-position: -100% 0;
          }
          50% {
            background-position: 100% 0;
          }
        }
      `}</style>

      {/* Bottom Curve Divider */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px] z-20">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 100C480 100 960 100 1440 100V0C960 0 480 0 0 0V100Z"
            fill="transparent"
          />
          <path
             d="M0 60C240 75 480 85 720 85C960 85 1200 75 1440 60V100H0V60Z"
             fill="white"
          />
           {/* Alternative smoother curve */}
           <path
            d="M0 30C348 80 858 95 1440 45V100H0V30Z" 
            fill="white"
          />
        </svg>
      </div>

      {/* Lawyer Search Modal */}
      <LawyerSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStatus={selectedStatus}
      />

      {/* Coming Soon Modal */}
      {comingSoonOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setComingSoonOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setComingSoonOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="ปิด"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">ให้บริการเร็วๆ นี้</h2>
            <p className="text-gray-500 text-sm mb-6">
              บริการนี้จะเปิดให้บริการเร็วๆ นี้
            </p>
            <button
              onClick={() => setComingSoonOpen(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
