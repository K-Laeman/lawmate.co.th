'use client';

import { ArrowRight, Phone, MessageCircle } from 'lucide-react';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
import { Button } from '@/components/ui/button';
import BackgroundPattern from '../ui/BackgroundPattern';
import AnimationWrapper from '../ui/AnimationWrapper';
import { motion } from 'framer-motion';
import { GridPattern } from '../ui/grid-pattern';
import { cn } from '@/lib/utils';

interface CTAData {
  headline?: string;
  description?: string;
  primaryCta?: { text: string; url: string };
  phoneNumber?: string;
  showPhoneButton?: boolean;
}

interface SiteSettingsData {
  phone?: string;
  email?: string;
  lineId?: string;
  lineUrl?: string;
}

interface CTASectionProps {
  ctaData?: CTAData;
  siteSettings?: SiteSettingsData | null;
}

export function CTASection({ ctaData, siteSettings }: CTASectionProps) {
  const headline = ctaData?.headline || 'พร้อมแก้ปัญหากฎหมายของคุณ?';
  const description = ctaData?.description || 'เริ่มต้นปรึกษาทนายความได้เลยวันนี้ ไม่ว่าจะเป็นคดีเล็กหรือใหญ่ เรามีทนายความพร้อมช่วยเหลือ';
  const phone = ctaData?.phoneNumber || siteSettings?.phone || '062-4134665';
  const phoneHref = phone.replace(/[^0-9+]/g, '');
  const lineId = siteSettings?.lineId || '@lawmate';
  const lineUrl = siteSettings?.lineUrl || `https://line.me/ti/p/${lineId}`;
  const email = siteSettings?.email || 'lawmatesolutions@gmail.com';
  return (
    <section id="contact" className="section-padding relative overflow-hidden text-white">
      <BackgroundPattern variant="hero" />
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full stroke-white/10 fill-white/10",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
      
      {/* Animated Blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px] animate-pulse delay-1000" />

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimationWrapper animation="scale-up" className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            {headline}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-6 bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-blue-900/20 rounded-xl font-bold"
                asChild
              >
                <a href="/booking">
                  เริ่มปรึกษาทนาย
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl font-medium"
                asChild
              >
                <a href={`tel:${phoneHref}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {phone}
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-white/70">
            <a
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Line: {lineId}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
            >
              <div className="w-5 h-5 flex items-center justify-center rounded bg-white/10">@</div>
              <span>Email: {email}</span>
            </a>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}
