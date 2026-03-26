import { SITE_CONFIG } from './constants'
import type {
  JsonLdOrganization,
  JsonLdProfessionalService,
  JsonLdFAQPage,
  JsonLdArticle,
  JsonLdBreadcrumb,
} from '@/types/seo'

/**
 * Generate Organization/LegalService JSON-LD for the site
 */
export function generateOrganizationJsonLd(): string {
  const data: JsonLdOrganization = {
    '@type': 'LegalService',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    description: SITE_CONFIG.defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.phone,
      contactType: 'customer service',
      availableLanguage: ['Thai', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.locality,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    sameAs: [
      SITE_CONFIG.socialLinks.facebook,
      SITE_CONFIG.socialLinks.line,
      SITE_CONFIG.socialLinks.instagram,
    ],
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })
}

/**
 * Generate ProfessionalService JSON-LD for lawyer profiles
 */
export function generateLawyerJsonLd(lawyer: {
  name: string
  bio: string
  imageUrl?: string
  rating: number
  totalReviews: number
  pricePerHour: number
  serviceAreas: string[]
}): string {
  const data: JsonLdProfessionalService = {
    '@type': 'ProfessionalService',
    name: lawyer.name,
    description: lawyer.bio,
    image: lawyer.imageUrl,
    priceRange: `฿${lawyer.pricePerHour.toLocaleString()}/ชั่วโมง`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: lawyer.rating,
      reviewCount: lawyer.totalReviews,
    },
    areaServed: lawyer.serviceAreas,
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })
}

/**
 * Generate FAQPage JSON-LD
 */
export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
): string {
  const data: JsonLdFAQPage = {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })
}

/**
 * Generate Article/BlogPosting JSON-LD
 */
export function generateArticleJsonLd(article: {
  title: string
  excerpt: string
  imageUrl?: string
  author: string
  publishedDate: string
  modifiedDate?: string
  url: string
}): string {
  const data: JsonLdArticle = {
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/images/logo.png`,
    },
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })
}

/**
 * Generate Breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
): string {
  const data: JsonLdBreadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    ...data,
  })
}

/**
 * JSON-LD Script Component helper
 */
export function JsonLdScript({ data }: { data: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: data }}
    />
  )
}
