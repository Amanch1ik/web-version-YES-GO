import { useState } from 'react'
import { Card, Input, Button, Typography, message } from 'antd'
import { PaperClipOutlined, CheckCircleOutlined } from '@ant-design/icons'
import './PromoCodePage.css'

const { Title } = Typography

const PromoCodePage: React.FC = () => {
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!promoCode.trim()) {
      message.warning('Введите промокод')
      return
    }

    setLoading(true)
    
    // Имитация API запроса
    setTimeout(() => {
      setLoading(false)
      message.success('Промокод успешно активирован!')
      setPromoCode('')
    }, 1500)
  }

  return (
    <div className="promo-code-page">
      <div className="promo-code-header">
        <PaperClipOutlined className="promo-code-header-icon" />
        <Title level={3} className="promo-code-title">
          Ввести промокод
        </Title>
      </div>

      <Card className="promo-code-card">
        <div className="promo-code-content">
          <Input
            size="large"
            placeholder="Введите промокод"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            onPressEnter={handleSubmit}
            className="promo-code-input"
            prefix={<PaperClipOutlined style={{ color: '#52c41a' }} />}
            suffix={
              promoCode && (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              )
            }
          />
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            loading={loading}
            className="promo-code-button"
            block
          >
            Активировать промокод
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PromoCodePage

