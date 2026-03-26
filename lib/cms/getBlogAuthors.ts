import { fetchFromCMS, type PayloadResponse } from './client'

export interface BlogAuthor {
  id: string
  name: string
  slug: string
  title?: string
  bio?: string
  avatar?: {
    id: string
    url: string
    alt?: string
  }
  isActive: boolean
}

export async function getBlogAuthors(
  locale: string = 'th',
  options?: { limit?: number }
): Promise<BlogAuthor[]> {
  try {
    const query = `?locale=${locale}&limit=${options?.limit || 50}&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<BlogAuthor>>(
      `/blog-authors${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-authors'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching blog authors:', error)
    return []
  }
}

export async function getBlogAuthorBySlug(
  slug: string,
  locale: string = 'th'
): Promise<BlogAuthor | null> {
  try {
    const query = `?locale=${locale}&where[slug][equals]=${slug}&limit=1`

    const data = await fetchFromCMS<PayloadResponse<BlogAuthor>>(
      `/blog-authors${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-authors'] } }
    )
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error('Error fetching blog author:', error)
    return null
  }
}
