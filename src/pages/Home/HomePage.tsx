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
  
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: partnerService.getPartners,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const featuredPartners =
    partners && partners.length > 0
      ? partners.slice(0, 4).map((partner) => ({
          id: partner.id,
          name: partner.name,
          logo: partner.logo,
        }))
      : [
          {
            id: 'static-1',
            name: 'Supermarket',
            logo: '/src/Resources/Images/metropub.jpg',
          },
          {
            id: 'static-2',
            name: 'Dover',
            logo: '/src/Resources/Images/category_products.png',
          },
          {
            id: 'static-3',
            name: 'Fresh',
            logo: '/src/Resources/Images/category_cafe.png',
          },
          {
            id: 'static-4',
            name: 'Electro',
            logo: '/src/Resources/Images/cat_electronics.png',
          },
        ]

  const quickActions = [
    { icon: '/src/Resources/Images/sc_bonus.png', label: 'Бонусы', color: '#722ed1', onClick: () => navigate('/certificates') },
    { icon: '/src/Resources/Images/coin.png', label: 'Yess!Coin', color: '#faad14', onClick: () => navigate('/wallet') },
    { icon: '/src/Resources/Images/sc_we.png', label: 'Мы', color: '#1890ff', onClick: () => navigate('/social') },
    { icon: '/src/Resources/Images/sc_sale.png', label: 'Акции', color: '#722ed1', onClick: () => navigate('/stories') },
    { icon: '/src/Resources/Images/storiespage_bday.png', label: 'ДР', color: '#eb2f96', onClick: () => navigate('/promo-code') },
  ]

  const categories = [
    { name: 'Одежда и обувь', icon: '/src/Resources/Images/cat_clothes.png', id: '1', color: '#52c41a' },
    { name: 'Все для дома', icon: '/src/Resources/Images/cat_home.png', id: '2', color: '#1890ff' },
    { name: 'Электроника', icon: '/src/Resources/Images/cat_electronics.png', id: '3', color: '#722ed1' },
  ]

  // Форматируем имя пользователя
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName.charAt(0)}.`
    }
    if (user?.fullName) {
      const parts = user.fullName.split(' ')
      if (parts.length > 1) {
        return `${parts[0]} ${parts[1].charAt(0)}.`
      }
      return user.fullName
    }
    return 'Пользователь'
  }

  // Форматируем телефон
  const formatPhone = (phone?: string) => {
    if (!phone) return ''
    // Форматируем как +996 507700007
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length >= 9) {
      return `+996 ${cleaned.slice(-9).match(/.{1,3}/g)?.join('') || cleaned.slice(-9)}`
    }
    return phone
  }

  return (
    <div className="home-page">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-content">
          <Avatar 
            size={48} 
            src={user?.avatar || '/src/Resources/Images/profile.png'}
            className="home-avatar"
          >
            {!user?.avatar && (user?.firstName?.[0] || user?.fullName?.[0] || user?.phone?.[0] || user?.email?.[0] || 'U')}
          </Avatar>
          <div className="home-user-info">
            <Title level={4} className="home-user-name">
              {getUserDisplayName()}
            </Title>
            <Text className="home-user-phone">
              {formatPhone(user?.phone || user?.email || '')}
            </Text>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="balance-card">
        <div className="balance-header">
          <Text className="balance-label">Ваш Баланс</Text>
          <Button 
            type="link" 
            className="history-link"
            onClick={() => navigate('/wallet')}
          >
            История →
          </Button>
        </div>
        <div className="balance-content">
          <div className="balance-main">
            <Title level={2} className="balance-amount">
              {balanceLoading ? '...' : balance?.balance?.toFixed(1) || '0.0'}
            </Title>
            <Button className="coin-badge">Yess!Coin</Button>
          </div>
          <div className="coins-illustration">
            <img src="/src/Resources/Images/coin.png" alt="Coin" className="coin-img coin-1" />
            <img src="/src/Resources/Images/coin.png" alt="Coin" className="coin-img coin-2" />
            <img src="/src/Resources/Images/coin.png" alt="Coin" className="coin-img coin-3" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <div 
            key={index} 
            className="quick-action-item" 
            onClick={action.onClick}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className="quick-action-icon" 
              style={{ backgroundColor: `${action.color}15` }}
            >
              <img 
                src={action.icon} 
                alt={action.label} 
                className="quick-action-icon-img"
              />
            </div>
            <Text className="quick-action-label">{action.label}</Text>
          </div>
        ))}
      </div>

      {/* Promo Banners */}
      <Row gutter={16} className="promo-banners-row">
        <Col xs={24} sm={12}>
          <Card 
            className="promo-banner promo-banner-red"
            onClick={() => navigate('/promo-code')}
          >
            <div className="promo-content">
              <div className="promo-text">
                <Title level={4} className="promo-title">
                  А вот и весна!
                </Title>
                <Text className="promo-description">
                  -20% на заказы от 1000
                </Text>
                <Text className="promo-code">Промокод: rt8pxdj</Text>
              </div>
              <div className="promo-image">
                <img 
                  src="/src/Resources/Images/banner_1.png" 
                  alt="Promo" 
                  className="promo-image-img"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card 
            className="promo-banner promo-banner-green"
            onClick={() => navigate('/partners')}
          >
            <div className="promo-content">
              <div className="promo-text">
                <Title level={4} className="promo-title">
                  Доставка
                </Title>
                <Text className="promo-description">
                  СКИДКА -25% на первый заказ
                </Text>
                <Text className="promo-delivery-time">
                  Доставка от 30 минут
                </Text>
                <Text className="promo-code">Промокод: gnfva4t</Text>
              </div>
              <div className="promo-image">
                <img 
                  src="/src/Resources/Images/banner_2.png" 
                  alt="Delivery" 
                  className="promo-image-img"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Categories */}
      <div className="categories-section">
        <div className="section-header">
          <Title level={3} className="section-title">Категории</Title>
          <Button 
            type="link" 
            className="section-link"
            onClick={() => navigate('/categories')}
          >
            Все категории →
          </Button>
        </div>
        <Row gutter={16} className="categories-row">
          {categories.map((category, index) => (
            <Col key={category.id || index} xs={24} sm={8} md={8}>
              <Card 
                hoverable 
                className="category-card"
                onClick={() => navigate(`/partners?category=${category.id}`)}
              >
                <div className="category-icon">
                  <img 
                    src={category.icon} 
                    alt={category.name} 
                    className="category-icon-img"
                  />
                </div>
                <Text className="category-name">{category.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Our Partners */}
      <div className="partners-section">
        <Card className="partners-card" onClick={() => navigate('/partners')}>
          <Title level={4} className="partners-title">
            Наши Партнеры
          </Title>
          <div className="partners-list">
            {featuredPartners.map((partner) => (
              <div
                key={partner.id}
                className="partner-logo"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/partners/${partner.id}`)
                }}
              >
                <Avatar
                  size={56}
                  src={partner.logo}
                  className="partner-avatar"
                >
                  {partner.name.charAt(0)}
                </Avatar>
              </div>
            ))}
          </div>
          <Button type="link" className="partners-see-all">
            Смотреть Все
          </Button>
        </Card>
      </div>

    </div>
  )
}

export default HomePage
