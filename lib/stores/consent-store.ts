import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CookiePreferences {
  essential: true // Always true, cannot be changed
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

// Current consent policy version - increment when policy changes to trigger re-consent
export const CONSENT_VERSION = '1.0'

export interface ConsentState {
  // Whether user has made a consent choice
  hasConsented: boolean
  // ISO date string when consent was given
  consentDate: string | null
  // Version of consent policy user agreed to
  consentVersion: string | null
  // Cookie category preferences
  preferences: CookiePreferences
  // Hydration state for SSR
  _hasHydrated: boolean

  // Actions
  acceptAll: () => void
  rejectAll: () => void
  updatePreferences: (prefs: Partial<Omit<CookiePreferences, 'essential'>>) => void
  resetConsent: () => void
  setHasHydrated: (state: boolean) => void
}

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

// Custom storage with validation to handle corrupted/malicious localStorage data
const createValidatedStorage = () => ({
  getItem: (name: string): string | null => {
    try {
      const item = localStorage.getItem(name)
      if (!item) return null

      const parsed = JSON.parse(item)
      const state = parsed?.state

      // Validate required structure
      if (
        typeof state?.hasConsented !== 'boolean' ||
        typeof state?.preferences !== 'object' ||
        state?.preferences === null
      ) {
        localStorage.removeItem(name)
        return null
      }

      // Validate preferences structure
      const prefs = state.preferences
      if (
        prefs.essential !== true ||
        typeof prefs.analytics !== 'boolean' ||
        typeof prefs.marketing !== 'boolean' ||
        typeof prefs.preferences !== 'boolean'
      ) {
        localStorage.removeItem(name)
        return null
      }

      return item
    } catch {
      // Remove corrupted data
      try {
        localStorage.removeItem(name)
      } catch {
        // localStorage might be unavailable (private browsing)
      }
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // localStorage might be full or unavailable (private browsing)
      // Silently fail - user will just see banner again next visit
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch {
      // localStorage might be unavailable
    }
  },
})

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      hasConsented: false,
      consentDate: null,
      consentVersion: null,
      preferences: { ...defaultPreferences },
      _hasHydrated: false,

      acceptAll: () =>
        set({
          hasConsented: true,
          consentDate: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          preferences: {
            essential: true,
            analytics: true,
            marketing: true,
            preferences: true,
          },
        }),

      rejectAll: () =>
        set({
          hasConsented: true,
          consentDate: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          preferences: {
            essential: true, // Essential always stays true
            analytics: false,
            marketing: false,
            preferences: false,
          },
        }),

      updatePreferences: (prefs) =>
        set((state) => ({
          hasConsented: true,
          consentDate: new Date().toISOString(),
          consentVersion: CONSENT_VERSION,
          preferences: {
            ...state.preferences,
            ...prefs,
            essential: true, // Essential always stays true
          },
        })),

      resetConsent: () =>
        set({
          hasConsented: false,
          consentDate: null,
          consentVersion: null,
          preferences: { ...defaultPreferences },
        }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'lawmate-cookie-consent',
      storage: createJSONStorage(createValidatedStorage),
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        consentDate: state.consentDate,
        consentVersion: state.consentVersion,
        preferences: state.preferences,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true
          // Check if consent version is outdated - require re-consent
          if (state.hasConsented && state.consentVersion !== CONSENT_VERSION) {
            state.hasConsented = false
            state.consentVersion = null
          }
        }
      },
    }
  )
)
