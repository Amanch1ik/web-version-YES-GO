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
    const rawContact = data.phone || data.email
    if (!rawContact) {
      throw new Error('Необходимо указать телефон или email')
    }
    
    // Определяем, является ли это email или телефон
    const isEmail = rawContact.includes('@')
    // Тип для TypeScript, но реальные данные будут в PascalCase
    let loginData: Record<string, string>
    
    // Бэкенд ожидает поля с заглавной буквы (PascalCase)
    // Для логина используется Phone (не PhoneNumber как в регистрации)
    if (isEmail) {
      loginData = {
        Email: rawContact.trim().toLowerCase(),
        Password: data.password
      }
    } else {
      // Очищаем телефон от всех символов кроме цифр и +
      const cleanPhone = rawContact.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
      loginData = {
        Phone: cleanPhone,
        Password: data.password
      }
    }
    
    // Логирование для отладки
    if (import.meta.env.DEV) {
      console.log('Login data being sent:', { ...loginData, Password: '***' })
    }
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, loginData)
    
    // Логирование структуры ответа
    if (import.meta.env.DEV) {
      console.log('Login API response:', {
        status: response.status,
        data: response.data,
        hasToken: !!(response.data as any).token,
        hasUser: !!(response.data as any).user,
        dataKeys: Object.keys(response.data || {})
      })
    }
    
    // Бэкенд возвращает AccessToken и RefreshToken (PascalCase)
    const responseData = response.data as any
    const token = responseData.AccessToken || responseData.token || responseData.accessToken || responseData.access_token
    const refreshToken = responseData.RefreshToken || responseData.refreshToken || responseData.refresh_token
    
    // Объявляем user в правильной области видимости
    let user: User | null = responseData.user || responseData.User || responseData.userData || responseData.data || null
    
    if (token) {
      setToken(token)
      if (refreshToken) {
        setRefreshToken(refreshToken)
      }
      
      // Если пользователя нет в ответе, получаем его через /auth/me
      if (!user) {
        try {
          const userResponse = await api.get<User>(API_ENDPOINTS.AUTH.ME)
          user = userResponse.data
        } catch (error) {
          console.error('Failed to fetch user data:', error)
        }
      }
      
      if (user) {
        // Нормализуем данные пользователя: приводим Id/id к единому формату
        const normalizedUser = {
          ...user,
          id: user.Id || user.id || user.ID || user.Id
        }
        setUser(normalizedUser as User)
      }
      
      // Логирование успешного логина
      if (import.meta.env.DEV) {
        const normalizedUserId = user ? (user.Id || user.id || user.ID) : undefined
        console.log('✅ Login successful!', {
          token: token ? 'saved' : 'missing',
          refreshToken: refreshToken ? 'saved' : 'missing',
          user: user ? 'saved' : 'missing',
          userId: normalizedUserId,
          savedToken: localStorage.getItem('yess_token') ? 'yes' : 'no',
          savedUser: localStorage.getItem('yess_user') ? 'yes' : 'no'
        })
      }
    } else {
      console.error('❌ No token in login response:', responseData)
    }
    
    // Возвращаем данные в правильном формате
    return {
      token: token || '',
      refreshToken: refreshToken || undefined,
      user: user || null
    } as AuthResponse
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
    // Валидация обязательных полей
    if (!data.firstName || !data.firstName.trim()) {
      throw new Error('Имя обязательно для заполнения')
    }
    if (!data.lastName || !data.lastName.trim()) {
      throw new Error('Фамилия обязательна для заполнения')
    }
    if (!data.password || data.password.length < 6) {
      throw new Error('Пароль должен быть не менее 6 символов')
    }
    if (!data.phone || !data.phone.trim()) {
      throw new Error('Телефон обязателен для заполнения')
    }

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

    // Бэкенд ожидает поля с заглавной буквы (PascalCase)
    const registerData: Record<string, unknown> = {
      FirstName: data.firstName.trim(),
      LastName: data.lastName.trim(),
      Password: data.password,
      PhoneNumber: normalizedPhone,
    }
    
    if (data.email && data.email.trim()) {
      registerData.Email = data.email.trim().toLowerCase()
    }

    if (data.referralCode && data.referralCode.trim()) {
      registerData.ReferralCode = data.referralCode.trim()
    }
    
    // Логирование для отладки (только в dev режиме)
    if (import.meta.env.DEV) {
      console.log('Register data being sent:', { ...registerData, password: '***' })
    }
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, registerData)
    
    // Бэкенд возвращает AccessToken и RefreshToken (PascalCase)
    const responseData = response.data as any
    const token = responseData.AccessToken || responseData.token || responseData.accessToken || responseData.access_token
    const refreshToken = responseData.RefreshToken || responseData.refreshToken || responseData.refresh_token
    // Объявляем user в правильной области видимости
    let user: User | null = responseData.user || responseData.User || responseData.userData || responseData.data || null
    
    if (token) {
      setToken(token)
      if (refreshToken) {
        setRefreshToken(refreshToken)
      }
      
      // Если пользователя нет в ответе, получаем его через /auth/me
      if (!user) {
        try {
          const userResponse = await api.get<User>(API_ENDPOINTS.AUTH.ME)
          user = userResponse.data
        } catch (error) {
          console.error('Failed to fetch user data after registration:', error)
        }
      }
      
      if (user) {
        // Нормализуем данные пользователя: приводим Id/id к единому формату
        const normalizedUser = {
          ...user,
          id: user.Id || user.id || user.ID || user.Id
        }
        setUser(normalizedUser as User)
      }
      
      // Логирование успешной регистрации
      if (import.meta.env.DEV) {
        console.log('✅ Registration successful!', {
          token: token ? 'saved' : 'missing',
          refreshToken: refreshToken ? 'saved' : 'missing',
          user: user ? 'saved' : 'missing',
          userId: user ? (user.Id || user.id || user.ID) : undefined
        })
      }
    }
    
    return {
      token: token || '',
      refreshToken: refreshToken || undefined,
      user: user || null
    } as AuthResponse
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
   * Сброс пароля
   */
  resetPassword: async (data: { phone: string; code: string; password: string }): Promise<{ success: boolean; message?: string }> => {
    const cleanPhone = data.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    const response = await api.post<{ success: boolean; message?: string }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      phone: cleanPhone,
      code: data.code,
      password: data.password,
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
    const isDev = import.meta.env.DEV
    const useDirectApi = import.meta.env.VITE_DIRECT_API === 'true'
    const baseUrl = useDirectApi ? `${API_BASE_URL}/api` : (isDev ? '/api' : `${API_BASE_URL}/api`)
    const redirectUri = `${window.location.origin}/auth/google/callback`
    return `${baseUrl}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`
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
   * Обычно бэкенд имеет endpoint, который редиректит на Apple OAuth
   */
  getAppleAuthUrl: (): string => {
    const isDev = import.meta.env.DEV
    const useDirectApi = import.meta.env.VITE_DIRECT_API === 'true'
    const baseUrl = useDirectApi ? `${API_BASE_URL}/api` : (isDev ? '/api' : `${API_BASE_URL}/api`)
    const redirectUri = `${window.location.origin}/auth/apple/callback`
    // Используем APPLE_LOGIN endpoint, который должен редиректить на Apple OAuth страницу
    return `${baseUrl}${API_ENDPOINTS.AUTH.APPLE_LOGIN}?redirect_uri=${encodeURIComponent(redirectUri)}`
  },

  /**
   * Выход из системы
   */
  logout: () => {
    clearStorage()
    window.location.href = '/login'
  },
}
