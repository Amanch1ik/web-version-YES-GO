import { useState } from 'react'
import { Card, Typography, Button, Row, Col, message as antdMessage, Space, Spin, Empty } from 'antd'
import { 
  ShareAltOutlined, 
  QrcodeOutlined, 
  CopyOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { referralService } from '@/services/referral.service'
import { notificationService } from '@/services/notification.service'
import './MessagesPage.css'

const { Title } = Typography

const MessagesPage: React.FC = () => {
  useAuth() // для проверки авторизации
  const [copied, setCopied] = useState(false)

  // Получаем статистику рефералов из API
  const { data: referralStats, isLoading: referralLoading } = useQuery({
    queryKey: ['referral-stats'],
    queryFn: referralService.getReferralStats,
    retry: 1,
  })

  // Получаем уведомления/бонусы из API
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['my-notifications'],
    queryFn: () => notificationService.getMyNotifications(1, 20),
    retry: 1,
  })

  const referralLink = referralStats?.referralLink || `https://yessgo.kg/r/${referralStats?.referralCode || ''}`
  
  const stats = {
    downloaded: referralStats?.totalReferrals || 0,
    activated: referralStats?.activatedReferrals || 0,
    bonus: referralStats?.totalRewardsEarned || 0,
  }

  const notifications = notificationsData?.notifications || []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      antdMessage.success('Ссылка скопирована!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      antdMessage.error('Не удалось скопировать ссылку')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'YESS Go',
          text: `Присоединяйся к YESS Go и получи ${referralStats?.bonusForReferred || 250} Yess!Coin!`,
          url: referralLink,
        })
      } catch {
        // пользователь мог отменить шаринг
      }
    } else {
      handleCopy()
    }
  }

  const handleQR = () => {
    antdMessage.info('QR код в разработке')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="messages-page">
      <div className="messages-header">
        <Title level={3} className="messages-title">
          Сообщения
        </Title>
      </div>

      {/* Referral / Invite Card */}
      <Card className="messages-referral-card">
        <Title level={4} className="messages-card-title">
          Поделитесь с друзьями классным приложением!
        </Title>
        <p className="messages-card-text">
          Когда новый клиент установит приложение по вашей уникальной ссылке и активирует Yess приложение, вы оба получите по {referralStats?.bonusPerReferral || 250} Yess!Coin на счет кешбэка
        </p>
      </Card>

      {/* Stats */}
      {referralLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <Spin />
        </div>
      ) : (
        <Row gutter={12} className="messages-stats">
          <Col xs={8}>
            <Card className="messages-stat-card">
              <span className="messages-stat-label">Скачали</span>
              <Title level={3} className="messages-stat-value">
                {stats.downloaded}
              </Title>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="messages-stat-card">
              <span className="messages-stat-label">Активировали</span>
              <Title level={3} className="messages-stat-value">
                {stats.activated}
              </Title>
            </Card>
          </Col>
          <Col xs={8}>
            <Card className="messages-stat-card messages-stat-card-bonus">
              <span className="messages-stat-label">Ваш бонус</span>
              <Title level={3} className="messages-stat-value messages-stat-value-bonus">
                {stats.bonus}
              </Title>
            </Card>
          </Col>
        </Row>
      )}

      {/* Referral Link */}
      <Card className="messages-link-card">
        <div className="messages-link-content">
          <span className="messages-link-text">{referralLink}</span>
          <Button
            type="text"
            icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            className="messages-copy-button"
          />
        </div>
      </Card>

      {/* Actions */}
      <Space size="middle" className="messages-actions">
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className="messages-action-button"
          block
        >
          Поделиться
        </Button>
        <Button
          type="primary"
          icon={<QrcodeOutlined />}
          onClick={handleQR}
          className="messages-action-button"
          block
        >
          QR
        </Button>
      </Space>

      <div className="messages-divider" />

      {/* Bonuses list */}
      <div className="messages-bonuses-section">
        <Title level={4} className="messages-bonuses-title">
          Бонусы
        </Title>

        {notificationsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
            <Spin />
          </div>
        ) : notifications.length > 0 ? (
          <div className="messages-bonus-list">
            {notifications.map((notification, index) => {
              const currentDate = formatDate(notification.createdAt)
              const prevDate = index > 0 ? formatDate(notifications[index - 1].createdAt) : null
              const showDate = index === 0 || currentDate !== prevDate

              return (
                <div key={notification.id}>
                  {showDate && (
                    <div className="messages-bonus-date">{currentDate}</div>
                  )}
                  <div className="messages-bonus-item">
                    <div className="messages-bonus-icon-wrapper">
                      <div className="messages-bonus-icon-placeholder">
                        {notification.type === 'push' ? '🔔' : 
                         notification.type === 'email' ? '📧' : '📢'}
                      </div>
                    </div>
                    <div className="messages-bonus-content">
                      <p className="messages-bonus-text">
                        {notification.title && <strong>{notification.title}</strong>}
                        {notification.title && notification.body && <br />}
                        {notification.body}
                      </p>
                      <span className="messages-bonus-time">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Empty description="Нет уведомлений" />
        )}
      </div>
    </div>
  )
}

export default MessagesPage
