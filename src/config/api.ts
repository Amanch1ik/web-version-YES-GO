export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/v1/auth/login/json',
  AUTH_REGISTER: '/v1/auth/register',
  
  // User/Profile
  USER_PROFILE: '/v1/user/profile',
  USER_UPDATE: '/v1/user/profile',
  USER_DELETE: '/v1/user/account',
  
  // Wallet
  WALLET_BALANCE: '/v1/wallet/balance',
  WALLET_TRANSACTIONS: '/v1/wallet/transactions',
  
  // Partners
  PARTNERS: '/v1/partners',
  PARTNER_PRODUCTS: '/v1/partners/:id/products',
  
  // Orders
  ORDERS: '/v1/orders',
  ORDER_CREATE: '/v1/orders',
  
  // Finik
  FINIK_CREATE_PAYMENT: '/v1/finik/payment/create',
  FINIK_PAYMENT_STATUS: '/v1/finik/payment/:id/status',
  FINIK_API_KEYS: '/v1/finik/api-keys',
  FINIK_WEBHOOK: '/v1/finik/webhook',
}

