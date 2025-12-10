export type BannerPosition = 'top' | 'middle' | 'bottom' | 'popup'
export type BannerActionType = 'link' | 'partner' | 'promotion' | 'category' | 'none'

export interface Banner {
  id: number
  title?: string
  description?: string
  imageUrl: string
  position: BannerPosition
  actionType: BannerActionType
  actionValue?: string
  partnerId?: number
  promotionId?: number
  categoryId?: number
  externalUrl?: string
  sortOrder: number
  isActive: boolean
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt?: string
}

export interface BannerListResponse {
  items: Banner[]
  total: number
}

