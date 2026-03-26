'use client';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
import { Check, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockPackages } from '@/data/packages';
import { formatPrice, formatDuration } from '@/data/packages';
import type { ServicePackage as CMSServicePackage } from '@/lib/cms';
import { cn } from '@/lib/utils';
import BackgroundPattern from '../ui/BackgroundPattern';
import AnimationWrapper, { StaggerContainer } from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';

interface ServicesSectionProps {
  services?: CMSServicePackage[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  // Use CMS data if available, otherwise fall back to mock data
  // Transform CMS data to match expected structure (isHighlighted -> isPopular, features array)
  const data = services && services.length > 0
    ? services.map((s) => ({
        id: parseInt(s.id) || 0,
        name: s.name,
        nameTh: s.nameTh,
        description: s.description,
        durationMinutes: s.durationMinutes,
        price: s.price,
        features: s.features.map((f) => f.feature),
        isPopular: s.isHighlighted,
      }))
    : mockPackages;
  return (
    <section id="services" className="section-padding relative overflow-hidden bg-slate-50">
      <BackgroundPattern variant="light" />
      
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimationWrapper animation="fade-in-up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            แพ็คเกจบริการ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy-dark mb-4 font-display">
            เลือกแพ็คเกจที่เหมาะกับคุณ
          </h2>
          <p className="text-gray-600 text-lg">
            ราคาโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง จ่ายเฉพาะค่าปรึกษาที่เลือก
          </p>
        </AnimationWrapper>

        {/* Package Cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" delayChildren={0.2}>
          {data.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  'relative flex flex-col h-full transition-all duration-300',
                  pkg.isPopular
                    ? 'bg-gradient-to-br from-primary via-primary to-blue-700 border-primary shadow-xl scale-105 z-10'
                    : 'bg-white border-slate-200 hover:border-primary/30 hover:shadow-lg'
                )}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-white text-primary px-4 py-1 shadow-md border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      ยอดนิยม
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8 pb-4">
                  <CardDescription className={cn(
                    'font-medium text-sm uppercase tracking-wide',
                    pkg.isPopular ? 'text-white/80' : 'text-primary'
                  )}>
                    {pkg.name}
                  </CardDescription>
                  <CardTitle className={cn(
                    'text-2xl font-bold font-display mt-1',
                    pkg.isPopular ? 'text-white' : 'text-navy-dark'
                  )}>
                    {pkg.nameTh}
                  </CardTitle>
                  <div className={cn(
                    'flex items-center justify-center gap-2 mt-3',
                    pkg.isPopular ? 'text-white/70' : 'text-gray-500'
                  )}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{formatDuration(pkg.durationMinutes)}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 px-6">
                  {/* Price */}
                  <div className="text-center mb-8 pb-8 border-b border-border/10">
                    <span className={cn(
                      'text-4xl font-bold tracking-tight',
                      pkg.isPopular ? 'text-white' : 'text-navy-dark'
                    )}>
                      {formatPrice(pkg.price)}
                    </span>
                    <span className={cn(
                      'text-sm ml-1 font-medium',
                      pkg.isPopular ? 'text-white/80' : 'text-gray-500'
                    )}>บาท</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={cn(
                          'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                          pkg.isPopular ? 'bg-white/20' : 'bg-green-100'
                        )}>
                          <Check className={cn(
                            'w-3 h-3',
                            pkg.isPopular ? 'text-white' : 'text-green-600'
                          )} />
                        </div>
                        <span className={cn(
                          'text-sm leading-relaxed',
                          pkg.isPopular ? 'text-white/90' : 'text-gray-600'
                        )}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-8 pt-4">
                  <Button
                    asChild
                    className={cn(
                      'w-full h-12 rounded-xl font-medium shadow-sm transition-all duration-300',
                      pkg.isPopular 
                        ? 'bg-white text-primary hover:bg-white/90 hover:shadow-md'
                        : 'hover:bg-primary hover:text-white'
                    )}
                    variant={pkg.isPopular ? 'default' : 'outline'}
                  >
                    <a href={`/booking?package=${pkg.id}`}>
                      เลือกแพ็คเกจนี้
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Bottom Note */}
        <AnimationWrapper animation="fade-in" delay={0.6}>
          <p className="text-center text-gray-500 text-sm mt-12 bg-white/50 inline-block px-4 py-2 rounded-full mx-auto backdrop-blur-sm border border-slate-200/60">
            * ราคาข้างต้นเป็นค่าปรึกษาเบื้องต้น ค่าว่าจ้างดำเนินคดีจะแจ้งให้ทราบหลังการปรึกษา
          </p>
        </AnimationWrapper>
      </div>
    </section>
  );
}
