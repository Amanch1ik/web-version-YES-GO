export interface LoginRequest {
  phone?: string
  email?: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}

export interface User {
  id: string
  phone?: string
  email?: string
  firstName?: string
  lastName?: string
  fullName?: string
  isActive: boolean
  birthDate?: string
  gender?: 'male' | 'female'
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  birthDate?: string
  gender?: 'male' | 'female'
  email?: string
  phone?: string
}

export interface UpdateProfileResponse {
  user: User
  message?: string
}

