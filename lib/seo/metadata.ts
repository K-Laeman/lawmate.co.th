import type { Metadata } from 'next'
import { SITE_CONFIG, DEFAULT_OG_IMAGE, KEYWORDS } from './constants'
import type { PageSEOProps, DynamicPageSEOProps } from '@/types/seo'

/**
 * Generate consistent metadata for any page
 */
export function generatePageMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  locale = 'th',
}: PageSEOProps): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_CONFIG.url}${ogImage}`
    : `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`

  return {
    title,
    description,
    keywords: KEYWORDS,
    authors: [{ name: 'LawMate Co., Ltd.' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

/**
 * Generate metadata for dynamic pages (blogs, lawyers)
 */
export function generateDynamicMetadata({
  title,
  description,
  path,
  ogImage,
  publishedTime,
  modifiedTime,
  authors,
  type = 'article',
  noIndex = false,
  locale = 'th',
}: DynamicPageSEOProps): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const imageUrl = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${SITE_CONFIG.url}${ogImage}`
    : `${SITE_CONFIG.url}${DEFAULT_OG_IMAGE}`

  return {
    title,
    description,
    keywords: KEYWORDS,
    authors: authors?.map((name) => ({ name })) || [{ name: 'LawMate Co., Ltd.' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

/**
 * Merge CMS SEO data with defaults
 */
export function mergeSEOWithDefaults(
  cmsData: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: { url: string }
  } | null,
  defaults: { title: string; description: string }
): { title: string; description: string; ogImage?: string } {
  return {
    title: cmsData?.metaTitle || defaults.title,
    description: cmsData?.metaDescription || defaults.description,
    ogImage: cmsData?.ogImage?.url,
  }
}

/**
 * Create a title with site name suffix
 */
export function createTitle(pageTitle: string): string {
  return `${pageTitle} | เพื่อนทนาย by LawMate`
}
