import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  Promotion,
  PromoCode,
  PromoCodeValidationRequest,
  PromoCodeValidationResponse,
  ApplyPromoCodeRequest,
  ApplyPromoCodeResponse,
  UserPromoCode,
  PromoCodeUsageResponse
} from '@/types/promotion'

export const promotionService = {
  /**
   * Получить список акций
   */
  getPromotions: async (): Promise<Promotion[]> => {
    const response = await api.get<Promotion[]>(API_ENDPOINTS.PROMOTIONS.LIST)
    return response.data
  },

  /**
   * Получить акцию по ID
   */
  getPromotionById: async (id: string | number): Promise<Promotion> => {
    const response = await api.get<Promotion>(API_ENDPOINTS.PROMOTIONS.BY_ID(id))
    return response.data
  },

  /**
   * Получить список промокодов
   */
  getPromoCodes: async (): Promise<PromoCode[]> => {
    const response = await api.get<PromoCode[]>(API_ENDPOINTS.PROMOTIONS.PROMO_CODES)
    return response.data
  },

  /**
   * Получить информацию о промокоде
   */
  getPromoCodeInfo: async (code: string): Promise<PromoCode> => {
    const response = await api.get<PromoCode>(API_ENDPOINTS.PROMOTIONS.PROMO_CODE_BY_CODE(code))
    return response.data
  },

  /**
   * Валидировать промокод
   */
  validatePromoCode: async (data: PromoCodeValidationRequest): Promise<PromoCodeValidationResponse> => {
    const response = await api.post<PromoCodeValidationResponse>(
      API_ENDPOINTS.PROMOTIONS.VALIDATE_CODE,
      data
    )
    return response.data
  },

  /**
   * Применить промокод
   */
  applyPromoCode: async (data: ApplyPromoCodeRequest): Promise<ApplyPromoCodeResponse> => {
    const response = await api.post<ApplyPromoCodeResponse>(
      API_ENDPOINTS.PROMOTIONS.APPLY_CODE,
      data
    )
    return response.data
  },

  /**
   * Получить промокоды пользователя
   */
  getUserPromoCodes: async (userId?: string | number): Promise<UserPromoCode[]> => {
    const endpoint = userId 
      ? API_ENDPOINTS.PROMOTIONS.USER_PROMO_CODES(userId)
      : `${API_ENDPOINTS.PROMOTIONS.PROMO_CODES}/me`
    
    const response = await api.get<UserPromoCode[]>(endpoint)
    return response.data
  },

  /**
   * Проверить использование промокода
   */
  checkPromoCodeUsage: async (code: string): Promise<PromoCodeUsageResponse> => {
    const response = await api.get<PromoCodeUsageResponse>(
      API_ENDPOINTS.PROMOTIONS.CHECK_USAGE(code)
    )
    return response.data
  },

  /**
   * Получить статистику акций
   */
  getPromotionStats: async (): Promise<{ total: number; active: number; expired: number }> => {
    const response = await api.get<{ total: number; active: number; expired: number }>(
      API_ENDPOINTS.PROMOTIONS.STATS
    )
    return response.data
  },
}
