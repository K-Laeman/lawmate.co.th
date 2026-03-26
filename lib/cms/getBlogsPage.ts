import { fetchFromCMS } from './client'

export interface BlogsPageData {
  hero: {
    badge?: string
    headline: string
    subheadline: string
    searchPlaceholder?: string
  }
  sectionHeaders: {
    featuredTitle?: string
    allBlogsTitle?: string
    searchResultsPrefix?: string
  }
  emptyState: {
    icon?: string
    title?: string
    description?: string
    buttonText?: string
  }
  cta: {
    headline: string
    description?: string
    primaryButton?: {
      text?: string
      url?: string
    }
    secondaryButton?: {
      text?: string
      url?: string
    }
  }
  blogDetailCta?: {
    heading?: string
    description?: string
    buttonText?: string
    buttonUrl?: string
    relatedArticlesTitle?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      id: string
      url: string
    }
  }
}

export async function getBlogsPage(
  locale: string = 'th'
): Promise<BlogsPageData | null> {
  try {
    const data = await fetchFromCMS<BlogsPageData>(
      `/globals/blogs-page?locale=${locale}&depth=1`,
      { next: { revalidate: 60, tags: ['cms', 'blog-posts'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching blogs page:', error)
    return null
  }
}
