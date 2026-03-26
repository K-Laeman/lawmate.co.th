import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Noto_Sans_Thai, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { FloatingHotline } from "@/components/layout/floating-hotline";
import { PageTransition } from "@/components/layout/page-transition";
import { CookieConsentWrapper } from "@/components/ui/cookie-consent-wrapper";
import { SITE_CONFIG, KEYWORDS, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { getSiteSettings, getTrackingSettings } from "@/lib/cms";
import { TrackingHeadScripts, TrackingBodyScripts } from "@/components/layout/tracking-scripts";
import "./globals.css";

const googleSans = Noto_Sans_Thai({
  variable: "--font-google-sans",
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: "%s | เพื่อนทนาย by LawMate",
  },
  description: SITE_CONFIG.defaultDescription,
  keywords: KEYWORDS,
  authors: [{ name: "LawMate Co., Ltd." }],
  creator: "LawMate",
  publisher: "LawMate Co., Ltd.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    type: "website",
    locale: "th_TH",
    alternateLocale: "en_US",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [siteSettings, tracking] = await Promise.all([
    getSiteSettings('th'),
    getTrackingSettings(),
  ]);

  return (
    <html lang="th">
      <head>
        <TrackingHeadScripts tracking={tracking} />
      </head>
      <body
        className={`${googleSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <TrackingBodyScripts tracking={tracking} />
        <Suspense fallback={null}>
          <PageTransition />
        </Suspense>
        {children}
        <FloatingHotline
          phoneNumber={siteSettings?.phone}
          lineId={siteSettings?.lineId}
          enabled={siteSettings?.showFloatingButton ?? true}
        />
        <Suspense fallback={null}>
          <CookieConsentWrapper />
        </Suspense>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
