import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { User, UpdateProfileRequest, UpdateProfileResponse } from '@/types/auth'
import { setUser } from '@/utils/storage'

export const userService = {
  /**
   * Получить профиль пользователя
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USER_PROFILE)
    if (response.data) {
      setUser(response.data)
    }
    return response.data
  },

  /**
   * Обновить профиль пользователя
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await api.put<UpdateProfileResponse>(API_ENDPOINTS.USER_UPDATE, data)
    if (response.data.user) {
      setUser(response.data.user)
    }
    return response.data
  },

  /**
   * Удалить аккаунт пользователя
   */
  deleteAccount: async (): Promise<void> => {
    await api.delete(API_ENDPOINTS.USER_DELETE)
  },
}

