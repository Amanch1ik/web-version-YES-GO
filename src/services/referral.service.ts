import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { getToken } from '@/utils/storage'
import { 
  Referral,
  ReferralStats,
  ReferralReward,
  CreateReferralRequest,
  CreateReferralResponse,
  ApplyReferralRequest,
  ApplyReferralResponse
} from '@/types/referral'

export const referralService = {
  /**
   * Получить статистику рефералов текущего пользователя
   */
  getReferralStats: async (): Promise<ReferralStats> => {
    const token = getToken()
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'

    if (isDevMode && token === 'dev-token') {
      return {
        totalReferrals: 0,
        activatedReferrals: 0,
        totalRewardsEarned: 0,
        bonusForReferred: 0,
        bonusPerReferral: 0,
        referralCode: 'DEV',
        referralLink: 'https://yessgo.org/r/DEV',
      }
    }

    const response = await api.get<ReferralStats>(API_ENDPOINTS.AUTH.REFERRAL_STATS)
    return response.data
  },

  /**
   * Получить список рефералов (для админов)
   */
  getReferrals: async (): Promise<Referral[]> => {
    const response = await api.get<Referral[]>(`${API_ENDPOINTS.AUTH.REFERRAL_STATS}/list`)
    return response.data
  },

  /**
   * Создать реферальное приглашение
   */
  createReferral: async (data: CreateReferralRequest): Promise<CreateReferralResponse> => {
    const response = await api.post<CreateReferralResponse>(
      `${API_ENDPOINTS.AUTH.REFERRAL_STATS}/invite`,
      data
    )
    return response.data
  },

  /**
   * Применить реферальный код при регистрации
   */
  applyReferralCode: async (data: ApplyReferralRequest): Promise<ApplyReferralResponse> => {
    const response = await api.post<ApplyReferralResponse>(
      `${API_ENDPOINTS.AUTH.REFERRAL_STATS}/apply`,
      data
    )
    return response.data
  },

  /**
   * Получить награды за рефералов
   */
  getReferralRewards: async (): Promise<ReferralReward[]> => {
    const response = await api.get<ReferralReward[]>(
      `${API_ENDPOINTS.AUTH.REFERRAL_STATS}/rewards`
    )
    return response.data
  },

  /**
   * Поделиться реферальной ссылкой
   */
  shareReferralLink: async (): Promise<string> => {
    const stats = await referralService.getReferralStats()
    
    if (navigator.share) {
      await navigator.share({
        title: 'YESS Go - Получай кэшбэк!',
        text: `Присоединяйся к YESS Go и получи ${stats.bonusForReferred} бонусных монет! Используй мой реферальный код: ${stats.referralCode}`,
        url: stats.referralLink
      })
    }
    
    return stats.referralLink
  },

  /**
   * Скопировать реферальный код в буфер обмена
   */
  copyReferralCode: async (): Promise<string> => {
    const stats = await referralService.getReferralStats()
    await navigator.clipboard.writeText(stats.referralCode)
    return stats.referralCode
  },

  /**
   * Скопировать реферальную ссылку в буфер обмена
   */
  copyReferralLink: async (): Promise<string> => {
    const stats = await referralService.getReferralStats()
    await navigator.clipboard.writeText(stats.referralLink)
    return stats.referralLink
  },
}
