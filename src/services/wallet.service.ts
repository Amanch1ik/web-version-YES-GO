import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { WalletBalance, Transaction } from '@/types/wallet'

export const walletService = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await api.get<WalletBalance>(API_ENDPOINTS.WALLET_BALANCE)
    return response.data
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>(API_ENDPOINTS.WALLET_TRANSACTIONS)
    return response.data
  },
}

