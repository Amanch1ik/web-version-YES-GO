import { useState } from 'react'
import { Card, Typography, Button, Row, Col, Input } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { walletService } from '@/services/wallet.service'
import './TopUpPage.css'

const { Title, Text } = Typography

const TopUpPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedAmount, setSelectedAmount] = useState<number | 'other'>(100)
  const [promoCode, setPromoCode] = useState('')

  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
  })

  const amounts = [1000, 800, 600, 500, 300, 100]

  const handleTopUp = () => {
    const amountToPay = selectedAmount === 'other' ? 0 : selectedAmount
    navigate('/wallet/payment-method', { state: { amount: amountToPay } })
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
            <div className="topup-coin-icon">
              <img src="/src/Resources/Images/coin.png" alt="Coin" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
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
            <div className="topup-level-icon">
              <img src="/src/Resources/Images/flash_icon.png" alt="Level" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
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
            <img src="/src/Resources/Images/icon_location.png" alt="Location" className="topup-address-icon" style={{ width: 24, height: 24 }} />
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
        <div className="topup-amount-list">
          {amounts.map((amount) => {
            const active = selectedAmount === amount
            return (
              <button
                key={amount}
                type="button"
                className={`topup-amount-row ${active ? 'active' : ''}`}
                onClick={() => setSelectedAmount(amount)}
              >
                <span className="topup-amount-label">{amount} KGS</span>
                <span className="topup-amount-circle">
                  {active && <span className="topup-amount-circle-inner" />}
                </span>
              </button>
            )
          })}

          <button
            type="button"
            className={`topup-amount-row ${
              selectedAmount === 'other' ? 'active' : ''
            }`}
            onClick={() => setSelectedAmount('other')}
          >
            <span className="topup-amount-label">Другая сумма</span>
            <span className="topup-amount-circle">
              {selectedAmount === 'other' && (
                <span className="topup-amount-circle-inner" />
              )}
            </span>
          </button>
        </div>
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

