'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Cookie, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useConsentStore } from '@/lib/stores/consent-store'
import { CookiePreferencesModal } from './cookie-preferences-modal'
import type { CookieConsentData } from '@/lib/cms/getCookieConsent'

/**
 * Delay before showing banner after page load.
 * Prevents flash during hydration and allows page content to render first.
 */
const BANNER_SHOW_DELAY_MS = 500

interface CookieConsentBannerProps {
  content: CookieConsentData
}

export function CookieConsentBanner({ content }: CookieConsentBannerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)
  const { hasConsented, _hasHydrated, acceptAll, rejectAll } = useConsentStore()

  useEffect(() => {
    // Only show banner after hydration and if user hasn't consented
    if (_hasHydrated && !hasConsented) {
      const timer = setTimeout(() => setIsVisible(true), BANNER_SHOW_DELAY_MS)
      return () => clearTimeout(timer)
    } else if (_hasHydrated && hasConsented) {
      // Use timeout to avoid synchronous setState in effect
      const hideTimer = setTimeout(() => setIsVisible(false), 0)
      return () => clearTimeout(hideTimer)
    }
  }, [_hasHydrated, hasConsented])

  // Focus banner when it becomes visible for accessibility
  useEffect(() => {
    if (isVisible && bannerRef.current) {
      // Focus the banner container for screen reader announcement
      bannerRef.current.focus()
    }
  }, [isVisible])

  const handleAcceptAll = () => {
    acceptAll()
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    rejectAll()
    setIsVisible(false)
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    // Banner will hide automatically after consent is saved in modal
  }

  if (!isVisible && !isModalOpen) {
    return null
  }

  return (
    <>
      {/* Banner */}
      {isVisible && (
        <div
          ref={bannerRef}
          tabIndex={-1}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 outline-none"
          role="region"
          aria-label={content.banner.title}
          aria-live="polite"
        >
          <div className="container-wide mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Icon and Content */}
                <div className="flex-1 flex gap-4">
                  <div className="flex-shrink-0 hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <Cookie className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-navy-dark mb-2">
                      {content.banner.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {content.banner.description}{' '}
                      <Link
                        href="/privacy"
                        className="text-primary hover:underline font-medium"
                      >
                        {content.banner.privacyLinkText}
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:flex-shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="order-3 sm:order-1"
                  >
                    {content.banner.rejectAllText}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleOpenModal}
                    className="order-2 gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    {content.banner.customizeText}
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    className="order-1 sm:order-3"
                  >
                    {content.banner.acceptAllText}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        content={content}
      />
    </>
  )
}
