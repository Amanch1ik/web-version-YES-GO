import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  Achievement,
  UserLevel,
  LevelReward,
  AchievementCheckRequest,
  AchievementCheckResponse,
  ClaimRewardResponse,
  AchievementStats
} from '@/types/achievement'

export const achievementService = {
  /**
   * Получить все достижения
   */
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>(API_ENDPOINTS.ACHIEVEMENTS.LIST)
    return response.data
  },

  /**
   * Получить достижение по ID
   */
  getAchievementById: async (id: string | number): Promise<Achievement | null> => {
    const response = await api.get<Achievement>(API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id))
    return response.data
  },

  /**
   * Получить достижения пользователя
   */
  getUserAchievements: async (userId: string | number): Promise<Achievement[]> => {
    const response = await api.get<Achievement[]>(API_ENDPOINTS.ACHIEVEMENTS.BY_USER(userId))
    return response.data
  },

  /**
   * Получить уровень пользователя
   */
  getUserLevel: async (userId: string | number): Promise<UserLevel> => {
    const response = await api.get<UserLevel>(API_ENDPOINTS.ACHIEVEMENTS.USER_LEVEL(userId))
    return response.data
  },

  /**
   * Получить награды за уровень
   */
  getLevelRewards: async (level: number): Promise<LevelReward[]> => {
    const response = await api.get<LevelReward[]>(
      API_ENDPOINTS.ACHIEVEMENTS.REWARDS_BY_LEVEL(level)
    )
    return response.data
  },

  /**
   * Забрать награду
   */
  claimReward: async (rewardId: string | number): Promise<ClaimRewardResponse> => {
    const response = await api.post<ClaimRewardResponse>(
      API_ENDPOINTS.ACHIEVEMENTS.CLAIM_REWARD(rewardId),
      {}
    )
    return response.data
  },

  /**
   * Проверить новые достижения
   */
  checkAchievements: async (data?: AchievementCheckRequest): Promise<AchievementCheckResponse> => {
    const response = await api.post<AchievementCheckResponse>(
      API_ENDPOINTS.ACHIEVEMENTS.CHECK,
      data || {}
    )
    return response.data
  },

  /**
   * Получить статистику достижений
   */
  getAchievementStats: async (): Promise<AchievementStats> => {
    const response = await api.get<AchievementStats>(API_ENDPOINTS.ACHIEVEMENTS.STATS)
    return response.data
  },
}
