import { API_BASE_URL } from '@/config/api'

/**
 * Resolve asset URL from API:
 * - absolute http(s) returned as-is
 * - protocol-relative // -> https:
 * - relative (/uploads/...) prefixed with API_BASE_URL
 * - empty/null returns undefined
 */
export const resolveAssetUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined
  
  const trimmed = url.trim()
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return undefined
  
  // Data URLs (base64 images)
  if (trimmed.startsWith('data:')) return trimmed
  
  // Absolute URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  
  // Protocol-relative URLs
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }
  
  // Relative URLs - prefix with API base URL
  const base = API_BASE_URL.replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

// Lightweight helper to reference local image assets from /src/Resources/Images
export const imageResource = (filename: string): string => `/src/Resources/Images/${filename}`

// Helper to reference images from design_app_veb subfolder
export const designImageResource = (filename: string): string => `/src/Resources/Images/design_app_veb/${filename}`

