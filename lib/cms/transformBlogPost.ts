import type { BlogPost as CMSBlogPost } from './getBlogPosts'
import type { BlogPost as FrontendBlogPost } from '@/types'
import { CMS_URL } from './client'
import { extractTextFromLexical } from './lexical-utils'

/**
 * Resolve media URL - handles both absolute URLs and relative paths from CMS
 */
function resolveMediaUrl(url: string): string {
  if (!url) return '/images/placeholder-blog.jpg'
  if (url.startsWith('http')) return url
  return `${CMS_URL}${url}`
}

/**
 * Transform CMS BlogPost to Frontend BlogPost type
 * CMS returns nested objects (author, category, featuredImage)
 * Frontend expects flat strings
 */
export function transformCMSBlogPost(post: CMSBlogPost): FrontendBlogPost {
  return {
    id: post.id,
    slug: post.slug.startsWith('/') ? post.slug.slice(1) : post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: extractTextFromLexical(post.content),
    author: typeof post.author === 'object' ? post.author?.name || '' : String(post.author || ''),
    authorImage: typeof post.author === 'object' && post.author?.avatar?.url
      ? resolveMediaUrl(post.author.avatar.url)
      : undefined,
    category: (typeof post.category === 'object' ? post.category?.slug : String(post.category || 'general')) as FrontendBlogPost['category'],
    categoryLabel: typeof post.category === 'object' ? post.category?.name || '' : String(post.category || ''),
    tags: post.tags?.map((t) => t.tag).filter(Boolean) as string[] || [],
    featuredImage: typeof post.featuredImage === 'object' && post.featuredImage?.url
      ? resolveMediaUrl(post.featuredImage.url)
      : '/images/placeholder-blog.jpg',
    publishedDate: post.publishedDate,
    readTime: post.readTime || 5,
    isFeatured: post.isFeatured,
  }
}
