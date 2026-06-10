import { fetchFromCMS, type PayloadResponse } from './client'
import type { BlogCategory } from './getBlogCategories'
import type { BlogAuthor } from './getBlogAuthors'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: unknown // Rich text content from Lexical editor
  featuredImage: {
    id: string
    url: string
    alt?: string
  }
  author: BlogAuthor
  category: BlogCategory
  tags?: Array<{ tag: string }>
  readTime?: number
  publishedDate: string
  updatedAt?: string
  isFeatured: boolean
  isPublished: boolean
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export async function getBlogPosts(
  locale: string = 'th',
  options?: {
    limit?: number
    page?: number
    category?: string
    featured?: boolean
    search?: string
  }
): Promise<{ docs: BlogPost[]; totalDocs: number; totalPages: number }> {
  try {
    let query = `?locale=${locale}&sort=-publishedDate&depth=2`
    query += `&limit=${options?.limit || 12}`
    query += `&page=${options?.page || 1}`
    query += '&where[isPublished][equals]=true'

    if (options?.category) {
      query += `&where[category.slug][equals]=${options.category}`
    }

    if (options?.featured) {
      query += '&where[isFeatured][equals]=true'
    }

    if (options?.search) {
      query += `&where[or][0][title][contains]=${encodeURIComponent(options.search)}`
      query += `&where[or][1][excerpt][contains]=${encodeURIComponent(options.search)}`
    }

    const data = await fetchFromCMS<PayloadResponse<BlogPost>>(
      `/blog-posts${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-posts'] } }
    )

    return {
      docs: data?.docs ?? [],
      totalDocs: data?.totalDocs ?? 0,
      totalPages: data?.totalPages ?? 0,
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { docs: [], totalDocs: 0, totalPages: 0 }
  }
}

export async function getBlogPostBySlug(
  slug: string,
  locale: string = 'th'
): Promise<BlogPost | null> {
  try {
    // Normalize: strip leading slash (CMS sometimes stores slugs as "/slug")
    const normalizedSlug = slug.startsWith('/') ? slug.slice(1) : slug;
    // Try exact slug first, then with leading slash (handles CMS inconsistency)
    for (const s of [normalizedSlug, `/${normalizedSlug}`]) {
      const query = `?locale=${locale}&where[slug][equals]=${encodeURIComponent(s)}&where[isPublished][equals]=true&depth=2&limit=1`
      const data = await fetchFromCMS<PayloadResponse<BlogPost>>(
        `/blog-posts${query}`,
        { next: { revalidate: 60, tags: ['cms', 'blog-posts'] } }
      )
      const doc = data?.docs?.[0]
      if (doc) return doc
    }
    return null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

export async function getFeaturedBlogPosts(
  locale: string = 'th',
  limit: number = 3
): Promise<BlogPost[]> {
  const result = await getBlogPosts(locale, { limit, featured: true })
  return result.docs
}

export async function getRelatedBlogPosts(
  slug: string,
  categorySlug: string,
  locale: string = 'th',
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    const query = `?locale=${locale}&sort=-publishedDate&depth=2&limit=${limit + 1}`
      + '&where[isPublished][equals]=true'
      + `&where[category.slug][equals]=${categorySlug}`

    const data = await fetchFromCMS<PayloadResponse<BlogPost>>(
      `/blog-posts${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-posts'] } }
    )

    // Filter out the current post and limit results
    return (data?.docs ?? [])
      .filter(post => post.slug !== slug)
      .slice(0, limit)
  } catch (error) {
    console.error('Error fetching related blog posts:', error)
    return []
  }
}
