import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Secret token to protect the endpoint
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'your-secret-token'

// Collection to paths mapping for targeted revalidation
const pathsByCollection: Record<string, string[]> = {
  homepage: ['/'],
  'blog-posts': ['/blogs'],
  'blog-categories': ['/blogs'],
  'blog-authors': ['/blogs'],
  'case-types': ['/', '/booking'],
  faqs: ['/', '/faq'],
  testimonials: ['/'],
  'service-packages': ['/', '/booking'],
  'trust-pillars': ['/'],
  'how-it-works-steps': ['/'],
  'about-page': ['/about'],
  'contact-page': ['/contact'],
  'faq-page': ['/faq'],
  'corporate-page': ['/corporate'],
  'administrative-case-page': ['/administrative-case'],
  'legal-pages': ['/policies', '/terms', '/privacy', '/cancellation-policy', '/chat-disclaimer', '/data-retention-policy', '/review-policy'],
  'company-values': ['/about'],
  'company-timeline': ['/about'],
  'team-members': ['/about'],
  'inquiry-types': ['/contact'],
  'quick-links': ['/contact'],
  'faq-categories': ['/faq'],
  'corporate-services': ['/corporate'],
  'popup-banners': ['/'],
  'cookie-consent': ['/'],
  'navigation-menus': [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/blogs',
    '/corporate',
    '/booking',
    '/terms',
    '/privacy',
  ],
  'site-settings': [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/blogs',
    '/corporate',
    '/booking',
    '/terms',
    '/privacy',
  ],
  default: [
    '/',
    '/about',
    '/contact',
    '/faq',
    '/blogs',
    '/corporate',
    '/booking',
    '/terms',
    '/privacy',
  ],
}

/**
 * On-demand revalidation endpoint
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "secret": "your-secret-token", "path": "/" }
 *
 * Revalidate by collection:
 * Body: { "secret": "your-secret-token", "collection": "faqs" }
 *
 * Revalidate multiple paths:
 * Body: { "secret": "your-secret-token", "paths": ["/", "/about"] }
 *
 * Revalidate all common pages (no path/paths/collection specified):
 * Body: { "secret": "your-secret-token" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path, paths, collection } = body

    // Validate secret
    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const revalidatedPaths: string[] = []

    // Revalidate by collection name
    if (collection) {
      // Invalidate Data Cache via tag
      revalidateTag(collection, 'max')

      // Invalidate Route Cache + sub-routes via layout type
      const collectionPaths = pathsByCollection[collection] || pathsByCollection['default']
      collectionPaths.forEach((p) => {
        revalidatePath(p, 'layout')
        revalidatedPaths.push(p)
      })

      console.log(`Revalidated tag: ${collection}, paths: ${revalidatedPaths.join(', ')}`)
      return NextResponse.json({ revalidated: true, collection, tag: collection, paths: revalidatedPaths })
    }

    // Revalidate specific path
    if (path) {
      revalidatePath(path, 'layout')
      return NextResponse.json({ revalidated: true, path })
    }

    // Revalidate multiple paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((p: string) => {
        revalidatePath(p, 'layout')
        revalidatedPaths.push(p)
      })
      return NextResponse.json({ revalidated: true, paths: revalidatedPaths })
    }

    // Default: revalidate all common pages and purge all CMS data
    revalidateTag('cms', 'max')
    const defaultPaths = pathsByCollection['default']
    defaultPaths.forEach((p) => revalidatePath(p, 'layout'))
    console.log(`Revalidated tag: cms, paths: ${defaultPaths.join(', ')}`)
    return NextResponse.json({ revalidated: true, tag: 'cms', paths: defaultPaths })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}

// Also allow GET for easy testing (with secret as query param)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const path = searchParams.get('path') || '/'

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath(path, 'layout')
  return NextResponse.json({ revalidated: true, path })
}
