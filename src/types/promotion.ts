export type PromotionStatus = 'active' | 'inactive' | 'expired' | 'scheduled'
export type DiscountType = 'percentage' | 'fixed' | 'cashback'

export interface Promotion {
  id: number
  title: string
  description?: string
  imageUrl?: string
  discountType: DiscountType
  discountValue: number
  minOrderAmount?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  status: PromotionStatus
  partnerId?: number
  partnerName?: string
  usageLimit?: number
  usedCount?: number
  createdAt: string
  updatedAt?: string
}

export interface PromoCode {
  id: number
  code: string
  promotionId?: number
  discountType: DiscountType
  discountValue: number
  minOrderAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
}

export interface PromoCodeValidationRequest {
  code: string
  userId?: number
  orderAmount?: number
}

export interface PromoCodeValidationResponse {
  isValid: boolean
  code: string
  discountType?: DiscountType
  discountValue?: number
  discountAmount?: number
  message?: string
  minOrderAmount?: number
  maxDiscount?: number
  expiresAt?: string
}

export interface ApplyPromoCodeRequest {
  code: string
  orderId?: string
  userId?: number
}

export interface ApplyPromoCodeResponse {
  success: boolean
  message?: string
  discountAmount?: number
  newTotal?: number
}

export interface UserPromoCode {
  id: number
  code: string
  discountType: DiscountType
  discountValue: number
  usedAt?: string
  expiresAt: string
  isUsed: boolean
  promotion?: Promotion
}

export interface PromoCodeUsageResponse {
  code: string
  totalUsage: number
  remainingUsage?: number
  lastUsedAt?: string
}

