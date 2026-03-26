'use client';

import React from 'react';
import { Users, Briefcase, Shield, MapPin } from 'lucide-react';
import { mockPlatformStats } from '@/data/testimonials';
import { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/animated-counter';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  numericValue?: number; // Added for animation
  suffix?: string;      // Added for animation
  label: string;
}

interface StatsData {
  totalLawyers?: number;
  lawyersLabel?: string;
  totalCases?: number;
  casesLabel?: string;
  averageRating?: string;
  ratingLabel?: string;
  totalProvinces?: number;
  provincesLabel?: string;
}

interface StatsSectionProps {
  statsData?: StatsData;
}

const defaultStats: StatItem[] = [
  {
    icon: <Users className="w-6 h-6" />,
    value: `${mockPlatformStats.totalLawyers}+`,
    numericValue: mockPlatformStats.totalLawyers,
    suffix: '+',
    label: 'ทนายความ',
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    value: `${mockPlatformStats.totalCases.toLocaleString()}+`,
    numericValue: mockPlatformStats.totalCases,
    suffix: '+',
    label: 'คดีสำเร็จ',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    value: `${mockPlatformStats.averageRating}`,
    // averageRating might be float, let's keep it simple or handle floats in counter if needed. 
    // For now, let's assume integers or just display string for ratings if it's 4.8
    // Actually, let's just leave rating as static string or use float in counter if desired.
    // Given the previous code, rating was handled as string.
    label: 'คะแนนเฉลี่ย',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    value: `${mockPlatformStats.totalProvinces}`,
    numericValue: mockPlatformStats.totalProvinces,
    label: 'จังหวัด',
  },
];

export function StatsSection({ statsData }: StatsSectionProps) {
  const stats: StatItem[] = statsData
    ? [
        {
          icon: <Users className="w-6 h-6" />,
          value: `${statsData.totalLawyers || mockPlatformStats.totalLawyers}+`,
          numericValue: statsData.totalLawyers || mockPlatformStats.totalLawyers,
          suffix: '+',
          label: statsData.lawyersLabel || 'ทนายความ',
        },
        {
          icon: <Briefcase className="w-6 h-6" />,
          value: `${(statsData.totalCases || mockPlatformStats.totalCases).toLocaleString()}+`,
          numericValue: statsData.totalCases || mockPlatformStats.totalCases,
          suffix: '+',
          label: statsData.casesLabel || 'คดีสำเร็จ',
        },
        {
          icon: <Shield className="w-6 h-6" />,
          value: `${statsData.averageRating || mockPlatformStats.averageRating}`,
          label: statsData.ratingLabel || 'คะแนนเฉลี่ย',
        },
        {
          icon: <MapPin className="w-6 h-6" />,
          value: `${statsData.totalProvinces || mockPlatformStats.totalProvinces}`,
          numericValue: statsData.totalProvinces || mockPlatformStats.totalProvinces,
          label: statsData.provincesLabel || 'จังหวัด',
        },
      ]
    : defaultStats;

  return (
    <section className="py-8 relative z-30 -mt-24 md:-mt-28">
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
            delayChildren={0.5}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 }
                }}
                className="flex flex-col items-center justify-center text-center group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {stat.icon}
                </div>
                <span className="text-3xl md:text-4xl font-bold text-navy-dark mb-1 font-display tracking-tight flex items-center justify-center gap-0.5 tabular-nums">
                   {stat.numericValue !== undefined ? (
                     <AnimatedCounter value={stat.numericValue} suffix={stat.suffix} />
                   ) : (
                     stat.value
                   )}
                </span>
                <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
