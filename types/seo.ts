import type { Metadata } from 'next'

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  ogImage?: { url: string }
  canonicalUrl?: string
  noIndex?: boolean
}

export interface PageSEOProps {
  title: string
  description: string
  path: string
  ogImage?: string
  noIndex?: boolean
  locale?: 'th' | 'en'
}

export interface DynamicPageSEOProps extends PageSEOProps {
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  type?: 'article' | 'profile'
}

// JSON-LD Types
export interface JsonLdBase {
  '@context': 'https://schema.org'
}

export interface JsonLdOrganization {
  '@type': 'Organization' | 'LegalService'
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone: string
    contactType: string
    availableLanguage: string[]
  }
  address?: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  sameAs?: string[]
}

export interface JsonLdProfessionalService {
  '@type': 'ProfessionalService'
  name: string
  description: string
  image?: string
  priceRange?: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: number
    reviewCount: number
  }
  areaServed?: string[]
}

export interface JsonLdFAQPage {
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

export interface JsonLdArticle {
  '@type': 'Article' | 'BlogPosting'
  headline: string
  description: string
  image?: string
  author: {
    '@type': 'Person'
    name: string
  }
  datePublished: string
  dateModified?: string
  publisher: {
    '@type': 'Organization'
    name: string
    url: string
    logo?: string
  }
}

export interface JsonLdBreadcrumb {
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item?: string
  }>
}
