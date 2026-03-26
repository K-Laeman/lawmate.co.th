'use client';

import { useState } from 'react';
import Link from 'next/link';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Cookie } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { CookiePreferencesModal } from '@/components/ui/cookie-preferences-modal';
import type { CookieConsentData } from '@/lib/cms/getCookieConsent';
import type { SiteSettings } from '@/lib/cms/getSiteSettings';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  titleHref?: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'ข้อมูล',
    links: [
      { label: 'เกี่ยวกับเรา', href: '/about' },
      { label: 'คำถามที่พบบ่อย', href: '/faq' },
      { label: 'ติดต่อเรา', href: '/contact' },
      { label: 'วิธีการใช้งาน', href: '/#how-it-works' },
    ],
  },
  {
    title: 'สำหรับทนาย',
    links: [
      { label: 'สมัครเป็นทนาย', href: `${DASHBOARD_URL}/register?role=lawyer` },
      { label: 'เข้าสู่ระบบทนาย', href: `${DASHBOARD_URL}/login?role=lawyer` },
    ],
  },
  {
    title: 'บริการ',
    links: [
      { label: 'ค้นหาทนาย', href: '/lawyers' },
      { label: 'นัดหมายปรึกษา', href: '/booking' },
      { label: 'แพ็กเกจบริการ', href: '/#services' },
      { label: 'ประเภทคดี', href: '/#case-types' },
    ],
  },
  {
    title: 'ศูนย์ช่วยเหลือ',
    links: [
      { label: 'ส่งข้อความถึงเพื่อนทนาย', href: '/contact' },
    ],
  },
  {
    title: 'นโยบาย',
    titleHref: '/policies',
    links: [
      { label: 'ข้อกำหนดการใช้บริการ', href: '/terms' },
      { label: 'นโยบายความเป็นส่วนตัวสำหรับผู้ใช้บริการ', href: '/privacy' },
      { label: 'ประกาศความเป็นส่วนตัวสำหรับทนายความ', href: '/privacy-lawyer' },
      { label: 'นโยบายการยกเลิกและการคืนเงิน', href: '/cancellation-policy' },
      { label: 'นโยบายระยะเวลาการจัดเก็บข้อมูลส่วนบุคคล', href: '/data-retention-policy' },
      { label: 'คำแจ้งเตือนก่อนเริ่มการสนทนา', href: '/chat-disclaimer' },
      { label: 'นโยบายการรีวิวและการให้คะแนน', href: '/review-policy' },
      // Cookie settings will be added dynamically as a button
    ],
  },
];

const LineIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.15 8.15 0 0 0 4.77 1.52V7.12a4.85 4.85 0 0 1-1-.43z" />
  </svg>
);

const PLATFORM_ICONS: Record<string, React.ReactElement> = {
  facebook: <Facebook className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  youtube: <Youtube className="w-5 h-5" />,
  line: <LineIcon />,
  tiktok: <TikTokIcon />,
};

