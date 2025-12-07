import { useState } from 'react'
import { Card, Typography, Button, Row, Col, message as antdMessage, Space } from 'antd'
import { 
  ShareAltOutlined, 
  QrcodeOutlined, 
  CopyOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import './MessagesPage.css'

const { Title } = Typography

const MessagesPage: React.FC = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralLink = `https://yessgo.kg/r/${user?.id?.slice(0, 6) || 'aD3LQ'}`

  const stats = {
    downloaded: 10,
    activated: 5,
    bonus: 50,
  }

  const bonuses = [
    {
      id: 1,
      date: '02.10.2025',
      icon: '/src/Resources/Images/bonus_stories.png',
      text: 'Оплачивайте через QR Yess!Go и экономьте деньги. Bishkek Petroleum, Планета электроники, Бингем фарм, Азия и еще 100+ партнеров! Перейдите в раздел "Бонусы" в Yess!Go и ознакомьтесь с ними подробнее!',
      time: '22:07',
    },
    {
      id: 2,
      date: '02.10.2025',
      icon: '/src/Resources/Images/sc_bonus.png',
      text: 'Начислено: 0,14 ₿ за покупку в Азия Доступно: 0,14 ₿',
      time: '22:07',
    },
    {
      id: 3,
      date: '02.10.2025',
      icon: '/src/Resources/Images/stories_bday.png',
      text: 'Ваш новый уровень на Октябрь: Бронза',
      time: '22:07',
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      antdMessage.success('Ссылка скопирована!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      antdMessage.error('Не удалось скопировать ссылку')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'YESS Go',
          text: 'Присоединяйся к YESS Go!',
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

  return (
    <div className="messages-page">
      <div className="messages-header">
        <img 
          src="/src/Resources/Images/icon_messages.png" 
          alt="Messages" 
          className="messages-header-icon" 
        />
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
          Когда новый клиент установит приложение по вашей уникальной ссылке и активирует Yess приложение, вы оба получите по 250 Yess!Coin на счет кешбэка
        </p>
      </Card>

      {/* Stats */}
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

        <div className="messages-bonus-list">
          {bonuses.map((bonus, index) => {
            const showDate =
              index === 0 || bonus.date !== bonuses[index - 1].date

            return (
              <div key={bonus.id}>
                {showDate && (
                  <div className="messages-bonus-date">{bonus.date}</div>
                )}
                <div className="messages-bonus-item">
                  <div className="messages-bonus-icon-wrapper">
                    <img
                      src={bonus.icon}
                      alt="bonus"
                      className="messages-bonus-icon"
                    />
                  </div>
                  <div className="messages-bonus-content">
                    <p className="messages-bonus-text">{bonus.text}</p>
                    <span className="messages-bonus-time">{bonus.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage

