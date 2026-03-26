import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { StatsSection } from '@/components/landing/stats-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ServicesSection } from '@/components/landing/services-section';
import { CaseTypesSection } from '@/components/landing/case-types-section';
import { PopupBanner } from '@/components/ui/popup-banner';

// Lazy-load below-fold sections to reduce initial JS bundle
const LawyerSlider = dynamic(() =>
  import('@/components/landing/lawyer-slider-client').then((m) => m.LawyerSliderClient)
);
const TrustSection = dynamic(() =>
  import('@/components/landing/trust-section').then((m) => m.TrustSection)
);
const TestimonialsSection = dynamic(() =>
  import('@/components/landing/testimonials-section').then((m) => m.TestimonialsSection)
);
const FAQSection = dynamic(() =>
  import('@/components/landing/faq-section').then((m) => m.FAQSection)
);
const BlogsSection = dynamic(() =>
  import('@/components/landing/blogs-section').then((m) => m.BlogsSection)
);
const CTASection = dynamic(() =>
  import('@/components/landing/cta-section').then((m) => m.CTASection)
);
import {
  getHomepage,
  getSiteSettings,
  getNavigationMenus,
  getActivePopupBanner,
  getCaseTypes,
  getFAQ,
  getTestimonials,
  getServices,
  getTrustPillars,
  getHowItWorks,
  getBlogPosts,
} from '@/lib/cms';
import { mergeSEOWithDefaults, generatePageMetadata } from '@/lib/seo/metadata';
import { generateOrganizationJsonLd, JsonLdScript } from '@/lib/seo/json-ld';
import { SITE_CONFIG } from '@/lib/seo/constants';

// ISR: revalidate every hour; on-demand revalidation via /api/revalidate handles immediate updates
export const revalidate = 3600;

// Generate metadata from CMS with fallbacks
export async function generateMetadata(): Promise<Metadata> {
  const [homepage, siteSettings] = await Promise.all([
    getHomepage('th'),
    getSiteSettings('th'),
  ]);

  const seoData = mergeSEOWithDefaults(homepage?.seo || null, {
    title: siteSettings?.defaultMetaTitle || SITE_CONFIG.defaultTitle,
    description: siteSettings?.defaultMetaDescription || SITE_CONFIG.defaultDescription,
  });

  return generatePageMetadata({
    title: seoData.title,
    description: seoData.description,
    path: '/',
    ogImage: seoData.ogImage || siteSettings?.defaultOgImage?.url,
  });
}

export default async function Home() {
  // Fetch homepage data and all section content from CMS
  const [
    homepage,
    siteSettings,
    navData,
    popupBanner,
    caseTypes,
    faqs,
    testimonials,
    services,
    trustPillars,
    howItWorks,
    blogResult,
  ] = await Promise.all([
    getHomepage('th'),
    getSiteSettings('th'),
    getNavigationMenus('th'),
    getActivePopupBanner('th', 'homepage'),
    getCaseTypes('th'),
    getFAQ('th'),
    getTestimonials('th'),
    getServices('th'),
    getTrustPillars('th'),
    getHowItWorks('th'),
    getBlogPosts('th', { limit: 3 }),
  ]);

  // Section visibility - default to true if not set
  const visibility = homepage?.sectionVisibility ?? {};
  const show = {
    hero: visibility.showHero !== false,
    stats: visibility.showStats !== false,
    howItWorks: visibility.showHowItWorks !== false,
    services: visibility.showServices !== false,
    caseTypes: visibility.showCaseTypes !== false,
    trust: visibility.showTrust !== false,
    testimonials: visibility.showTestimonials !== false,
    faq: visibility.showFaq !== false,
    blog: visibility.showBlog !== false,
    cta: visibility.showCta !== false,
  };

  return (
    <>
      {/* Organization JSON-LD for SEO */}
      <JsonLdScript data={generateOrganizationJsonLd()} />

      {/* Popup Banner - from collection or fallback to homepage global */}
      <PopupBanner data={popupBanner ?? homepage?.popupBanner} />

      <Header
        navItems={navData?.headerNav?.filter((item) => item.isActive !== false)}
        headerCta={navData?.headerCta}
      />
      <main>
        {/* Conditionally render sections based on CMS visibility settings */}
        {show.hero && <HeroSection heroData={homepage?.hero} />}
        {show.stats && <StatsSection statsData={homepage?.stats} />}
        <LawyerSlider />
        {show.howItWorks && <HowItWorks steps={howItWorks} />}
        {show.services && <ServicesSection services={services} />}
        {show.caseTypes && <CaseTypesSection caseTypes={caseTypes} />}
        {show.trust && <TrustSection trustPillars={trustPillars} />}
        {show.testimonials && <TestimonialsSection testimonials={testimonials} sectionHeader={homepage?.sectionHeaders?.testimonials} />}
        {show.blog && <BlogsSection blogs={blogResult?.docs ?? []} sectionHeader={homepage?.sectionHeaders?.blog} />}
        {show.faq && <FAQSection faqs={faqs} sectionHeader={homepage?.sectionHeaders?.faq} />}
        {show.cta && <CTASection ctaData={homepage?.cta} siteSettings={siteSettings} />}
      </main>
      <Footer
        siteSettings={siteSettings}
        navSections={navData?.footerSections}
        footerBrandName={navData?.footerBrandName}
        footerBrandSubtitle={navData?.footerBrandSubtitle}
        footerTagline={navData?.footerTagline}
        copyrightText={navData?.copyrightText}
        footerBottomTagline={navData?.footerBottomTagline}
      />
    </>
  );
}
