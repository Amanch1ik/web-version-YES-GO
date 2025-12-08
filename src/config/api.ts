// Базовый URL backend API. По умолчанию используем тот же домен, что и мобильное приложение.
// Можно переопределить через VITE_API_BASE_URL в .env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yessgo.org'

export const API_ENDPOINTS = {
  // Auth (соответствуют YESS API v1 /api/v1/auth/...)
  AUTH_LOGIN: '/v1/auth/login',
  AUTH_REGISTER: '/v1/auth/register',
  AUTH_ME: '/v1/auth/me',
  AUTH_REFRESH: '/v1/auth/refresh',
  
  // User/Profile
  USER_PROFILE: '/v1/auth/me',      // чтение профиля текущего пользователя
  USER_UPDATE: '/v1/users/me',      // обновление профиля
  USER_DELETE: '/v1/users/me',      // предполагаемый DELETE /users/me
  
  // Wallet / Payments
  WALLET_BALANCE: '/v1/payments/balance',
  WALLET_TRANSACTIONS: '/v1/payments/transactions',
  // QR‑операции (чек, начисление и т.п.)
  QR_SCAN: '/v1/qr/scan',
  
  // Partners
  PARTNERS: '/v1/partners/list',
  PARTNER_PRODUCTS: '/v1/partners/:id/products',
  
  // Orders
  ORDERS: '/v1/orders',
  ORDER_CREATE: '/v1/orders',
  
  // Finik / Payments
  FINIK_CREATE_PAYMENT: '/v1/payment/finik/create',
  FINIK_PAYMENT_STATUS: '/v1/payments/:id/status',
  FINIK_API_KEYS: '/v1/finik/api-keys',
  FINIK_WEBHOOK: '/v1/finik/webhook',
}

