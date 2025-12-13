import { useNavigate } from 'react-router-dom'
import { Row, Col, Card, Avatar, Typography, Button, Spin, Empty } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { walletService } from '@/services/wallet.service'
import { partnerService } from '@/services/partner.service'
import { bannerService } from '@/services/banner.service'
import { promotionService } from '@/services/promotion.service'
import { Banner } from '@/types/banner'
import { resolveAssetUrl, imageResource } from '@/utils/assets'
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

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['partner-categories-home'],
    queryFn: partnerService.getCategories,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: activeBanners, isLoading: bannersLoading } = useQuery({
    queryKey: ['active-banners'],
    queryFn: bannerService.getActiveBanners,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Получаем промокоды для баннеров
  const { data: promoCodes } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: promotionService.getPromoCodes,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Моковые партнеры для статического дизайна
  const featuredPartners = partners?.slice(0, 4).map((partner) => ({
    id: partner.id,
    name: partner.name,
    logo: resolveAssetUrl(
      partner.logoUrl ||
      (partner as any).LogoUrl ||
      (partner as any).logo ||
      (partner as any).image ||
      (partner as any).Image ||
      (partner as any).avatarUrl ||
      (partner as any).avatar ||
      (partner as any).Avatar ||
      (partner as any).photo ||
      (partner as any).Photo
    ),
  })) || [
    { id: 1, name: 'Partner 1', logo: '/src/Resources/Images/profile.png' },
    { id: 2, name: 'Partner 2', logo: '/src/Resources/Images/profile.png' },
    { id: 3, name: 'Partner 3', logo: '/src/Resources/Images/profile.png' },
    { id: 4, name: 'Partner 4', logo: '/src/Resources/Images/profile.png' }
  ]

  const quickActions = [
    { icon: '/src/Resources/Images/sc_bonus.png', label: 'Бонусы', color: '#722ed1', onClick: () => navigate('/certificates') },
    { icon: '/src/Resources/Images/Component 2.png', label: 'Yess!Coin', color: '#faad14', onClick: () => navigate('/wallet') },
    { icon: '/src/Resources/Images/sc_we.png', label: 'Мы', color: '#1890ff', onClick: () => navigate('/social') },
    { icon: '/src/Resources/Images/image 278.png', label: 'Акции', color: '#722ed1', onClick: () => navigate('/stories') },
    { icon: '/src/Resources/Images/image 183.png', label: 'ДР', color: '#eb2f96', onClick: () => navigate('/promo-code') },
  ]

  // Для статического дизайна используем моковые данные
  const categories = categoriesData?.slice(0, 3) || [
    { id: 1, name: 'Одежда и обувь' },
    { id: 2, name: 'Все для дома' },
    { id: 3, name: 'Электроника' }
  ]

  // Моковые баннеры для дизайна
  const bannersToShow = activeBanners?.slice(0, 2) || [
    {
      id: 1,
      title: 'А вот и весна!',
      description: '-20% на первый заказ от 1000 р',
      promoCode: 'rt8pxdj',
      imageUrl: '/src/Resources/Images/banner_1.png'
    } as Banner,
    {
      id: 2,
      title: 'Доставка',
      description: 'СКИДКА -25% на первый заказ',
      promoCode: 'gnfva4t',
      deliveryTime: 'Доставка от 30 минут',
      imageUrl: '/src/Resources/Images/banner_2.png'
    } as Banner
  ]

  // Маппинг названий категорий к изображениям - точное сопоставление
  const getCategoryImage = (categoryName?: string): string => {
    if (!categoryName) return imageResource('cat_all.png')
    
    const name = categoryName.toLowerCase().trim()
    
    // Точное сопоставление по названиям из дизайна
    if (name.includes('все компании') || name === 'все компании') {
      return imageResource('cat_all.png')
    }
    if ((name.includes('еда') && name.includes('напитк')) || (name.includes('food') && name.includes('drink'))) {
      return imageResource('cat_food.png')
    }
    if (name === 'продукты' || (name.includes('продукт') && !name.includes('еда'))) {
      return imageResource('category_products.png')
    }
    if ((name.includes('одежда') && name.includes('обувь')) || name.includes('clothes') || name.includes('shoes')) {
      return imageResource('cat_clothes.png')
    }
    if (name === 'красота' || name.includes('красот')) {
      return imageResource('cat_beauty.png')
    }
    if (name.includes('дом') || name === 'все для дома') {
      return imageResource('cat_home.png')
    }
    if (name.includes('электро')) {
      return imageResource('cat_electronics.png')
    }
    if (name === 'детское' || name.includes('дет')) {
      return imageResource('cat_kids.png')
    }
    if (name.includes('спорт') && name.includes('отдых')) {
      return imageResource('cat_sport.png')
    }
    if (name.includes('кафе') || name.includes('ресторан')) {
      return imageResource('category_cafe.png')
    }
    if (name === 'транспорт' || name.includes('транспорт')) {
      return imageResource('category_transport.png')
    }
    if (name === 'образование' || name.includes('образован')) {
      return imageResource('category_education.png')
    }
    
    // Fallback
    if (name.includes('одежда') || name.includes('обувь')) {
      return imageResource('cat_clothes.png')
    }
    if (name.includes('дом')) {
      return imageResource('cat_home.png')
    }
    if (name.includes('электро')) {
      return imageResource('cat_electronics.png')
    }
    if (name.includes('еда')) {
      return imageResource('cat_food.png')
    }
    if (name.includes('красот')) {
      return imageResource('cat_beauty.png')
    }
    if (name.includes('спорт')) {
      return imageResource('cat_sport.png')
    }
    if (name.includes('дет')) {
      return imageResource('cat_kids.png')
    }
    
    return imageResource('cat_all.png')
  }

  // Получаем промо-код для баннера
  const getBannerPromoCode = (banner: Banner, index: number): string | undefined => {
    // Используем моковые промо-коды для дизайна
    if (index === 0) return 'rt8pxdj'
    if (index === 1) return 'gnfva4t'
    
    // Проверяем, есть ли промо-код в самом баннере
    if ((banner as any).promoCode || (banner as any).promo_code || (banner as any).promocode) {
      return (banner as any).promoCode || (banner as any).promo_code || (banner as any).promocode
    }
    // Если есть promotionId, ищем промо-код в списке
    if (banner.promotionId && promoCodes) {
      const promoCode = promoCodes.find(pc => pc.promotionId === banner.promotionId)
      return promoCode?.code
    }
    return undefined
  }

  const handleBannerClick = (banner: Banner) => {
    if (banner.externalUrl) {
      window.open(banner.externalUrl, '_blank', 'noopener')
      return
    }

    if (banner.actionType === 'partner' && banner.partnerId) {
      navigate(`/partners/${banner.partnerId}`)
      return
    }

    if (banner.actionType === 'category' && banner.categoryId) {
      navigate(`/partners?category=${banner.categoryId}`)
      return
    }

    if (banner.actionType === 'promotion' && banner.promotionId) {
      navigate(`/promo-code?promotionId=${banner.promotionId}`)
      return
    }

    navigate('/partners')
  }

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
            src={resolveAssetUrl(
              user?.avatarUrl ||
              (user as any)?.AvatarUrl ||
              (user as any)?.avatar ||
              (user as any)?.Avatar ||
              (user as any)?.photo ||
              (user as any)?.Photo ||
              (user as any)?.image ||
              (user as any)?.Image
            ) || '/src/Resources/Images/profile.png'}
            className="home-avatar"
            onError={() => false}
          >
            {!resolveAssetUrl(
              user?.avatarUrl ||
              (user as any)?.AvatarUrl ||
              (user as any)?.avatar ||
              (user as any)?.Avatar
            ) && (user?.firstName?.[0] || user?.fullName?.[0] || user?.phone?.[0] || user?.email?.[0] || 'U')}
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
              {balanceLoading ? '...' : balance?.balance?.toFixed(1) || '55.7'}
            </Title>
            <Button className="coin-badge">Yess!Coin</Button>
          </div>
          <div className="coins-illustration">
            <img src="/src/Resources/Images/coin.png" alt="Coin" className="coin-img" />
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="quick-actions animate-fade">
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
      <Row gutter={16} className="promo-banners-row animate-slide">
        {bannersLoading ? (
          <Col
            span={24}
            style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 }}
          >
            <Spin />
          </Col>
        ) : bannersToShow.length > 0 ? (
          bannersToShow.map((banner, index) => (
            <Col key={banner.id} xs={24} sm={12}>
              <Card 
                className={`promo-banner ${index % 2 === 0 ? 'promo-banner-red' : 'promo-banner-green'}`}
                onClick={() => handleBannerClick(banner)}
              >
                <div className="promo-content">
                  <div className="promo-text">
                    {banner.title && (
                      <Title level={4} className="promo-title">
                        {banner.title}
                      </Title>
                    )}
                    {banner.description && (
                      <Text className="promo-description">
                        {banner.description}
                      </Text>
                    )}
                    {getBannerPromoCode(banner, index) && (
                      <Text className="promo-code">
                        {getBannerPromoCode(banner, index)}
                      </Text>
                    )}
                    {/* Бейдж "Доставка от 30 минут" для зеленого баннера */}
                    {index === 1 && (
                      <Text className="promo-delivery-time">
                        Доставка от 30 минут
                      </Text>
                    )}
                  </div>
                  <div className="promo-image">
                    <img 
                      src={resolveAssetUrl(
                        banner.imageUrl ||
                        (banner as any).ImageUrl ||
                        (banner as any).image ||
                        (banner as any).Image ||
                        (banner as any).coverUrl ||
                        (banner as any).CoverUrl ||
                        (banner as any).photo ||
                        (banner as any).Photo
                      ) || '/src/Resources/Images/banner_1.png'} 
                      alt={banner.title || 'Баннер'} 
                      className="promo-image-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/src/Resources/Images/banner_1.png'
                      }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Empty description="Нет баннеров" />
          </Col>
        )}
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
        {categoriesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 }}>
            <Spin />
          </div>
        ) : categories.length > 0 ? (
          <Row gutter={16} className="categories-row animate-fade">
            {categories.map((category, index) => (
              <Col key={category.id || index} xs={24} sm={8} md={8}>
                <Card 
                  hoverable 
                  className="category-card"
                  onClick={() => navigate(`/partners?category=${category.id}`)}
                >
                  <div className="category-icon">
                    <img 
                      src={getCategoryImage(category.name)} 
                      alt={category.name} 
                      className="category-icon-img"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }}
                    />
                    <div className="category-icon-placeholder" style={{ display: 'none' }}>
                      {category.name?.[0] || 'C'}
                    </div>
                  </div>
                  <Text className="category-name">{category.name}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Нет категорий" />
        )}
      </div>

      {/* Our Partners */}
      <div className="partners-section animate-fade">
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
                  onError={() => false}
                >
                  {!partner.logo && partner.name.charAt(0)}
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
