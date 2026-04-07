import { cookies } from 'next/headers'
import { getNavigationMenus, getSiteSettings } from '@/lib/cms'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

async function getCurrentUser() {
  const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:3000';
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (!cookieHeader) return null;

    const res = await fetch(`${dashboardUrl}/api/v1/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [navData, siteSettings, currentUser] = await Promise.all([
    getNavigationMenus('th'),
    getSiteSettings('th'),
    getCurrentUser(),
  ])

  const activeNavItems = navData?.headerNav?.filter((item) => item.isActive !== false)

  return (
    <>
      <Header
        navItems={activeNavItems}
        headerCta={navData?.headerCta}
        currentUser={currentUser}
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
