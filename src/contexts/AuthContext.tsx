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
    
    if (token && userData) {
      setUserState(userData)
      setIsAuthenticated(true)
    } else {
      setUserState(null)
      setIsAuthenticated(false)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
    
    // Проверяем авторизацию при изменении storage (для синхронизации между вкладками)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'yess_token' || e.key === 'yess_user') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Проверяем при фокусе окна
    const handleFocus = () => {
      checkAuth()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Периодическая проверка (каждую секунду) для надежности
    const interval = setInterval(() => {
      const token = getToken()
      const userData = getUser()
      if (token && userData && !isAuthenticated) {
        setUserState(userData)
        setIsAuthenticated(true)
        setLoading(false)
      } else if (!token && isAuthenticated) {
        setUserState(null)
        setIsAuthenticated(false)
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [checkAuth, isAuthenticated])

  const updateUser = useCallback((userData: User) => {
    // Убеждаемся, что токен есть
    const token = getToken()
    
    if (token && userData) {
      // Сначала обновляем localStorage
      setUser(userData)
      
      // Затем обновляем состояние СИНХРОННО и СРАЗУ
      setUserState(userData)
      setIsAuthenticated(true)
      setLoading(false)
    } else {
      // Если нет токена или данных, сбрасываем состояние
      setUserState(null)
      setIsAuthenticated(false)
      setLoading(false)
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

