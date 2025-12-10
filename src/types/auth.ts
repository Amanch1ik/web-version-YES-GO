export interface LoginRequest {
  phone?: string
  email?: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email?: string
  password: string
  phone: string
  referralCode?: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  expiresIn?: number
  user: User
}

export interface User {
  id: string | number
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  fullName?: string
  avatarUrl?: string
  isActive: boolean
  isVerified?: boolean
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  cityId?: number
  city?: string
  referralCode?: string
  level?: number
  levelName?: string
  totalCoins?: number
  totalCashback?: number
  createdAt?: string
  updatedAt?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  email?: string
  phone?: string
  cityId?: number
  avatarUrl?: string
}

export interface UpdateProfileResponse {
  user: User
  message?: string
}

export interface SendCodeRequest {
  phone: string
  type?: 'login' | 'register' | 'reset'
}

export interface SendCodeResponse {
  success: boolean
  message?: string
  expiresIn?: number
  retryAfter?: number
}

export interface VerifyCodeRequest {
  phone: string
  code: string
}

export interface VerifyCodeResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken?: string
  expiresIn?: number
}

// Social OAuth
export interface SocialLoginRequest {
  idToken: string
  accessToken?: string
  provider: 'google' | 'apple'
}

export interface SocialLoginResponse extends AuthResponse {
  isNewUser?: boolean
}
