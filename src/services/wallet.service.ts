import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { getToken } from '@/utils/storage'
import { 
  WalletBalance, 
  WalletInfo,
  Transaction, 
  TransactionListResponse,
  TopUpRequest,
  TopUpResponse,
  WalletSyncResponse
} from '@/types/wallet'

export const walletService = {
  /**
   * Получить информацию о кошельке
   */
  getWallet: async (): Promise<WalletInfo> => {
    const response = await api.get<WalletInfo>(API_ENDPOINTS.WALLET.GET)
    return response.data
  },

  /**
   * Получить баланс кошелька
   */
  getBalance: async (): Promise<WalletBalance> => {
    const token = getToken()
    const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'

    if (isDevMode && token === 'dev-token') {
      return {
        balance: 0,
        coins: 0,
        currency: 'KGS',
        lastUpdated: new Date().toISOString(),
      }
    }

    const response = await api.get<WalletBalance>(API_ENDPOINTS.WALLET.BALANCE)
    return response.data
  },

  /**
   * Получить баланс из endpoint /wallet/balance
   */
  getWalletBalance: async (): Promise<WalletBalance> => {
    const response = await api.get<WalletBalance>(API_ENDPOINTS.WALLET.BALANCE)
    return response.data
  },

  /**
   * Получить список транзакций
   */
  getTransactions: async (page: number = 1, pageSize: number = 20): Promise<TransactionListResponse> => {
    const response = await api.get<TransactionListResponse>(
      `${API_ENDPOINTS.PAYMENTS.TRANSACTIONS}?page=${page}&page_size=${pageSize}`
    )
    return response.data
  },

  /**
   * Получить историю кошелька
   */
  getHistory: async (page: number = 1, pageSize: number = 20): Promise<Transaction[]> => {
    const response = await api.get<TransactionListResponse>(
      `${API_ENDPOINTS.WALLET.HISTORY}?page=${page}&page_size=${pageSize}`
    )
    return response.data.transactions || []
  },

  /**
   * Получить транзакцию по ID
   */
  getTransactionById: async (id: string): Promise<Transaction | null> => {
    const response = await api.get<Transaction>(`${API_ENDPOINTS.WALLET.TRANSACTIONS}/${id}`)
    return response.data
  },

  /**
   * Пополнить кошелек
   */
  topUp: async (data: TopUpRequest): Promise<TopUpResponse> => {
    const response = await api.post<TopUpResponse>(API_ENDPOINTS.WALLET.TOPUP, data)
    return response.data
  },

  /**
   * Синхронизировать кошелек
   */
  sync: async (): Promise<WalletSyncResponse> => {
    const response = await api.post<WalletSyncResponse>(API_ENDPOINTS.WALLET.SYNC, {})
    return response.data
  },
}
