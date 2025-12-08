import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { WalletBalance, Transaction } from '@/types/wallet'

// Ответ на применение QR‑кода (формат соответствует YESS API v1 /api/v1/qr/scan)
export interface QrRedeemResponse {
  success: boolean
  message?: string
  addedCoins?: number
  newBalance?: number
}

// Мок-режим управляется только переменной VITE_DEV_MODE
const isDev = import.meta.env.VITE_DEV_MODE === 'true'

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

  /**
   * Применить/погасить QR‑код (чек, сертификат и т.п.)
   * Ожидается, что backend вернет информацию об успехе операции
   */
  applyQrCode: async (qrData: string): Promise<QrRedeemResponse> => {
    try {
      const response = await api.post<QrRedeemResponse>(
        API_ENDPOINTS.QR_SCAN,
        { qrCode: qrData }
      )
      return response.data
    } catch (error: any) {
      // В мок‑режиме просто эмулируем успешное начисление
      if (isDev) {
        return {
          success: true,
          message: 'QR‑код принят (мок‑режим)',
          addedCoins: 10,
        }
      }
      throw error
    }
  },
}

