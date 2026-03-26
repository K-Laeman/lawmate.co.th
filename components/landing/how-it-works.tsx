'use client';

import { Search, UserCheck, Calendar, MessageSquare } from 'lucide-react';
import type { HowItWorksStep as CMSHowItWorksStep } from '@/lib/cms';
import BackgroundPattern from '../ui/BackgroundPattern';
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '@/lib/utils';

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-8 h-8" />,
  UserCheck: <UserCheck className="w-8 h-8" />,
  Calendar: <Calendar className="w-8 h-8" />,
  MessageSquare: <MessageSquare className="w-8 h-8" />,
};

const defaultSteps: Step[] = [
  {
    number: '01',
    icon: <Search className="w-8 h-8" />,
    title: 'เลือกประเภทคดี',
    description: 'บอกเราเกี่ยวกับปัญหากฎหมายของคุณ เลือกประเภทคดีและพื้นที่ที่ต้องการ',
  },
  {
    number: '02',
    icon: <UserCheck className="w-8 h-8" />,
    title: 'เลือกทนายความ',
    description: 'ดูโปรไฟล์ทนายความที่เชี่ยวชาญในคดีของคุณ เปรียบเทียบประสบการณ์และรีวิว',
  },
  {
    number: '03',
    icon: <Calendar className="w-8 h-8" />,
    title: 'นัดหมายปรึกษา',
    description: 'เลือกแพ็คเกจและเวลาที่สะดวก ชำระเงินผ่านระบบที่ปลอดภัย',
  },
  {
    number: '04',
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'รับคำปรึกษา',
    description: 'พูดคุยกับทนายความผ่านวิดีโอคอลหรือโทรศัพท์ รับคำแนะนำที่ชัดเจน',
  },
];

interface HowItWorksProps {
  steps?: CMSHowItWorksStep[];
}

export function HowItWorks({ steps }: HowItWorksProps) {
  // Use CMS data if available, otherwise fall back to default data
  // Transform CMS data to match expected structure (icon string -> React node)
  const data: Step[] = steps && steps.length > 0
    ? steps.map((s) => ({
        number: s.stepNumber,
        icon: iconMap[s.icon] || <Search className="w-8 h-8" />,
        title: s.title,
        description: s.description,
      }))
    : defaultSteps;

  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden bg-slate-50">
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

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            วิธีการใช้งาน
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-dark mb-4 font-display">
            เริ่มต้นใช้งานง่ายๆ 4 ขั้นตอน
          </h2>
          <p className="text-gray-600 text-lg">
            ปรึกษาทนายความออนไลน์ได้ทุกที่ทุกเวลา ไม่ต้องเดินทาง ไม่ต้องรอคิว
          </p>
        </AnimationWrapper>

        {/* Steps Grid */}
        <div className="relative">
          {/* Connection Lines - positioned behind cards */}
          <div className="hidden lg:block absolute inset-0 z-0">
            <div className="grid grid-cols-4 gap-8 h-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute h-0.5 bg-gradient-to-r from-slate-200 via-primary/20 to-slate-200"
                    style={{
                      top: 'calc(40px)', // adjusted for new padding
                      left: '50%',
                      width: 'calc(100% + 32px)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch relative z-10" delayChildren={0.2}>
            {data.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <div className="relative h-full flex flex-col items-center text-center bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                  {/* Step Number */}
                  <span className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white font-bold text-lg shadow-lg shadow-primary/20 z-20 group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-6 group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
                    <div className="relative z-10 text-primary group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-navy-dark mb-3 group-hover:text-primary transition-colors font-display">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow group-hover:text-gray-700">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
