import { useState } from 'react'
import { Card, Avatar, Typography, Button, List, Modal, Space } from 'antd'
import {
  UserOutlined,
  RightOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './ProfilePage.css'

const { Title, Text } = Typography

interface MenuItem {
  key: string
  icon: React.ReactNode
  title: string
  subtitle?: string
  onClick: () => void
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  const userFullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`.trim()
    : user?.fullName || 'Пользователь'


  const menuItems: MenuItem[] = [
    {
      key: 'city',
      icon: <img src="/src/Resources/Images/icon_location.png" alt="City" style={{ width: 20, height: 20 }} />,
      title: 'Мой город',
      subtitle: user?.city || 'Не указан',
      onClick: () => {
        navigate('/city')
      },
    },
    {
      key: 'promo',
      icon: <img src="/src/Resources/Images/icon_promo.png" alt="Promo" style={{ width: 20, height: 20 }} />,
      title: 'Ввести промокод',
      onClick: () => {
        navigate('/promo-code')
      },
    },
    {
      key: 'messages',
      icon: <img src="/src/Resources/Images/icon_messages.png" alt="Messages" style={{ width: 20, height: 20 }} />,
      title: 'Сообщения',
      onClick: () => {
        navigate('/messages')
      },
    },
    {
      key: 'referral',
      icon: <img src="/src/Resources/Images/icon_referral.png" alt="Referral" style={{ width: 20, height: 20 }} />,
      title: 'Реферальная ссылка',
      onClick: () => {
        navigate('/referral')
      },
    },
    {
      key: 'history',
      icon: <img src="/src/Resources/Images/icon_history.png" alt="History" style={{ width: 20, height: 20 }} />,
      title: 'История операций',
      onClick: () => {
        navigate('/wallet')
      },
    },
    {
      key: 'feedback',
      icon: <img src="/src/Resources/Images/icon_feedback.png" alt="Feedback" style={{ width: 20, height: 20 }} />,
      title: 'Обратная связь',
      onClick: () => {
        navigate('/feedback')
      },
    },
    {
      key: 'certificates',
      icon: <img src="/src/Resources/Images/icon_certificate.png" alt="Certificates" style={{ width: 20, height: 20 }} />,
      title: 'Мои сертификаты',
      onClick: () => {
        navigate('/certificates')
      },
    },
    {
      key: 'finik',
      icon: <SettingOutlined />,
      title: 'Настройки Finik',
      subtitle: 'API ключи для платежей',
      onClick: () => {
        navigate('/settings/finik')
      },
    },
    {
      key: 'logout',
      icon: <img src="/src/Resources/Images/icon_logout.png" alt="Logout" style={{ width: 20, height: 20 }} />,
      title: 'Выйти',
      onClick: () => {
        setLogoutModalVisible(true)
      },
    },
  ]

  const handleLogout = () => {
    setLogoutModalVisible(false)
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="profile-page">
      {/* User Profile Card */}
      <Card className="profile-user-card" onClick={() => navigate('/profile/detail')}>
        <div className="profile-user-content">
          <Avatar
            size={56}
            src={user?.avatarUrl}
            icon={<UserOutlined />}
            className="profile-avatar"
          >
            {user?.firstName?.[0] || user?.fullName?.[0] || 'U'}
          </Avatar>
          <div className="profile-user-info">
            <Title level={4} className="profile-user-name">
              {userFullName}
            </Title>
            <Text className="profile-user-subtitle">Профиль</Text>
          </div>
          <RightOutlined className="profile-arrow" />
        </div>
      </Card>

      {/* Login Methods Card */}
      <Card className="profile-methods-card">
        <div className="profile-methods-header">
          <Title level={5} style={{ margin: 0 }}>
            Способы входа
          </Title>
          <Button type="link" className="profile-view-button">
            Посмотреть
          </Button>
        </div>
        <div className="profile-methods-icons">
          <div className="method-icon-wrapper">
            <div className="method-icon method-icon-document">
              <img src="/src/Resources/Images/icon_google.png" alt="Document" style={{ width: 24, height: 24 }} />
            </div>
            <CheckCircleOutlined className="method-check" />
          </div>
          <div className="method-icon-wrapper">
            <div className="method-icon method-icon-google">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <CheckCircleOutlined className="method-check" />
          </div>
        </div>
      </Card>

      {/* Menu Items */}
      <List
        className="profile-menu-list"
        dataSource={menuItems}
        renderItem={(item) => (
          <List.Item className="profile-menu-item" onClick={item.onClick}>
            <List.Item.Meta
              avatar={<div className="profile-menu-icon">{item.icon}</div>}
              title={item.title}
              description={item.subtitle}
            />
            {item.key !== 'logout' && <RightOutlined className="profile-menu-arrow" />}
          </List.Item>
        )}
      />

      {/* Logout Confirmation Modal */}
      <Modal
        open={logoutModalVisible}
        onCancel={() => setLogoutModalVisible(false)}
        footer={null}
        className="logout-modal"
        centered
      >
        <div className="logout-modal-content">
          <Title level={4} className="logout-modal-title">
            Вы точно хотите выйти
          </Title>
          <Space size="middle" className="logout-modal-buttons">
            <Button
              className="logout-stay-button"
              onClick={() => setLogoutModalVisible(false)}
            >
              Остаться
            </Button>
            <Button
              className="logout-confirm-button"
              onClick={handleLogout}
            >
              Да, выйти
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default ProfilePage
