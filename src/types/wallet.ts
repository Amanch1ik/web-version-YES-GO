export interface WalletBalance {
  balance: number
  coins?: number
  currency?: string
  lastUpdated?: string
}

export interface WalletInfo {
  id: number
  userId: number
  balance: number
  coins: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export type TransactionType = 'credit' | 'debit' | 'topup' | 'payment' | 'cashback' | 'refund' | 'bonus'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface Transaction {
  id: string | number
  userId?: number
  type: TransactionType
  amount: number
  commission?: number
  paymentMethod?: string
  status: TransactionStatus
  partnerId?: number
  partnerName?: string
  description?: string
  yescoinUsed?: number
  yescoinEarned?: number
  balanceBefore?: number
  balanceAfter?: number
  createdAt: string
  processedAt?: string
  completedAt?: string
  errorMessage?: string
}

export interface TransactionListResponse {
  transactions: Transaction[]
  totalCount: number
  page: number
  pageSize: number
}

export interface TopUpRequest {
  amount: number
  paymentMethod: string
  cardNumber?: string
  returnUrl?: string
}

export interface TopUpResponse {
  success: boolean
  transactionId: string
  paymentUrl?: string
  message?: string
}

export interface WalletSyncResponse {
  success: boolean
  balance: number
  coins: number
  lastSyncedAt: string
}
