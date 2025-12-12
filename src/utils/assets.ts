import { API_BASE_URL } from '@/config/api'

/**
 * Resolve asset URL from API:
 * - absolute http(s) returned as-is
 * - protocol-relative // -> https:
 * - relative (/uploads/...) prefixed with API_BASE_URL
 */
export const resolveAssetUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('//')) return `https:${url}`
  const base = API_BASE_URL.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${base}${path}`
}

