// CMS Client
export { fetchFromCMS, CMS_URL } from './client'
export type { PayloadResponse } from './client'

// Navigation
export { getNavigationMenus } from './getNavigationMenus'
export type { NavigationData, NavItem, FooterSection, FooterLink } from './getNavigationMenus'

// Content Fetchers - Homepage
export { getHomepage } from './getHomepage'
export type { HomepageData } from './getHomepage'

export { getServices } from './getServices'
export type { ServicePackage } from './getServices'

export { getCaseTypes } from './getCaseTypes'
export type { CaseType, CaseSubtype } from './getCaseTypes'

export { getTestimonials } from './getTestimonials'
export type { Testimonial } from './getTestimonials'

export { getFAQ } from './getFAQ'
export type { FAQ } from './getFAQ'

export { getHowItWorks } from './getHowItWorks'
export type { HowItWorksStep } from './getHowItWorks'

export { getTrustPillars } from './getTrustPillars'
export type { TrustPillar } from './getTrustPillars'

export { getSiteSettings } from './getSiteSettings'
export type { SiteSettings, SocialLink } from './getSiteSettings'

// Content Fetchers - Blog
export { getBlogCategories, getBlogCategoryBySlug } from './getBlogCategories'
export type { BlogCategory } from './getBlogCategories'

export { getBlogAuthors, getBlogAuthorBySlug } from './getBlogAuthors'
export type { BlogAuthor } from './getBlogAuthors'

export { getBlogPosts, getBlogPostBySlug, getFeaturedBlogPosts, getRelatedBlogPosts } from './getBlogPosts'
export type { BlogPost } from './getBlogPosts'

// Blog Transform Utility
export { transformCMSBlogPost } from './transformBlogPost'

// Content Fetchers - About Page
export { getTeamMembers } from './getTeamMembers'
export type { TeamMember } from './getTeamMembers'

export { getCompanyTimeline } from './getCompanyTimeline'
export type { TimelineEvent } from './getCompanyTimeline'

export { getCompanyValues } from './getCompanyValues'
export type { CompanyValue } from './getCompanyValues'

// Content Fetchers - Contact Page
export { getInquiryTypes } from './getInquiryTypes'
export type { InquiryType } from './getInquiryTypes'

export { getQuickLinks } from './getQuickLinks'
export type { QuickLink } from './getQuickLinks'

// Content Fetchers - FAQ Categories
export { getFAQCategories } from './getFAQCategories'
export type { FAQCategory } from './getFAQCategories'

// Content Fetchers - Corporate
export { getCorporateServices } from './getCorporateServices'
export type { CorporateService } from './getCorporateServices'

// Content Fetchers - Legal Pages
export { getLegalPageBySlug, getLegalPages } from './getLegalPages'
export type { LegalPage, LegalPageSection } from './getLegalPages'

// Global Page Fetchers
export { getAboutPage } from './getAboutPage'
export type { AboutPageData } from './getAboutPage'

export { getContactPage } from './getContactPage'
export type { ContactPageData } from './getContactPage'

export { getFAQPage } from './getFAQPage'
export type { FAQPageData } from './getFAQPage'

export { getBlogsPage } from './getBlogsPage'
export type { BlogsPageData } from './getBlogsPage'

export { getCorporatePage } from './getCorporatePage'
export type { CorporatePageData } from './getCorporatePage'

// Content Fetchers - Marketing
export { getActivePopupBanner, getAllPopupBanners } from './getPopupBanners'
export type { PopupBannerData } from './getPopupBanners'

// Content Fetchers - Cookie Consent
export { getCookieConsent } from './getCookieConsent'
export type { CookieConsentData, CookieCategoryContent } from './getCookieConsent'

// Content Fetchers - Tracking & Analytics
export { getTrackingSettings } from './getTrackingSettings'
export type { TrackingSettings } from './getTrackingSettings'
