export interface WalletBalance {
  balance: number
  currency: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  createdAt: string
  status: 'completed' | 'pending' | 'failed'
}

