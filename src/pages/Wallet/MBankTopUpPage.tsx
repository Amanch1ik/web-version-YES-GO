import { useState } from 'react'
import { Card, Typography, Button, Radio } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './MBankTopUpPage.css'

const { Title, Text } = Typography

const MBankTopUpPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const amount = location.state?.amount || 100
  const [selectedPhone, setSelectedPhone] = useState(user?.phone || '+996 507700007')

  const handleContinue = () => {
    navigate('/wallet/confirm-code', {
      state: {
        amount,
        phone: selectedPhone,
        method: 'mbank',
      },
    })
  }

  return (
    <div className="mbank-topup-page">
      <div className="mbank-topup-header">
        <div className="mbank-logo">
          <div className="mbank-logo-bg">
            <span className="mbank-logo-m">M</span>
            <span className="mbank-logo-star">❄</span>
          </div>
        </div>
        <Title level={4} className="mbank-topup-title">
          Пополнение через МБанк
        </Title>
      </div>

      <Card className="mbank-topup-card">
        <div className="mbank-topup-content">
          <Text className="mbank-phone-label">Выберите номер телефона</Text>

          <Radio.Group
            value={selectedPhone}
            onChange={(e) => setSelectedPhone(e.target.value)}
            className="mbank-phone-group"
          >
            <Radio value={user?.phone || '+996 507700007'} className="mbank-phone-option">
              {user?.phone || '+996 507700007'}
            </Radio>
          </Radio.Group>

          <Text className="mbank-info-text">
            Код подтверждения придет в ваше приложение МБанк
          </Text>

          <div className="mbank-amount-display">
            <Text className="mbank-amount-label">Сумма пополнения: {amount} KGS</Text>
          </div>
        </div>
      </Card>

      <Button
        type="primary"
        size="large"
        className="mbank-continue-button"
        block
        onClick={handleContinue}
      >
        Продолжить
      </Button>
    </div>
  )
}

export default MBankTopUpPage

