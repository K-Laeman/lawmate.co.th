import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Shield,
  Users,
  Heart,
  Target,
  Star,
  ShieldCheck,
  MessageCircle,
  CheckCircle,
  Gavel,
  HelpCircle,
  TrendingUp,
  UserCheck,
  Briefcase,
  Globe,
  Award,
  Book,
  Rocket,
  Scale,
  Calendar,
  Lock,
  FileCheck,
  Headphones,
  Search,
  ExternalLink,
  Check,
} from 'lucide-react'

// Type for the Lucide icons module
type LucideIconsModule = typeof LucideIcons

// Priority icons map to ensure critical icons are always available
// regardless of tree-shaking or dynamic import issues
const PRIORITY_ICONS: Record<string, LucideIcon> = {
  Shield,
  Users,
  Heart,
  Target,
  Star,
  ShieldCheck,
  MessageCircle,
  CheckCircle,
  Gavel,
  HelpCircle,
  TrendingUp,
  UserCheck,
  Briefcase,
  Globe,
  Award,
  Book,
  Rocket,
  Scale,
  Calendar,
  Lock,
  FileCheck,
  Headphones,
  Search,
  ExternalLink,
  Check,
}

// Map of commonly used icon names to their Lucide equivalents
// This handles variations in naming conventions
const iconAliases: Record<string, string> = {
  // Common variations
  'help-circle': 'HelpCircle',
  'help': 'HelpCircle',
  'credit-card': 'CreditCard',
  'video': 'Video',
  'shield': 'Shield',
  'users': 'Users',
  'clock': 'Clock',
  'message-circle': 'MessageCircle',
  'map-pin': 'MapPin',
  'phone': 'Phone',
  'mail': 'Mail',
  'check-circle': 'CheckCircle',
  'arrow-right': 'ArrowRight',
  'scale': 'Scale',
  'gavel': 'Gavel',
  'building': 'Building',
  'building2': 'Building2',
  'file-text': 'FileText',
  'heart': 'Heart',
  'target': 'Target',
  'rocket': 'Rocket',
  'award': 'Award',
  'book': 'Book',
  'star': 'Star',
  'trending-up': 'TrendingUp',
  'briefcase': 'Briefcase',
  'user-check': 'UserCheck',
  'calendar': 'Calendar',
  'message-square': 'MessageSquare',
  'lock': 'Lock',
  'file-check': 'FileCheck',
  'headphones': 'Headphones',
  'search': 'Search',
  'linkedin': 'Linkedin',
  'twitter': 'Twitter',
  'globe': 'Globe',
  'external-link': 'ExternalLink',
  'check': 'Check',
  'shield-check': 'ShieldCheck',
}

/**
 * Maps a CMS icon string to a Lucide React component
 * Handles PascalCase, kebab-case, and common variations
 *
 * @param iconName - The icon name from CMS (e.g., "Shield", "help-circle", "HelpCircle")
 * @returns The Lucide icon component or null if not found
 *
 * @example
 * const Icon = getIcon('Shield')
 * if (Icon) return <Icon className="w-5 h-5" />
 */
export function getIcon(iconName: string | undefined | null): LucideIcon | null {
  if (!iconName) return null

  // Clean up the icon name
  const cleanName = iconName.trim()

  // Check priority map first
  if (PRIORITY_ICONS[cleanName]) return PRIORITY_ICONS[cleanName]

  // Check if it's a known alias (kebab-case or lowercase)
  const aliasKey = cleanName.toLowerCase()
  const aliasedName = iconAliases[aliasKey]

  // Determine the final icon name to look up
  const lookupName = aliasedName || cleanName

  // Check priority map again with mapped name
  if (PRIORITY_ICONS[lookupName]) return PRIORITY_ICONS[lookupName]

  // Try to get the icon from Lucide
  const icons = LucideIcons as LucideIconsModule
  const icon = icons[lookupName as keyof LucideIconsModule]

  // Verify it's actually a component (not a utility function or type)
  if (typeof icon === 'function' && 'displayName' in icon && icon.displayName) {
    return icon as LucideIcon
  }

  // Try PascalCase conversion from kebab-case
  if (cleanName.includes('-')) {
    const pascalCase = cleanName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('')

    const pascalIcon = icons[pascalCase as keyof LucideIconsModule]
    if (typeof pascalIcon === 'function' && 'displayName' in pascalIcon && pascalIcon.displayName) {
      return pascalIcon as LucideIcon
    }
  }

  // Return null if icon not found
  return null
}

/**
 * Get an icon with a fallback
 * Returns the fallback icon if the requested icon is not found
 *
 * @example
 * const Icon = getIconWithFallback('UnknownIcon', 'HelpCircle')
 */
export function getIconWithFallback(
  iconName: string | undefined | null,
  fallbackName: string = 'HelpCircle'
): LucideIcon {
  const icon = getIcon(iconName)
  if (icon) return icon

  const fallback = getIcon(fallbackName)
  if (fallback) return fallback

  // Ultimate fallback to HelpCircle
  return LucideIcons.HelpCircle
}
