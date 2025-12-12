import { API_BASE_URL } from '@/config/api'

/**
 * Resolve asset URL from API:
 * - absolute http(s) returned as-is
 * - protocol-relative // -> https:
 * - relative (/uploads/...) prefixed with API_BASE_URL
 */
export const resolveAssetUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined
  const trimmed = url.trim()
  if (trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  const base = API_BASE_URL.replace(/\/$/, '')
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${base}${path}`
}

