'use client';

import { useState } from 'react';
import { Scale, Gavel, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { mockCaseTypes } from '@/data/case-types';
import type { CaseType as CMSCaseType } from '@/lib/cms';
import { GridPattern } from '../ui/grid-pattern';
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const caseTypeIcons: Record<string, React.ReactNode> = {
  civil: <Scale className="w-6 h-6" />,
  criminal: <Gavel className="w-6 h-6" />,
  corporate: <Building2 className="w-6 h-6" />,
};

interface CaseTypesSectionProps {
  caseTypes?: CMSCaseType[];
}

export function CaseTypesSection({ caseTypes }: CaseTypesSectionProps) {
  const [activeTab, setActiveTab] = useState('civil');

  // Use CMS data if available, otherwise fall back to mock data
  // Transform CMS data to match expected structure
  const data = caseTypes && caseTypes.length > 0
    ? caseTypes.map((ct) => ({
        id: parseInt(ct.id) || 0,
        code: ct.code,
        nameTh: ct.nameTh,
        nameEn: ct.nameEn,
        subtypes: ct.subtypes.map((st, idx) => ({
          id: idx,
          code: st.code,
          nameTh: st.nameTh,
          nameEn: st.nameEn,
        })),
      }))
    : mockCaseTypes;

  return (
    <section id="case-types" className="section-padding relative overflow-hidden bg-white">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full stroke-blue-500/5 fill-blue-500/5",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            ประเภทคดี
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-dark mb-4 font-display">
            รองรับทุกประเภทคดี
          </h2>
          <p className="text-gray-600 text-lg">
            ไม่ว่าจะเป็นคดีแพ่ง คดีอาญา หรือกฎหมายธุรกิจ เรามีทนายความผู้เชี่ยวชาญพร้อมให้บริการ
          </p>
        </AnimationWrapper>

        {/* Case Type Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-12 h-auto p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl">
            {data.map((caseType) => (
              <TabsTrigger
                key={caseType.code}
                value={caseType.code}
                className="flex items-center gap-2 py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
              >
                {caseTypeIcons[caseType.code]}
                <span className="hidden sm:inline font-medium">{caseType.nameTh}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {data.map((caseType) => (
            <TabsContent key={caseType.code} value={caseType.code} className="mt-0">
              <AnimationWrapper animation="fade-in">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-navy-dark mb-2 font-display">
                    {caseType.nameTh}
                  </h3>
                  <p className="text-gray-500 font-medium">{caseType.nameEn}</p>
                </div>
              </AnimationWrapper>

              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" delayChildren={0.1}>
                {caseType.subtypes.map((subtype) => (
                  <motion.div
                    key={subtype.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className="group h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border-slate-200 overflow-hidden"
                    >
                      <CardContent className="p-6 text-center relative z-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 group-hover:from-primary/10 transition-colors" />
                        
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                          {caseTypeIcons[caseType.code]}
                        </div>
                        <h4 className="font-semibold text-navy-dark mb-1 group-hover:text-primary transition-colors font-display">
                          {subtype.nameTh}
                        </h4>
                        <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{subtype.nameEn}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
