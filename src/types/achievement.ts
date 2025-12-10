export type AchievementType = 
  | 'purchases' 
  | 'referrals' 
  | 'reviews' 
  | 'orders' 
  | 'spending' 
  | 'visits' 
  | 'streak'
  | 'special'

export type AchievementStatus = 'locked' | 'in_progress' | 'completed' | 'claimed'

export interface Achievement {
  id: number
  name: string
  description: string
  iconUrl?: string
  type: AchievementType
  targetValue: number
  currentValue: number
  rewardCoins: number
  rewardBadge?: string
  status: AchievementStatus
  unlockedAt?: string
  claimedAt?: string
  level?: number
  sortOrder: number
}

export interface UserLevel {
  level: number
  name: string
  currentXp: number
  requiredXp: number
  nextLevelXp: number
  progress: number // 0-100
  benefits: string[]
  iconUrl?: string
}

export interface LevelReward {
  id: number
  level: number
  name: string
  description: string
  rewardType: 'coins' | 'discount' | 'badge' | 'special'
  rewardValue: number
  iconUrl?: string
  isClaimed: boolean
  claimedAt?: string
}

export interface AchievementCheckRequest {
  userId: number
  type?: AchievementType
}

export interface AchievementCheckResponse {
  newAchievements: Achievement[]
  levelUp?: {
    previousLevel: number
    newLevel: number
    rewards: LevelReward[]
  }
}

export interface ClaimRewardResponse {
  success: boolean
  message?: string
  coinsAdded?: number
  newBalance?: number
}

export interface AchievementStats {
  totalAchievements: number
  completedAchievements: number
  claimedRewards: number
  totalCoinsEarned: number
  currentStreak: number
  longestStreak: number
}

