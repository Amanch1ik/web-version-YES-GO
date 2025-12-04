import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth'
import { setToken, setUser, clearStorage } from '@/utils/storage'

// Функция для проверки DEV режима (вызывается каждый раз)
const checkDevMode = () => {
  return import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Режим разработки - пропускаем проверку сервера
    const currentDevMode = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    
    if (currentDevMode) {
      console.log('🚀 DEV MODE: Bypassing API, creating mock user')
      console.log('🚀 DEV MODE: isDevMode check:', { 
        DEV: import.meta.env.DEV, 
        VITE_DEV_MODE: import.meta.env.VITE_DEV_MODE,
        currentDevMode 
      })
      
      try {
        // Небольшая задержка для имитации запроса
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const mockUser: AuthResponse = {
          token: 'dev-token-' + Date.now(),
          user: {
            id: 'dev-user-id-' + Date.now(),
            email: data.email || data.phone || 'dev@example.com',
            phone: data.phone || '+996555123456',
            firstName: 'Dev',
            lastName: 'User',
            fullName: 'Dev User',
            isActive: true,
          },
        }
        
        console.log('🚀 DEV MODE: Setting token and user', mockUser)
        
        try {
          setToken(mockUser.token)
          setUser(mockUser.user)
          
          // Проверяем, что данные сохранились
          const savedToken = localStorage.getItem('yess_token')
          const savedUser = localStorage.getItem('yess_user')
          console.log('🚀 DEV MODE: Saved to localStorage', { 
            token: !!savedToken, 
            user: !!savedUser,
            userData: savedUser ? JSON.parse(savedUser) : null
          })
          
          if (!savedToken || !savedUser) {
            throw new Error('Failed to save to localStorage')
          }
        } catch (storageError) {
          console.error('🚀 DEV MODE: Storage error:', storageError)
          throw new Error('Не удалось сохранить данные авторизации')
        }
        
        // Даем время на сохранение в localStorage
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('🚀 DEV MODE: Returning mock user', mockUser)
        return mockUser
      } catch (error) {
        console.error('🚀 DEV MODE: Error in dev login:', error)
        throw error
      }
    }

    // Если есть email, используем его, иначе phone
    let loginData: any
    
    if (data.email) {
      loginData = { 
        email: data.email.trim(), 
        password: data.password 
      }
    } else if (data.phone) {
      // Очищаем номер телефона от пробелов и форматируем
      const cleanPhone = data.phone.replace(/\s+/g, '').trim()
      loginData = { 
        phone: cleanPhone, 
        password: data.password 
      }
    } else {
      throw new Error('Необходимо указать email или телефон')
    }
    
    console.log('Login request data:', JSON.stringify(loginData, null, 2))
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH_LOGIN, loginData)
    if (response.data.token) {
      setToken(response.data.token)
      setUser(response.data.user)
    }
    return response.data
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // Режим разработки - пропускаем проверку сервера
    if (checkDevMode()) {
      // Небольшая задержка для имитации запроса
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const mockUser: AuthResponse = {
        token: 'dev-token-' + Date.now(),
        user: {
          id: 'dev-user-id',
          email: data.email || 'dev@example.com',
          phone: data.phone,
          firstName: data.firstName || 'Dev',
          lastName: data.lastName || 'User',
          fullName: `${data.firstName || 'Dev'} ${data.lastName || 'User'}`,
          isActive: true,
        },
      }
      setToken(mockUser.token)
      setUser(mockUser.user)
      
      // Даем время на сохранение в localStorage
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return mockUser
    }

    // Очищаем и форматируем данные
    const cleanPhone = data.phone?.replace(/\s+/g, '').replace(/[^\d+]/g, '').trim()
    
    const registerData: any = {
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim(),
      email: data.email?.trim().toLowerCase(),
      password: data.password,
    }
    
    // Добавляем телефон (обязательное поле)
    if (cleanPhone) {
      registerData.phone = cleanPhone
    }
    
    console.log('Register request data:', JSON.stringify(registerData, null, 2))
    
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH_REGISTER, registerData)
    if (response.data.token) {
      setToken(response.data.token)
      setUser(response.data.user)
    }
    return response.data
  },

  logout: () => {
    clearStorage()
    window.location.href = '/login'
  },
}

