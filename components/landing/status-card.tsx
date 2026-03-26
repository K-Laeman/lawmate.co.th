'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type CaseStatus } from '@/lib/stores/booking-store';

interface StatusCardProps {
  card: {
    id: CaseStatus;
    title: string;
    description: string;
    gradient: string;
    disabled?: boolean;
    svgImage?: { url: string; alt?: string };
  };
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export function StatusCard({ card, isHovered, onMouseEnter, onMouseLeave, onClick }: StatusCardProps) {
  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      key={card.id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'group relative rounded-[2rem] w-full p-4 sm:p-6',
        'aspect-square flex flex-col items-center justify-center',
        'bg-white/5 backdrop-blur-md',
        'border border-white/10',
        'transition-all duration-500 ease-out',
        !card.disabled && 'hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)]',
        card.disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {/* Coming Soon Badge — centered in the card */}
      {card.disabled && (
        <span className="absolute inset-0 flex items-center justify-center z-20">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white/90 backdrop-blur-sm">
            ให้บริการเร็วๆ นี้
          </span>
        </span>
      )}

      {/* Image Container */}
      <div className="relative bottom-12 z-10">
        <div className={cn(
          'w-full h-full flex items-center justify-center',
          'transition-all duration-500 object-contain',
        )}>
          {card.svgImage ? (
            isHovered ? (
              <object
                type="image/svg+xml"
                data={card.svgImage.url}
                className="w-[200px] h-[200px] pointer-events-none"
                aria-label={card.title}
              >
                <img src={card.svgImage.url} alt={card.title} className="w-[200px] h-[200px] object-contain" />
              </object>
            ) : (
              <img src={card.svgImage.url} alt={card.title} className="w-[200px] h-[200px] object-contain" />
            )
          ) : (
            <div className="w-full h-full rounded-full bg-white/20" />
          )}
        </div>
      </div>

      {/* Text Content */}
      <div className="absolute bottom-2 z-10 text-center space-y-2 lg:space-y-0">
        <h3 className="text-xl lg:text-2xl font-bold text-white tracking-tight group-hover:text-white transition-colors">
          {card.title}
        </h3>
        <p className="text-xs lg:text-sm text-blue-100/70 font-light leading-relaxed group-hover:text-white/90 transition-colors">
          {card.description}
        </p>
      </div>
    </motion.button>
  );
}
