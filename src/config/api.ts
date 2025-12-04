export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/api/v1/auth/login/json',
  AUTH_REGISTER: '/api/v1/auth/register',
  
  // User/Profile
  USER_PROFILE: '/api/v1/user/profile',
  USER_UPDATE: '/api/v1/user/profile',
  USER_DELETE: '/api/v1/user/account',
  
  // Wallet
  WALLET_BALANCE: '/api/v1/wallet/balance',
  WALLET_TRANSACTIONS: '/api/v1/wallet/transactions',
  
  // Partners
  PARTNERS: '/api/v1/partners',
  PARTNER_PRODUCTS: '/api/v1/partners/:id/products',
  
  // Orders
  ORDERS: '/api/v1/orders',
  ORDER_CREATE: '/api/v1/orders',
}

