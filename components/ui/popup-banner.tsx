'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'
import Link from 'next/link'

export interface PopupBannerData {
  id?: number | string
  enabled?: boolean
  displayMode?: 'standard' | 'image-only'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'wide'
  title?: string
  description?: string
  image?: { url: string; alt?: string }
  primaryButton?: { text: string; url: string }
  secondaryButton?: { text: string; url: string }
  showDontShowAgain?: boolean
  dontShowAgainText?: string
  delay?: number // delay in ms before showing
}

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  wide: 'max-w-2xl',
}

interface PopupBannerProps {
  data?: PopupBannerData | null
}

const STORAGE_KEY_PREFIX = 'lawmate-popup-dismissed'

function BannerImage({ url, alt, className }: { url: string; alt: string; className: string }) {
  const isSvg = url.toLowerCase().endsWith('.svg') || url.includes('.svg?')
  if (isSvg) {
    // <object> allows SVG animations to play (SMIL/CSS); <img> sandboxes them
    return (
      <object data={url} type="image/svg+xml" aria-label={alt} className={className}>
        <img src={url} alt={alt} className={className} />
      </object>
    )
  }
  return <img src={url} alt={alt} className={className} />
}

export function PopupBanner({ data }: PopupBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  // Generate storage key based on banner id
  const storageKey = data?.id
    ? `${STORAGE_KEY_PREFIX}-${data.id}`
    : STORAGE_KEY_PREFIX

  useEffect(() => {
    // Check if user has dismissed this specific popup before
    const dismissed = localStorage.getItem(storageKey)
    if (dismissed === 'true') {
      return
    }

    // Show popup after delay (default 2 seconds)
    const delay = data?.delay ?? 2000
    const timer = setTimeout(() => {
      if (data?.enabled !== false) {
        setIsVisible(true)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [data?.enabled, data?.delay, storageKey])

  const handleClose = () => {
    setIsClosing(true)

    // Save preference if "don't show again" is checked
    if (dontShowAgain) {
      localStorage.setItem(storageKey, 'true')
    }

    // Wait for animation to complete
    setTimeout(() => {
      setIsVisible(false)
      setIsClosing(false)
    }, 300)
  }

  if (!isVisible) return null

  const showDontShowAgain = data?.showDontShowAgain !== false
  const dontShowAgainText = data?.dontShowAgainText ?? 'ไม่ต้องแสดงอีก'
  const isImageOnly = data?.displayMode === 'image-only'
  const sizeClass = SIZE_CLASSES[data?.size ?? 'md'] ?? 'max-w-md'

  // Default content if no CMS data (standard mode only)
  const title = data?.title ?? 'ยินดีต้อนรับสู่เพื่อนทนาย'
  const description = data?.description ?? 'ปรึกษาทนายความออนไลน์ได้ทันที รับส่วนลดพิเศษสำหรับลูกค้าใหม่'
  const primaryButton = data?.primaryButton ?? { text: 'เริ่มปรึกษาเลย', url: '/booking' }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl ${sizeClass} w-full overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
          aria-label="ปิด"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {isImageOnly ? (
          /* Image-only layout */
          <>
            {data?.image?.url && (
              <BannerImage
                url={data.image.url}
                alt={data.image.alt ?? ''}
                className="w-full object-contain max-h-[80vh]"
              />
            )}
            {showDontShowAgain && (
              <div className="px-4 py-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  {dontShowAgainText}
                </label>
              </div>
            )}
          </>
        ) : (
          /* Standard layout */
          <>
            {/* Image */}
            {data?.image?.url && (
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                <BannerImage
                  url={data.image.url}
                  alt={data.image.alt ?? ''}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Decorative gradient bar */}
              {!data?.image?.url && (
                <div className="h-2 w-20 bg-gradient-to-r from-primary to-primary/60 rounded-full mb-4" />
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>

              <p className="text-gray-600 mb-6">
                {description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="flex-1">
                  <Link href={primaryButton.url}>
                    {primaryButton.text}
                  </Link>
                </Button>

                {data?.secondaryButton?.url && data?.secondaryButton?.text && (
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={data.secondaryButton.url}>
                      {data.secondaryButton.text}
                    </Link>
                  </Button>
                )}
              </div>

              {/* Don't show again checkbox */}
              {showDontShowAgain && (
                <label className="flex items-center gap-2 mt-4 cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  {dontShowAgainText}
                </label>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
