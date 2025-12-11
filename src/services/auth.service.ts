import api from './api'
import { API_ENDPOINTS, API_BASE_URL } from '@/config/api'
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  SendCodeRequest,
  SendCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SocialLoginRequest,
  SocialLoginResponse
} from '@/types/auth'
import { ReferralStats } from '@/types/referral'
import { setToken, setRefreshToken, setUser, clearStorage, getRefreshToken } from '@/utils/storage'

export const authService = {
  /**
   * Вход по телефону/email и паролю
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const rawPhone = data.phone || data.email
    if (!rawPhone) {
      throw new Error('Необходимо указать телефон')
    }
    const cleanPhone = rawPhone.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    
    const loginData = { 
      phone: cleanPhone, 
      password: data.password 
    }
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, loginData)
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Вход по JSON (альтернативный формат)
   */
  loginJson: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN_JSON, data)
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Регистрация нового пользователя
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const cleanPhone = data.phone?.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    // Нормализуем телефон под формат API: начинаем с +996 и 9 цифр
    let normalizedPhone = cleanPhone
    if (cleanPhone) {
      const digits = cleanPhone.replace(/[^\d]/g, '')
      if (digits.length === 9) {
        normalizedPhone = `+996${digits}`
      } else if (digits.length === 10 && digits.startsWith('0')) {
        normalizedPhone = `+996${digits.slice(1)}`
      } else if (digits.length === 12 && digits.startsWith('996')) {
        normalizedPhone = `+${digits}`
      } else if (!cleanPhone.startsWith('+')) {
        normalizedPhone = `+${digits}`
      }
    }

    const registerData: Record<string, unknown> = {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      password: data.password,
    }
    
    if (data.email) {
      registerData.email = data.email.trim().toLowerCase()
    }
    
    if (normalizedPhone) {
      registerData.phone = normalizedPhone
    }

    if (data.referralCode) {
      registerData.referralCode = data.referralCode.trim()
    }
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, registerData)
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Отправить код верификации на телефон
   */
  sendCode: async (data: SendCodeRequest): Promise<SendCodeResponse> => {
    const cleanPhone = data.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    const response = await api.post<SendCodeResponse>(API_ENDPOINTS.AUTH.SEND_CODE, {
      phone: cleanPhone,
      type: data.type || 'login'
    })
    return response.data
  },

  /**
   * Отправить код верификации (альтернативный endpoint)
   */
  sendVerificationCode: async (phone: string): Promise<SendCodeResponse> => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    const response = await api.post<SendCodeResponse>(API_ENDPOINTS.AUTH.SEND_VERIFICATION_CODE, {
      phone: cleanPhone
    })
    return response.data
  },

  /**
   * Проверить код верификации
   */
  verifyCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const cleanPhone = data.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    const response = await api.post<VerifyCodeResponse>(API_ENDPOINTS.AUTH.VERIFY_CODE, {
      phone: cleanPhone,
      code: data.code
    })
    
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.user) {
        setUser(response.data.user)
      }
    }
    return response.data
  },

  /**
   * Получить текущего пользователя
   */
  getMe: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.AUTH.ME)
    if (response.data) {
      setUser(response.data)
    }
    return response.data
  },

  /**
   * Обновить токен
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await api.post<RefreshTokenResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken
    } as RefreshTokenRequest)
    
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
    }
    return response.data
  },

  /**
   * Получить статистику рефералов
   */
  getReferralStats: async (): Promise<ReferralStats> => {
    const response = await api.get<ReferralStats>(API_ENDPOINTS.AUTH.REFERRAL_STATS)
    return response.data
  },

  /**
   * Вход через Google
   */
  loginWithGoogle: async (idToken: string): Promise<SocialLoginResponse> => {
    const response = await api.post<SocialLoginResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
      idToken,
      provider: 'google'
    } as SocialLoginRequest)
    
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Получить URL для Google OAuth
   */
  getGoogleAuthUrl: (): string => {
    const redirectUri = `${window.location.origin}/auth/google/callback`
    return `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`
  },

  /**
   * Вход через Apple
   */
  loginWithApple: async (idToken: string, authorizationCode?: string): Promise<SocialLoginResponse> => {
    const response = await api.post<SocialLoginResponse>(API_ENDPOINTS.AUTH.APPLE_LOGIN, {
      idToken,
      authorizationCode,
      provider: 'apple'
    })
    
    if (response.data.token) {
      setToken(response.data.token)
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken)
      }
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Получить URL для Apple OAuth
   */
  getAppleAuthUrl: (): string => {
    const redirectUri = `${window.location.origin}/auth/apple/callback`
    return `${API_BASE_URL}/api${API_ENDPOINTS.AUTH.APPLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`
  },

  /**
   * Выход из системы
   */
  logout: () => {
    clearStorage()
    window.location.href = '/login'
  },
}
