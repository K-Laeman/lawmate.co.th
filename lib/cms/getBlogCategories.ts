import { fetchFromCMS, type PayloadResponse } from './client'

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  sortOrder: number
  isActive: boolean
}

export async function getBlogCategories(
  locale: string = 'th',
  options?: { limit?: number }
): Promise<BlogCategory[]> {
  try {
    const query = `?locale=${locale}&sort=sortOrder&limit=${options?.limit || 20}&where[isActive][equals]=true`

    const data = await fetchFromCMS<PayloadResponse<BlogCategory>>(
      `/blog-categories${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-categories'] } }
    )
    return data?.docs ?? []
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return []
  }
}

export async function getBlogCategoryBySlug(
  slug: string,
  locale: string = 'th'
): Promise<BlogCategory | null> {
  try {
    const query = `?locale=${locale}&where[slug][equals]=${slug}&limit=1`

    const data = await fetchFromCMS<PayloadResponse<BlogCategory>>(
      `/blog-categories${query}`,
      { next: { revalidate: 60, tags: ['cms', 'blog-categories'] } }
    )
    return data?.docs?.[0] ?? null
  } catch (error) {
    console.error('Error fetching blog category:', error)
    return null
  }
}
