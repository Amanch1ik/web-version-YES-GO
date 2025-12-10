import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { User, UpdateProfileRequest, UpdateProfileResponse } from '@/types/auth'
import { setUser } from '@/utils/storage'

export const userService = {
  /**
   * Получить профиль текущего пользователя
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USER.PROFILE)
    if (response.data) {
      setUser(response.data)
    }
    return response.data
  },

  /**
   * Обновить профиль пользователя
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>(API_ENDPOINTS.USER.UPDATE, data)
    if (response.data.user) {
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Загрузить аватар пользователя
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post<{ avatarUrl: string }>(
      API_ENDPOINTS.UPLOAD.AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  },

  /**
   * Удалить аккаунт пользователя
   */
  deleteAccount: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.USER.DELETE)
  },

  /**
   * Получить статистику пользователя
   */
  getUserStats: async (): Promise<{
    totalOrders: number
    totalSpent: number
    totalCashback: number
    totalCoins: number
    level: number
    levelName: string
  }> => {
    const response = await api.get<{
      totalOrders: number
      totalSpent: number
      totalCashback: number
      totalCoins: number
      level: number
      levelName: string
    }>(API_ENDPOINTS.UNIFIED.USER_STATS)
    return response.data
  },
}
