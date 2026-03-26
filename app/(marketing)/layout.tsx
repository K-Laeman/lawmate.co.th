import { getNavigationMenus, getSiteSettings } from '@/lib/cms'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navData, siteSettings] = await Promise.all([
    getNavigationMenus('th'),
    getSiteSettings('th'),
  ])

  const activeNavItems = navData?.headerNav?.filter((item) => item.isActive !== false)

  return (
    <>
      <Header
        navItems={activeNavItems}
        headerCta={navData?.headerCta}
      />
      {children}
      <Footer
        siteSettings={siteSettings}
        navSections={navData?.footerSections}
        footerBrandName={navData?.footerBrandName}
        footerBrandSubtitle={navData?.footerBrandSubtitle}
        footerTagline={navData?.footerTagline}
        copyrightText={navData?.copyrightText}
        footerBottomTagline={navData?.footerBottomTagline}
      />
    </>
  )
}
