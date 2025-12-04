import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Avatar, Typography, Button } from 'antd'
import { HistoryOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { walletService } from '@/services/wallet.service'
import { partnerService } from '@/services/partner.service'
import './HomePage.css'

const { Title, Text } = Typography

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
  })

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: partnerService.getPartners,
  })

  const quickActions = [
    { icon: '🎁', label: 'Бонусы', color: '#722ed1', onClick: () => navigate('/certificates') },
    { icon: '🪙', label: 'Yess!Coin', color: '#faad14', onClick: () => navigate('/wallet') },
    { icon: '📱', label: 'Мы', color: '#1890ff', onClick: () => navigate('/social') },
    { icon: '🎉', label: 'Акции', color: '#722ed1', onClick: () => navigate('/partners') },
    { icon: '🎂', label: 'ДР', color: '#eb2f96', onClick: () => navigate('/promo-code') },
  ]

  const categories = [
    { name: 'Одежда и обувь', image: '👕', id: '1', color: '#52c41a' },
    { name: 'Все для дома', image: '🛋️', id: '2', color: '#1890ff' },
    { name: 'Электроника', image: '📱', id: '3', color: '#722ed1' },
  ]

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-content">
          <Avatar size={48} style={{ backgroundColor: '#52c41a', marginRight: 12 }}>
            {user?.firstName?.[0] || user?.fullName?.[0] || user?.phone?.[0] || user?.email?.[0] || 'U'}
          </Avatar>
          <div>
            <Title level={4} style={{ margin: 0, color: '#fff' }}>
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`.trim()
                : user?.fullName || 'Пользователь'}
            </Title>
            <Text style={{ color: '#fff', opacity: 0.9 }}>
              {user?.phone || user?.email || ''}
            </Text>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="balance-card">
        <div className="balance-header">
          <Text className="balance-label">Ваш Баланс</Text>
          <Button type="link" icon={<HistoryOutlined />} className="history-link">
            История &gt;
          </Button>
        </div>
        <div className="balance-content">
          <div>
            <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
              {balance?.balance || 0}
            </Title>
            <Button className="coin-badge">Yess!Coin</Button>
          </div>
          <div className="coins-illustration">🪙🪙🪙</div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div key={index} className="quick-action-item" onClick={action.onClick}>
            <div className="quick-action-icon" style={{ backgroundColor: `${action.color}20` }}>
              <span style={{ fontSize: 24 }}>{action.icon}</span>
            </div>
            <Text className="quick-action-label">{action.label}</Text>
          </div>
        ))}
      </div>

      {/* Promo Banners */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12}>
          <Card className="promo-banner promo-banner-red">
            <div className="promo-content">
              <div>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  А вот и весна!
                </Title>
                <Text style={{ color: '#fff', display: 'block', marginTop: 8 }}>
                  -20% на заказы от 1000
                </Text>
                <Text className="promo-code">Промокод: rt8pxdj</Text>
              </div>
              <div className="promo-image">🛒</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="promo-banner promo-banner-green">
            <div className="promo-content">
              <div>
                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                  Доставка
                </Title>
                <Text style={{ color: '#fff', display: 'block', marginTop: 8 }}>
                  СКИДКА -25% на первый заказ
                </Text>
                <Text style={{ color: '#fff', display: 'block', fontSize: 12, marginTop: 4 }}>
                  Доставка от 30 минут
                </Text>
                <Text className="promo-code">Промокод: gnfva4t</Text>
              </div>
              <div className="promo-image">🚚</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Categories */}
      <div style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>Категории</Title>
          <Button type="link" style={{ color: '#52c41a' }} onClick={() => navigate('/categories')}>
            Все категории &gt;
          </Button>
        </div>
        <Row gutter={16}>
          {categories.map((category, index) => (
            <Col key={category.id || index} xs={24} sm={8} md={8}>
              <Card 
                hoverable 
                className="category-card"
                onClick={() => navigate(`/partners?category=${category.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-icon" style={{ fontSize: 48 }}>{category.image}</div>
                <Text className="category-name">{category.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Partners */}
      {partners && partners.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div className="partners-header">
            <Title level={3} style={{ margin: 0 }}>Наши Партнеры</Title>
            <Button 
              type="link" 
              style={{ color: '#52c41a' }}
              onClick={() => navigate('/partners')}
            >
              Смотреть Все
            </Button>
          </div>
          <div className="partners-list">
            {partners.slice(0, 4).map((partner: any) => (
              <div 
                key={partner.id} 
                className="partner-logo"
                onClick={() => navigate(`/partners/${partner.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Avatar size={64} style={{ backgroundColor: '#52c41a' }}>
                  {partner.name?.[0] || 'P'}
                </Avatar>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
