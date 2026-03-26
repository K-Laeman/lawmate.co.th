'use client';

import { cn } from '@/lib/utils';

interface BackgroundPatternProps {
  variant?: 'light' | 'dark' | 'navy' | 'hero';
  overlay?: boolean;
  className?: string;
}

export default function BackgroundPattern({ variant = 'light', overlay = false, className }: BackgroundPatternProps) {
  const gradientClass = {
    light: 'bg-gradient-to-b from-white to-slate-50',
    dark: 'bg-gradient-to-b from-slate-900 to-slate-950',
    navy: 'bg-gradient-to-b from-navy-dark to-slate-950',
    hero: 'bg-gradient-to-br from-navy-dark via-primary to-blue-700'
  }[variant];

  return (
    <div className={cn(
      'absolute inset-0 -z-10 h-full w-full',
      gradientClass,
      className
    )}>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/20" />
      )}
    </div>
  );
}