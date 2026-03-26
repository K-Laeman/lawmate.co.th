import { fetchFromCMS } from './client'

export interface NavItem {
  label: string
  href: string
  isActive?: boolean
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  titleHref?: string
  links: FooterLink[]
}

export interface NavigationData {
  headerNav?: NavItem[]
  headerCta?: {
    clientButtonText?: string
    lawyerButtonText?: string
    lawyerLoginText?: string
    lawyerRegisterText?: string
  }
  footerBrandName?: string
  footerBrandSubtitle?: string
  footerSections?: FooterSection[]
  footerTagline?: string
  copyrightText?: string
  footerBottomTagline?: string
}

export async function getNavigationMenus(locale: string = 'th'): Promise<NavigationData | null> {
  try {
    const data = await fetchFromCMS<NavigationData>(
      `/globals/navigation-menus?locale=${locale}`,
      { next: { revalidate: 60, tags: ['cms', 'navigation-menus'] } }
    )
    return data
  } catch (error) {
    console.error('Error fetching navigation menus:', error)
    return null
  }
}
