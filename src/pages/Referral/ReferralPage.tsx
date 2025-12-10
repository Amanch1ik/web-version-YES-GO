import { useState } from 'react'
import { Card, Typography, Button, Row, Col, message, Space } from 'antd'
import { ShareAltOutlined, QrcodeOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import './ReferralPage.css'

const { Title, Text } = Typography

const ReferralPage: React.FC = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  
  // Генерируем реферальную ссылку на основе ID пользователя
  const referralLink = `https://yessgo.kg/r/${String(user?.id || '').slice(0, 6) || 'aD3LQ'}`
  
  const stats = {
    downloaded: 10,
    activated: 5,
    bonus: 50,
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      message.success('Ссылка скопирована!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      message.error('Не удалось скопировать ссылку')
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
      } catch (err) {
        // Пользователь отменил шаринг
      }
    } else {
      handleCopy()
    }
  }

  const handleQR = () => {
    message.info('QR код в разработке')
  }

  return (
    <div className="referral-page">
      <div className="referral-header">
        <ShareAltOutlined className="referral-header-icon" />
        <Title level={3} className="referral-title">
          Реферальная ссылка
        </Title>
      </div>

      {/* Description Card */}
      <Card className="referral-description-card">
        <Title level={4} className="referral-card-title">
          Поделитесь с друзьями классным приложением!
        </Title>
        <Text className="referral-card-text">
          Когда новый клиент установит приложение по вашей уникальной ссылке и активирует Yess приложение, вы оба получите по 250 Yess!Coin на счет кешбэка
        </Text>
      </Card>

      {/* Stats Cards */}
      <Row gutter={12} className="referral-stats">
        <Col xs={8}>
          <Card className="stat-card">
            <Text className="stat-label">Скачали</Text>
            <Title level={2} className="stat-value">
              {stats.downloaded}
            </Title>
          </Card>
        </Col>
        <Col xs={8}>
          <Card className="stat-card">
            <Text className="stat-label">Активировали</Text>
            <Title level={2} className="stat-value">
              {stats.activated}
            </Title>
          </Card>
        </Col>
        <Col xs={8}>
          <Card className="stat-card stat-card-bonus">
            <Text className="stat-label">Ваш бонус</Text>
            <Title level={2} className="stat-value stat-value-bonus">
              {stats.bonus}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Referral Link */}
      <Card className="referral-link-card">
        <div className="referral-link-content">
          <Text className="referral-link-text" ellipsis>
            {referralLink}
          </Text>
          <Button
            type="text"
            icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            className="copy-button"
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <Space size="middle" className="referral-actions">
        <Button
          type="primary"
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className="referral-action-button"
          block
        >
          Поделиться
        </Button>
        <Button
          type="primary"
          icon={<QrcodeOutlined />}
          onClick={handleQR}
          className="referral-action-button"
          block
        >
          QR
        </Button>
      </Space>
    </div>
  )
}

export default ReferralPage

