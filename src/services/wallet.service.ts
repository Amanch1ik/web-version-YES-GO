import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { WalletBalance, Transaction } from '@/types/wallet'

const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'

export const walletService = {
  getBalance: async (): Promise<WalletBalance> => {
    // В режиме разработки не ходим на бэкенд вообще, чтобы не получать 401
    if (isDev) {
      return {
        balance: 0,
        coins: 0,
      }
    }

    try {
      const response = await api.get<WalletBalance>(API_ENDPOINTS.WALLET_BALANCE)
      return response.data
    } catch (error: any) {
      // В DEV режиме возвращаем пустые данные вместо ошибки
      if (isDev && (
        error.response?.status === 401 || 
        error.response?.status === 404 || 
        error.response?.status === 500 || 
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Network Error')
      )) {
        return {
          balance: 0,
          coins: 0,
        }
      }
      throw error
    }
  },

  getTransactions: async (): Promise<Transaction[]> => {
    // В режиме разработки не дергаем API, чтобы не засорять консоль 401‑ми
    if (isDev) {
      return []
    }

    try {
      const response = await api.get<Transaction[]>(API_ENDPOINTS.WALLET_TRANSACTIONS)
      return response.data
    } catch (error: any) {
      // В DEV режиме возвращаем пустой массив вместо ошибки
      if (isDev && (
        error.response?.status === 401 || 
        error.response?.status === 404 || 
        error.response?.status === 500 || 
        !error.response ||
        error.code === 'ECONNREFUSED' ||
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('Network Error')
      )) {
        return []
      }
      throw error
    }
  },
}

