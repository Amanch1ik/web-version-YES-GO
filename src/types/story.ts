export type StoryActionType = 'link' | 'partner' | 'promotion' | 'product' | 'none'

export interface StorySlide {
  id: number
  storyId: number
  imageUrl: string
  videoUrl?: string
  title?: string
  description?: string
  actionType: StoryActionType
  actionValue?: string
  duration: number // в секундах
  sortOrder: number
}

export interface Story {
  id: number
  title: string
  previewUrl: string
  partnerId?: number
  partnerName?: string
  partnerLogo?: string
  slides: StorySlide[]
  isViewed: boolean
  viewCount: number
  clickCount: number
  isActive: boolean
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt?: string
}

export interface StoryViewRequest {
  storyId: number
  userId?: number
}

export interface StoryClickRequest {
  storyId: number
  slideId?: number
  userId?: number
}

export interface StoryViewResponse {
  success: boolean
  viewCount: number
}

export interface StoryClickResponse {
  success: boolean
  clickCount: number
}

export interface StoryStats {
  totalViews: number
  uniqueViews: number
  totalClicks: number
  uniqueClicks: number
  ctr: number // click-through rate
}