const DEFAULT_SOCIAL_LINKS = [
  { icon: <Facebook className="w-5 h-5" />, href: 'https://facebook.com/lawmate', label: 'Facebook' },
  { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com/lawmate', label: 'Twitter' },
  { icon: <Instagram className="w-5 h-5" />, href: 'https://instagram.com/lawmate', label: 'Instagram' },
  { icon: <Linkedin className="w-5 h-5" />, href: 'https://linkedin.com/company/lawmate', label: 'LinkedIn' },
];

// Default cookie consent content for when CMS is not available
const defaultCookieConsent: CookieConsentData = {
  banner: {
    title: 'เราใช้คุกกี้',
    description: 'เว็บไซต์นี้ใช้คุกกี้เพื่อมอบประสบการณ์ที่ดีที่สุดแก่คุณ',
    acceptAllText: 'ยอมรับทั้งหมด',
    rejectAllText: 'ปฏิเสธทั้งหมด',
    customizeText: 'ตั้งค่า',
    privacyLinkText: 'นโยบายความเป็นส่วนตัว',
  },
  preferences: {
    title: 'ตั้งค่าคุกกี้',
    description: 'คุณสามารถเลือกประเภทคุกกี้ที่ต้องการอนุญาตได้',
    saveText: 'บันทึกการตั้งค่า',
    cancelText: 'ยกเลิก',
  },
  categories: {
    essential: {
      title: 'คุกกี้ที่จำเป็น',
      description: 'คุกกี้เหล่านี้จำเป็นสำหรับการทำงานพื้นฐานของเว็บไซต์',
    },
    analytics: {
      title: 'คุกกี้วิเคราะห์',
      description: 'คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เข้าชมใช้งานเว็บไซต์อย่างไร',
    },
    marketing: {
      title: 'คุกกี้การตลาด',
      description: 'คุกกี้เหล่านี้ใช้เพื่อแสดงโฆษณาที่เกี่ยวข้อง',
    },
    preferences: {
      title: 'คุกกี้การตั้งค่า',
      description: 'คุกกี้เหล่านี้ช่วยจดจำการตั้งค่าของคุณ',
    },
  },
};

interface FooterProps {
  cookieConsentContent?: CookieConsentData;
  lineUrl?: string;
  siteSettings?: SiteSettings | null;
  navSections?: FooterSection[] | null;
  footerBrandName?: string | null;
  footerBrandSubtitle?: string | null;
  footerTagline?: string | null;
  copyrightText?: string | null;
  footerBottomTagline?: string | null;
}

export function Footer({
  cookieConsentContent,
  lineUrl,
  siteSettings,
  navSections,
  footerBrandName,
  footerBrandSubtitle,
  footerTagline,
  copyrightText,
  footerBottomTagline,
}: FooterProps) {
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const cookieContent = cookieConsentContent || defaultCookieConsent;

  const phone = siteSettings?.phone;
  const email = siteSettings?.email;
  const address = siteSettings?.address;
  const effectiveLineUrl = siteSettings?.lineUrl || lineUrl;

  // Use CMS nav sections if available, otherwise fall back to hardcoded defaults
  const sections = navSections?.length ? navSections : footerSections;
  const mainSections = sections.filter((s) => s.title !== 'นโยบาย');
  const policySection = sections.find((s) => s.title === 'นโยบาย');

  // CMS-driven tagline, copyright, bottom tagline (with hardcoded fallbacks)
  const tagline = footerTagline || 'แพลตฟอร์มเชื่อมต่อผู้ต้องการความช่วยเหลือทางกฎหมาย กับทนายความที่ผ่านการรับรองทั่วประเทศไทย';
  const copyright = copyrightText
    ? copyrightText.replace('{year}', String(currentYear))
    : `${currentYear} LawMate Co., Ltd. สงวนลิขสิทธิ์`;
  const bottomTagline = footerBottomTagline || 'สร้างด้วยความใส่ใจ เพื่อคนไทยทุกคน';

  const socialLinks = siteSettings?.socialLinks?.length
    ? siteSettings.socialLinks.map((s) => ({
        icon: PLATFORM_ICONS[s.platform] ?? <Linkedin className="w-5 h-5" />,
        href: s.url,
        label: s.platform.charAt(0).toUpperCase() + s.platform.slice(1),
      }))
    : DEFAULT_SOCIAL_LINKS;

  return (
    <footer className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-7 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Logo size={40} variant="light" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">
                  {footerBrandName || 'เพื่อนทนาย'}
                </span>
                <span className="text-xs text-gray-400 leading-tight">
                  {footerBrandSubtitle || 'by LawMate'}
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {tagline}
            </p>

            {/* Contact Info */}
            {(phone || email || address) && (
              <div className="space-y-3 mb-6">
                {phone && (
                  <a
                    href={`tel:${phone.replace(/[-\s]/g, '')}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </a>
                )}
                {address && (
                  <div className="flex items-start gap-3 text-gray-400">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* 2×2 grid for 4 main sections */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-x-8 gap-y-10">
            {mainSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {/* Add LINE link to Help Center section */}
                  {section.title === 'ศูนย์ช่วยเหลือ' && effectiveLineUrl && (
                    <li>
                      <a
                        href={effectiveLineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        LINE
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Policy section */}
          {policySection && (
            <div className="lg:col-span-2">
              {policySection.titleHref ? (
                <Link
                  href={policySection.titleHref}
                  className="font-semibold text-white mb-4 hover:text-primary transition-colors inline-block"
                >
                  {policySection.title}
                </Link>
              ) : (
                <h4 className="font-semibold text-white mb-4">{policySection.title}</h4>
              )}
              <ul className="space-y-3">
                {policySection.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {/* Cookie Settings button */}
                <li>
                  <button
                    type="button"
                    onClick={() => setIsCookieModalOpen(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Cookie className="w-4 h-4" />
                    <span>{cookieContent.preferences.title || 'ตั้งค่าคุกกี้'}</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {copyright}
            </p>
            <p className="text-gray-500 text-sm">
              {bottomTagline}
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        open={isCookieModalOpen}
        onOpenChange={setIsCookieModalOpen}
        content={cookieContent}
      />
    </footer>
  );
}
