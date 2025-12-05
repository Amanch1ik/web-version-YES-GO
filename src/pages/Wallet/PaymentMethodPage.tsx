import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Typography, List, Avatar, message } from 'antd'
import { ArrowLeftOutlined, RightOutlined, CreditCardOutlined } from '@ant-design/icons'
import './PaymentMethodPage.css'

const { Title, Text } = Typography

const PaymentMethodPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const amount = location.state?.amount || 100

  const paymentMethods = [
    {
      id: 'finik',
      name: 'Finik',
      description: 'Быстрые и безопасные платежи',
      icon: (
        <div className="finik-icon">
          <CreditCardOutlined style={{ fontSize: 24, color: '#52c41a' }} />
        </div>
      ),
    },
    {
      id: 'mbank',
      name: 'МБанк',
      icon: (
        <div className="mbank-icon">
          <span className="mbank-m">M</span>
          <span className="mbank-star">❄</span>
        </div>
      ),
    },
    {
      id: 'bakai',
      name: 'Бакай банк',
      icon: (
        <div className="bakai-icon">
          <span className="bakai-text">BB</span>
        </div>
      ),
    },
    {
      id: 'visa',
      name: 'Банковские карты (Visa)',
      icon: (
        <div className="visa-icon">
          <span className="visa-text">VISA</span>
        </div>
      ),
    },
    {
      id: 'mastercard',
      name: 'Банковские карты (Master Card)',
      icon: (
        <div className="mastercard-icon">
          <div className="mastercard-circles">
            <div className="mastercard-circle red"></div>
            <div className="mastercard-circle orange"></div>
          </div>
        </div>
      ),
    },
  ]

  const handleSelectMethod = (methodId: string) => {
    if (methodId === 'finik') {
      navigate('/wallet/finik-payment', { state: { amount } })
    } else if (methodId === 'mbank') {
      navigate('/wallet/mbank-topup', { state: { amount } })
    } else {
      // Для других методов оплаты показываем сообщение
      message.info(`Метод оплаты "${methodId}" находится в разработке`)
    }
  }

  return (
    <div className="payment-method-page">
      <div className="payment-method-header">
        <ArrowLeftOutlined
          className="payment-method-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="payment-method-title">
          Выберите способ оплаты:
        </Title>
      </div>

      <Card className="payment-method-card">
        <List
          dataSource={paymentMethods}
          renderItem={(method) => (
            <List.Item
              className="payment-method-item"
              onClick={() => handleSelectMethod(method.id)}
            >
              <List.Item.Meta
                avatar={<Avatar size={48} icon={method.icon} className="payment-method-avatar" />}
                title={<Text className="payment-method-name">{method.name}</Text>}
              />
              <RightOutlined className="payment-method-arrow" />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default PaymentMethodPage

