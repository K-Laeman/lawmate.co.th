'use client';

import { Shield, Lock, FileCheck, CreditCard, Headphones, Award } from 'lucide-react';
import type { TrustPillar as CMSTrustPillar } from '@/lib/cms';
import BackgroundPattern from '../ui/BackgroundPattern';
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '@/lib/utils';

interface TrustPillar {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Map icon names to Lucide components
const iconMap: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-8 h-8" />,
  Lock: <Lock className="w-8 h-8" />,
  CreditCard: <CreditCard className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Headphones: <Headphones className="w-8 h-8" />,
  Award: <Award className="w-8 h-8" />,
};

const defaultTrustPillars: TrustPillar[] = [
  {
    icon: <FileCheck className="w-8 h-8" />,
    title: 'ทนายที่ผ่านการรับรอง',
    description: 'ทนายความทุกท่านได้รับการตรวจสอบใบอนุญาตจากสภาทนายความแห่งประเทศไทย',
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'ข้อมูลเป็นความลับ',
    description: 'การปรึกษาของคุณเป็นความลับ เข้ารหัสด้วยมาตรฐาน SSL และปฏิบัติตาม PDPA',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'ชำระเงินปลอดภัย',
    description: 'ระบบชำระเงินได้มาตรฐาน PCI DSS รองรับบัตรเครดิต/เดบิต และ PromptPay',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'การันตีความพึงพอใจ',
    description: 'ไม่พอใจคืนเงินภายใน 7 วัน* หากทนายไม่ให้บริการตามที่ตกลง',
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: 'ทีมซัพพอร์ต 24/7',
    description: 'ทีมงานพร้อมช่วยเหลือตลอด 24 ชั่วโมง ผ่าน Line, โทรศัพท์ หรืออีเมล',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'ราคาโปร่งใส',
    description: 'ราคาชัดเจนตั้งแต่แรก ไม่มีค่าใช้จ่ายแอบแฝง จ่ายตามแพ็คเกจที่เลือก',
  },
];

interface TrustSectionProps {
  trustPillars?: CMSTrustPillar[];
}

export function TrustSection({ trustPillars }: TrustSectionProps) {
  // Use CMS data if available, otherwise fall back to default data
  // Transform CMS data to match expected structure (icon string -> React node)
  const data: TrustPillar[] = trustPillars && trustPillars.length > 0
    ? trustPillars.map((p) => ({
        icon: iconMap[p.icon] || <Shield className="w-8 h-8" />,
        title: p.title,
        description: p.description,
      }))
    : defaultTrustPillars;

  return (
    <section id="about" className="section-padding relative overflow-hidden text-white">
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
            ทำไมต้องเพื่อนทนาย
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            เราใส่ใจความปลอดภัยของคุณ
          </h2>
          <p className="text-gray-300 text-lg">
            มั่นใจได้กับมาตรฐานความปลอดภัยระดับสูง และทนายความที่ผ่านการคัดกรอง
          </p>
        </AnimationWrapper>

        {/* Trust Pillars Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" delayChildren={0.2}>
          {data.map((pillar, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div
                className="group relative h-full bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden backdrop-blur-sm"
              >
                 {/* Hover Gradient Blob */}
                 <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-blue-300 mb-4 group-hover:scale-110 group-hover:text-white transition-transform duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-display">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Bottom Note */}
        <AnimationWrapper animation="fade-in" delay={0.6}>
          <p className="text-center text-gray-500 text-sm mt-12">
            * เงื่อนไขเป็นไปตามที่กำหนด กรุณาอ่านรายละเอียดก่อนใช้บริการ
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
}
