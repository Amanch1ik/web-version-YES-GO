import { useState, useEffect } from 'react'
import { Card, Typography, Button, message, Alert } from 'antd'
import { ArrowLeftOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { finikService } from '@/services/finik.service'
import './FinikPaymentPage.css'

const { Title, Text } = Typography

const FinikPaymentPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const amount = location.state?.amount || 100
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Проверяем наличие API ключей
    const keys = finikService.getApiKeys()
    if (!keys) {
      message.warning('API ключи Finik не настроены. Обратитесь к администратору.')
    }
  }, [])

  const handleCreatePayment = async () => {
    setLoading(true)
    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const returnUrl = `${window.location.origin}/wallet/finik-success`

      const response = await finikService.createPayment({
        amount,
        currency: 'KGS',
        orderId,
        description: `Пополнение кошелька Yess!Coin на сумму ${amount} KGS`,
        returnUrl,
      })

      if (response.success && response.paymentUrl) {
        // Проверяем, является ли URL внутренним маршрутом
        if (response.paymentUrl.startsWith('/') || response.paymentUrl.startsWith(window.location.origin)) {
          // Внутренний маршрут - используем navigate
          navigate(response.paymentUrl)
        } else {
          // Внешний URL - перенаправляем на страницу оплаты Finik
          window.location.href = response.paymentUrl
        }
      } else {
        message.error(response.error || 'Ошибка при создании платежа')
      }
    } catch (error: any) {
      message.error('Не удалось создать платеж. Попробуйте позже.')
      console.error('Finik payment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="finik-payment-page">
      <div className="finik-payment-header">
        <ArrowLeftOutlined
          className="finik-payment-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="finik-payment-title">
          Оплата через Finik
        </Title>
      </div>

      <Card className="finik-payment-card">
        <div className="finik-payment-content">
          <div className="finik-logo-section">
            <CreditCardOutlined className="finik-logo-icon" />
            <Title level={3} className="finik-logo-title">
              Finik
            </Title>
          </div>

          <div className="finik-amount-section">
            <Text className="finik-amount-label">Сумма пополнения</Text>
            <Title level={2} className="finik-amount-value">
              {amount} KGS
            </Title>
          </div>

          <div className="finik-info-section">
            <Alert
              message="Безопасная оплата"
              description="Ваши платежные данные защищены. Оплата обрабатывается через защищенный сервис Finik."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <div className="finik-benefits">
              <div className="finik-benefit-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>Быстрая обработка платежей</Text>
              </div>
              <div className="finik-benefit-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>Безопасные транзакции</Text>
              </div>
              <div className="finik-benefit-item">
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text>Поддержка всех карт</Text>
              </div>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            className="finik-payment-button"
            block
            loading={loading}
            onClick={handleCreatePayment}
            icon={<CreditCardOutlined />}
          >
            Перейти к оплате
          </Button>

          <Text className="finik-help-text">
            После нажатия кнопки вы будете перенаправлены на страницу оплаты Finik
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default FinikPaymentPage

