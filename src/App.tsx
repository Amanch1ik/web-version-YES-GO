import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SplashScreen from './components/Splash/SplashScreen'
import WelcomeScreen from './components/Welcome/WelcomeScreen'
import AppLayout from './components/Layout/AppLayout'
import LoginPage from './pages/Auth/LoginPage'
import OAuthCallbackPage from './pages/Auth/OAuthCallbackPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import HomePage from './pages/Home/HomePage'
import WalletPage from './pages/Wallet/WalletPage'
import PartnersPage from './pages/Partners/PartnersPage'
import PartnerDetailPage from './pages/Partners/PartnerDetailPage'
import CategoriesPage from './pages/Categories/CategoriesPage'
import ElectronicsPage from './pages/Categories/ElectronicsPage'
import FoodPage from './pages/Categories/FoodPage'
import OrdersPage from './pages/Orders/OrdersPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ProfileDetailPage from './pages/Profile/ProfileDetailPage'
import CertificatesPage from './pages/Certificates/CertificatesPage'
import ReferralPage from './pages/Referral/ReferralPage'
import PromoCodePage from './pages/PromoCode/PromoCodePage'
import CityPage from './pages/City/CityPage'
import FeedbackPage from './pages/Feedback/FeedbackPage'
import MessagesPage from './pages/Messages/MessagesPage'
import TopUpPage from './pages/Wallet/TopUpPage'
import PaymentMethodPage from './pages/Wallet/PaymentMethodPage'
import MBankTopUpPage from './pages/Wallet/MBankTopUpPage'
import ConfirmCodePage from './pages/Wallet/ConfirmCodePage'
import FinikPaymentPage from './pages/Wallet/FinikPaymentPage'
import FinikSuccessPage from './pages/Wallet/FinikSuccessPage'
import FinikSettingsPage from './pages/Settings/FinikSettingsPage'
import SocialPage from './pages/Social/SocialPage'
import StoriesPage from './pages/Social/StoriesPage'
import QRScannerPage from './pages/QR/QRScannerPage'
import MapPage from './pages/Map/MapPage'
import { Spin } from 'antd'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  // Проверяем токен в localStorage СИНХРОННО - это единственный источник истины
  // Не полагаемся на состояние AuthContext, так как оно может быть не синхронизировано
  const token = localStorage.getItem('yess_token')
  const userStr = localStorage.getItem('yess_user')
  
  // Проверяем, что данные есть и валидны
  let hasValidAuth = false
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      hasValidAuth = !!(user && user.id && token)
    } catch (e) {
      hasValidAuth = false
    }
  }
  
  // Если есть валидные данные в localStorage, разрешаем доступ СРАЗУ
  // Это предотвращает быстрый выход после входа
  if (hasValidAuth) {
    return <>{children}</>
  }

  // Если данных нет, редиректим на логин
  return <Navigate to="/login" replace />
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    // Проверяем, был ли уже показан splash/welcome в этой сессии
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro')
    
    if (hasSeenIntro) {
      setShowSplash(false)
      setShowWelcome(false)
      setAppReady(true)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    setShowWelcome(true)
  }

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
    setAppReady(true)
    sessionStorage.setItem('hasSeenIntro', 'true')
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  if (!appReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/:provider/callback" element={<OAuthCallbackPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout>
                <HomePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <AppLayout>
                <WalletPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <PrivateRoute>
              <AppLayout>
                <PartnersPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/partners/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <PartnerDetailPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <AppLayout>
                <CategoriesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/electronics"
          element={
            <PrivateRoute>
              <AppLayout>
                <ElectronicsPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/categories/food"
          element={
            <PrivateRoute>
              <AppLayout>
                <FoodPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/qr"
          element={
            <PrivateRoute>
              <AppLayout>
                <QRScannerPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/map"
          element={
            <PrivateRoute>
              <AppLayout>
                <MapPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/topup"
          element={
            <PrivateRoute>
              <AppLayout>
                <TopUpPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/payment-method"
          element={
            <PrivateRoute>
              <AppLayout>
                <PaymentMethodPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/mbank-topup"
          element={
            <PrivateRoute>
              <AppLayout>
                <MBankTopUpPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/confirm-code"
          element={
            <PrivateRoute>
              <AppLayout>
                <ConfirmCodePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/finik-payment"
          element={
            <PrivateRoute>
              <AppLayout>
                <FinikPaymentPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/finik-success"
          element={
            <PrivateRoute>
              <AppLayout>
                <FinikSuccessPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet/payment"
          element={
            <PrivateRoute>
              <AppLayout>
                <PaymentMethodPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/finik"
          element={
            <PrivateRoute>
              <AppLayout>
                <FinikSettingsPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/social"
          element={
            <PrivateRoute>
              <AppLayout>
                <SocialPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/stories"
          element={
            <PrivateRoute>
              <StoriesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <AppLayout>
                <MessagesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AppLayout>
                <OrdersPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/detail"
          element={
            <PrivateRoute>
              <AppLayout>
                <ProfileDetailPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <PrivateRoute>
              <AppLayout>
                <CertificatesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/referral"
          element={
            <PrivateRoute>
              <AppLayout>
                <ReferralPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/promo-code"
          element={
            <PrivateRoute>
              <AppLayout>
                <PromoCodePage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/city"
          element={
            <PrivateRoute>
              <AppLayout>
                <CityPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <AppLayout>
                <FeedbackPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <AppLayout>
                <MessagesPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

