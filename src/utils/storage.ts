import { User } from '@/types/auth'

const TOKEN_KEY = 'yess_token'
const REFRESH_TOKEN_KEY = 'yess_refresh_token'
const USER_KEY = 'yess_user'
const CITY_KEY = 'yess_city'
const SELECTED_CATEGORY_KEY = 'yess_selected_category'
const FINIK_API_KEY = 'finik_api_key'
const FINIK_SECRET_KEY = 'finik_secret_key'

// Token management
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// Refresh Token management
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// User management
export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const getUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY)
  try {
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

// City management
export const setCity = (city: { id: number; name: string }): void => {
  localStorage.setItem(CITY_KEY, JSON.stringify(city))
}

export const getCity = (): { id: number; name: string } | null => {
  const city = localStorage.getItem(CITY_KEY)
  try {
    return city ? JSON.parse(city) : null
  } catch {
    return null
  }
}

export const removeCity = (): void => {
  localStorage.removeItem(CITY_KEY)
}

// Category management
export const setSelectedCategory = (categoryId: number): void => {
  localStorage.setItem(SELECTED_CATEGORY_KEY, categoryId.toString())
}

export const getSelectedCategory = (): number | null => {
  const categoryId = localStorage.getItem(SELECTED_CATEGORY_KEY)
  return categoryId ? parseInt(categoryId, 10) : null
}

export const removeSelectedCategory = (): void => {
  localStorage.removeItem(SELECTED_CATEGORY_KEY)
}

// Finik API Keys management
export const setFinikKeys = (apiKey: string, secretKey: string): void => {
  localStorage.setItem(FINIK_API_KEY, apiKey)
  localStorage.setItem(FINIK_SECRET_KEY, secretKey)
}

export const getFinikKeys = (): { apiKey: string; secretKey: string } | null => {
  const apiKey = localStorage.getItem(FINIK_API_KEY)
  const secretKey = localStorage.getItem(FINIK_SECRET_KEY)
  if (apiKey && secretKey) {
    return { apiKey, secretKey }
  }
  return null
}

export const removeFinikKeys = (): void => {
  localStorage.removeItem(FINIK_API_KEY)
  localStorage.removeItem(FINIK_SECRET_KEY)
}

// Clear all storage
export const clearStorage = (): void => {
  removeToken()
  removeRefreshToken()
  removeUser()
  removeCity()
  removeSelectedCategory()
  removeFinikKeys()
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken()
  const user = getUser()
  return !!(token && user && user.id)
}
