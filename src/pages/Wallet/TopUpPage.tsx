import { useState } from 'react'
import { Card, Typography, Button, Row, Col, Input, Radio, Space } from 'antd'
import { ArrowLeftOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services/wallet.service'
import './TopUpPage.css'

const { Title, Text } = Typography

const TopUpPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [promoCode, setPromoCode] = useState('')

  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
  })

  const amounts = [1000, 800, 600, 500, 300, 100]

  const handleTopUp = () => {
    navigate('/wallet/payment-method', { state: { amount: selectedAmount } })
  }

  return (
    <div className="topup-page">
      <div className="topup-header">
        <ArrowLeftOutlined
          className="topup-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="topup-title">
          Пополнение
        </Title>
      </div>

      {/* Top Cards */}
      <Row gutter={12} className="topup-top-cards">
        <Col xs={6}>
          <Card className="topup-balance-card">
            <div className="topup-coin-icon">🪙</div>
            <Title level={3} className="topup-balance-amount">
              {balance?.balance || 55.7}
            </Title>
            <Button className="topup-coin-button" size="small">
              Yess!Coin
            </Button>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="topup-level-card">
            <div className="topup-level-icon">🛡️</div>
            <Text className="topup-level-name">Бронза</Text>
            <div className="topup-levels-row">
              <span className="topup-level-badge bronze">BRONZE</span>
              <span className="topup-level-badge gold">GOLD</span>
              <span className="topup-level-badge silver">SILVER</span>
            </div>
            <Text className="topup-levels-label">Уровни</Text>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="topup-info-card">
            <Title level={5} className="topup-info-title">
              Что такое Yess!coin
            </Title>
            <Button className="topup-info-button" size="small">
              Посмотреть
            </Button>
          </Card>
        </Col>
        <Col xs={6}>
          <Card className="topup-address-card">
            <EnvironmentOutlined className="topup-address-icon" />
            <Title level={5} className="topup-address-title">
              Адреса наших партнеров
            </Title>
            <Button className="topup-address-button" size="small">
              1 Адрес
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Promo Code Input */}
      <Input
        size="large"
        placeholder="Ввести промокод"
        value={promoCode}
        onChange={(e) => setPromoCode(e.target.value)}
        className="topup-promo-input"
      />

      {/* Amount Selection */}
      <div className="topup-amount-section">
        <Title level={5} className="topup-amount-title">
          Выберите сумму пополнения:
        </Title>
        <Radio.Group
          value={selectedAmount}
          onChange={(e) => setSelectedAmount(e.target.value)}
          className="topup-amount-group"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {amounts.map((amount) => (
              <Radio key={amount} value={amount} className="topup-amount-option">
                {amount} KGS
              </Radio>
            ))}
            <Radio value="other" className="topup-amount-option">
              Другая сумма
            </Radio>
          </Space>
        </Radio.Group>
      </div>

      {/* Top Up Button */}
      <Button
        type="primary"
        size="large"
        className="topup-submit-button"
        block
        onClick={handleTopUp}
      >
        Пополнить
      </Button>
    </div>
  )
}

export default TopUpPage

