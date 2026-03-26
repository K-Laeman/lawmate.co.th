'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Shield, BarChart3, Megaphone, Sliders, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useConsentStore, type CookiePreferences } from '@/lib/stores/consent-store'
import type { CookieConsentData } from '@/lib/cms/getCookieConsent'

interface CookiePreferencesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: CookieConsentData
}

type EditablePreferences = Omit<CookiePreferences, 'essential'>

interface CategoryConfig {
  key: keyof EditablePreferences
  icon: React.ReactNode
  isRequired?: boolean
}

const categoryConfigs: CategoryConfig[] = [
  {
    key: 'analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    key: 'marketing',
    icon: <Megaphone className="w-5 h-5" />,
  },
  {
    key: 'preferences',
    icon: <Sliders className="w-5 h-5" />,
  },
]

export function CookiePreferencesModal({
  open,
  onOpenChange,
  content,
}: CookiePreferencesModalProps) {
  const { preferences: storedPreferences, updatePreferences } = useConsentStore()

  // Local state for editing preferences before saving
  const [localPreferences, setLocalPreferences] = useState<EditablePreferences>({
    analytics: storedPreferences.analytics,
    marketing: storedPreferences.marketing,
    preferences: storedPreferences.preferences,
  })

  // Sync local state when modal opens or stored preferences change
  useEffect(() => {
    if (open) {
      // Use timeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setLocalPreferences({
          analytics: storedPreferences.analytics,
          marketing: storedPreferences.marketing,
          preferences: storedPreferences.preferences,
        })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open, storedPreferences])

  const handleToggle = (category: keyof EditablePreferences) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = () => {
    updatePreferences(localPreferences)
    onOpenChange(false)
    // Announce save to screen readers and show visual confirmation
    toast.success('บันทึกการตั้งค่าคุกกี้แล้ว', {
      description: 'การตั้งค่าของคุณได้รับการบันทึกเรียบร้อยแล้ว',
    })
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {content.preferences.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {content.preferences.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Essential Cookies - Always ON */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-navy-dark/10">
                <Shield className="w-5 h-5 text-navy-dark" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <Label className="text-base font-semibold text-navy-dark">
                    {content.categories.essential.title}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    <Switch
                      checked
                      disabled
                      aria-label={`${content.categories.essential.title} - เปิดใช้งานเสมอ`}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {content.categories.essential.description}
                </p>
              </div>
            </div>
          </div>

          {/* Configurable Categories */}
          {categoryConfigs.map((config) => {
            const categoryContent = content.categories[config.key]
            const isEnabled = localPreferences[config.key]

            return (
              <div
                key={config.key}
                className="p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                      isEnabled ? 'bg-primary/10' : 'bg-gray-100'
                    }`}
                  >
                    <span className={isEnabled ? 'text-primary' : 'text-gray-400'}>
                      {config.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <Label
                        htmlFor={`cookie-${config.key}`}
                        className="text-base font-semibold text-navy-dark cursor-pointer"
                      >
                        {categoryContent.title}
                      </Label>
                      <Switch
                        id={`cookie-${config.key}`}
                        checked={isEnabled}
                        onCheckedChange={() => handleToggle(config.key)}
                      />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {categoryContent.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handleCancel} className="sm:order-1">
            {content.preferences.cancelText}
          </Button>
          <Button onClick={handleSave} className="sm:order-2">
            {content.preferences.saveText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Standalone trigger button for opening cookie preferences.
 * Use this in footer or settings page.
 */
export function CookiePreferencesButton({
  children,
  content,
  className,
}: {
  children?: React.ReactNode
  content: CookieConsentData
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children || content.banner.customizeText}
      </button>
      <CookiePreferencesModal
        open={isOpen}
        onOpenChange={setIsOpen}
        content={content}
      />
    </>
  )
}
