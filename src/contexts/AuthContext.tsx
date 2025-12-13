import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { getUser, getToken, setUser, clearStorage } from '@/utils/storage'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  updateUser: (userData: User) => void
  refreshAuth: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(() => {
    const token = getToken()
    const userData = getUser()
    
    // Бэкенд может возвращать Id или id
    const userId = userData?.id || userData?.Id || userData?.ID
    
    if (token && userData && userId) {
      setUserState(userData)
      setIsAuthenticated(true)
    } else {
      setUserState(null)
      setIsAuthenticated(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Проверяем авторизацию при монтировании
    checkAuth()
    
    // Проверяем авторизацию при изменении storage (для синхронизации между вкладками)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'yess_token' || e.key === 'yess_user') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Проверяем при фокусе окна (только если нет данных в состоянии)
    const handleFocus = () => {
      if (!isAuthenticated) {
        checkAuth()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [checkAuth, isAuthenticated])

  const updateUser = useCallback((userData: User) => {
    // Убеждаемся, что токен есть
    const token = getToken()
    
    if (import.meta.env.DEV) {
      console.log('AuthContext.updateUser called:', {
        hasToken: !!token,
        hasUserData: !!userData,
        userId: userData?.id
      })
    }
    
    if (token && userData) {
      // Сначала обновляем localStorage (если еще не обновлено)
      const currentUser = getUser()
      if (!currentUser || currentUser.id !== userData.id) {
        setUser(userData)
      }
      
      // Затем обновляем состояние СИНХРОННО и СРАЗУ
      // Используем функциональное обновление для гарантии
      setUserState((prev) => {
        // Если данные уже есть и совпадают, возвращаем их
        if (prev?.id === userData.id) {
          return prev
        }
        return userData
      })
      setIsAuthenticated(true)
      setLoading(false)
      
      if (import.meta.env.DEV) {
        console.log('AuthContext: User state updated, isAuthenticated = true')
      }
    } else {
      // Если нет токена или данных, сбрасываем состояние
      setUserState(null)
      setIsAuthenticated(false)
      setLoading(false)
      
      if (import.meta.env.DEV) {
        console.warn('AuthContext: No token or userData, resetting state')
      }
    }
  }, [])

  const refreshAuth = useCallback(() => {
    checkAuth()
  }, [checkAuth])

  const logout = useCallback(() => {
    clearStorage()
    setUserState(null)
    setIsAuthenticated(false)
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        updateUser,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

