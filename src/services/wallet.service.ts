import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { WalletBalance, Transaction } from '@/types/wallet'

// Моковые данные для fallback
const mockBalance: WalletBalance = {
  balance: 0,
  currency: 'Yess!Coin',
}

const mockTransactions: Transaction[] = []

export const walletService = {
  getBalance: async (): Promise<WalletBalance> => {
    try {
      const response = await api.get<WalletBalance>(API_ENDPOINTS.WALLET_BALANCE)
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, возвращаем моковые данные
      // Подавляем ошибки 500, чтобы они не попадали в консоль
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response) {
        return mockBalance
      }
      throw error
    }
  },

  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get<Transaction[]>(API_ENDPOINTS.WALLET_TRANSACTIONS)
      return response.data
    } catch (error: any) {
      // Если ошибка 500 или сервер недоступен, возвращаем моковые данные
      if (error?.name === 'SilentError' || error?.response?.status >= 500 || !error?.response || error?.response?.status === 0) {
        return mockTransactions
      }
      throw error
    }
  },
}

