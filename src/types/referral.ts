export type ReferralStatus = 'pending' | 'registered' | 'activated' | 'rewarded'

export interface Referral {
  id: number
  referrerId: number
  referredUserId?: number
  referredPhone?: string
  referredEmail?: string
  referralCode: string
  status: ReferralStatus
  rewardAmount?: number
  rewardedAt?: string
  createdAt: string
  activatedAt?: string
}

export interface ReferralStats {
  totalReferrals: number
  pendingReferrals: number
  activatedReferrals: number
  totalRewardsEarned: number
  referralCode: string
  referralLink: string
  bonusPerReferral: number
  bonusForReferred: number
}

export interface ReferralReward {
  id: number
  referralId: number
  userId: number
  amount: number
  type: 'referrer' | 'referred'
  status: 'pending' | 'credited' | 'failed'
  createdAt: string
  creditedAt?: string
}

export interface CreateReferralRequest {
  phone?: string
  email?: string
}

export interface CreateReferralResponse {
  success: boolean
  message?: string
  referralCode: string
  referralLink: string
}

export interface ApplyReferralRequest {
  referralCode: string
}

export interface ApplyReferralResponse {
  success: boolean
  message?: string
  bonusAmount?: number
}

