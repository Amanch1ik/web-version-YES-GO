import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button, Input, Rate, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './ElectronicsPage.css'

const { Title, Text } = Typography

const ElectronicsPage: React.FC = () => {
  const navigate = useNavigate()

  const promoBanners = [
    {
      id: 'yessgo-1',
      title: 'Yess!Go',
      subtitle: 'Лучшие устройства по выгодным ценам.',
      cta: 'Экономь до 50%!',
      image: '/src/Resources/Images/Frame 20.png',
      background: '#ffffff',
      accent: '#52c41a',
    },
    {
      id: 'electronics-2',
      title: 'Покупай электронику выгодно',
      subtitle: 'Комбинируй оплату сомами и YessCoins.',
      cta: 'Купить',
      image: '/src/Resources/Images/Frame 11 (1).png',
      background: '#ffffff',
      accent: '#00b46f',
    },
  ]

  const brands = [
    { id: 'techfire', name: 'TECHFIRE', logo: '/src/Resources/Images/appicon_images.png' },
    { id: 'assa', name: 'ASSA techno kg', logo: '/src/Resources/Images/cat_electronics.png' },
    { id: 'fox', name: 'ЛисМобайл', logo: '/src/Resources/Images/cat_home.png' },
    { id: 'other', name: 'Еще', logo: '/src/Resources/Images/cat_all.png' },
  ]

  const hotDeals = [
    {
      id: 'iphone-14',
      name: 'Apple iPhone 14 Pro 256GB',
      image: '/src/Resources/Images/image 183.png',
      discount: 30,
      price: 130000,
      oldPrice: 160000,
      coins: 3000,
      description:
        'Экран 6.3" OLED ProMotion • Камера 48 МП Pro+ UltraWide + Telephoto • Чип A18 Pro',
    },
    {
      id: 'airpods-pro',
      name: 'Apple AirPods Pro 2',
      image: '/src/Resources/Images/image 184.png',
      discount: 30,
      price: 18000,
      oldPrice: 21000,
      coins: 3000,
      description:
        'Adaptive Noise Cancellation • Чистый звук • Магнитная зарядка',
    },
    {
      id: 'watch-pro',
      name: 'Smart Watch Pro',
      image: '/src/Resources/Images/image 185.png',
      discount: 30,
      price: 9500,
      oldPrice: 12000,
      coins: 1500,
      description:
        'AMOLED дисплей • Мониторинг здоровья • До 10 дней без подзарядки',
    },
    {
      id: 'laptop-ultra',
      name: 'UltraBook 14\"',
      image: '/src/Resources/Images/image 269.png',
      discount: 30,
      price: 78000,
      oldPrice: 93000,
      coins: 2500,
      description:
        'Лёгкий корпус • SSD 512 ГБ • 16 ГБ RAM • Идеален для работы и учебы',
    },
  ]

  return (
    <div className="electronics-page">
      {/* Header */}
      <div className="electronics-header">
        <button
          type="button"
          className="electronics-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined />
        </button>
        <Title level={4} className="electronics-title">
          Электроника
        </Title>
        <button
          type="button"
          className="electronics-cart-button"
          onClick={() => navigate('/orders')}
        >
          <img
            src="/src/Resources/Eye/basket.svg"
            alt="Cart"
          />
        </button>
      </div>

      {/* Promo banners */}
      <div className="electronics-promo-row">
        {promoBanners.map((banner) => (
          <Card
            key={banner.id}
            className="electronics-promo-card"
            style={{ background: banner.background }}
            variant="borderless"
          >
            <div className="electronics-promo-content">
              <div className="electronics-promo-text">
                <Text className="promo-brand">{banner.title}</Text>
                <Text className="promo-subtitle">{banner.subtitle}</Text>
                <Button
                  size="small"
                  className="promo-cta"
                  style={{ backgroundColor: banner.accent }}
                >
                  {banner.cta}
                </Button>
              </div>
              <div className="electronics-promo-image">
                <img src={banner.image} alt={banner.title} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="electronics-search">
        <Input
          size="large"
          placeholder="Поиск"
          prefix={(
            <img
              src="/src/Resources/Images/search.png"
              alt="Поиск"
              className="electronics-search-icon"
            />
          )}
          className="electronics-search-input"
        />
      </div>

      {/* Popular brands */}
      <div className="electronics-section">
        <div className="electronics-section-header">
          <Title level={4} className="electronics-section-title">
            Популярные бренды
          </Title>
        </div>
        <div className="electronics-brands-row">
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className="electronics-brand-card"
              onClick={() => navigate('/partners')}
            >
              <div className="electronics-brand-logo">
                <img src={brand.logo} alt={brand.name} />
              </div>
              <div className="electronics-brand-discount">
                <Tag color="green">30%</Tag>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hot prices */}
      <div className="electronics-section">
        <div className="electronics-section-header">
          <Title level={4} className="electronics-section-title">
            Горячие цены
          </Title>
        </div>
        <Row gutter={[16, 16]} className="electronics-hot-grid">
          {hotDeals.map((deal) => (
            <Col xs={24} sm={12} key={deal.id}>
              <Card className="electronics-product-card" variant="borderless">
                <div className="electronics-product-image">
                  <img src={deal.image} alt={deal.name} />
                  <span className="electronics-discount-pill">
                    -{deal.discount}%
                  </span>
                </div>
                <div className="electronics-product-body">
                  <div className="electronics-price-row">
                    <div className="electronics-price-main">
                      <div className="electronics-price-old">
                        {deal.oldPrice.toLocaleString()} сом
                      </div>
                      <div className="electronics-price-current">
                        {deal.price.toLocaleString()} сом + {deal.coins.toLocaleString()} Yess!Coins
                      </div>
                    </div>
                    <img
                      src="/src/Resources/Images/coin.png"
                      alt="YessCoin"
                      className="electronics-coin-icon"
                    />
                  </div>
                  <Text className="electronics-product-name">
                    {deal.name}
                  </Text>
                  <Text className="electronics-product-desc">
                    {deal.description}
                  </Text>
                  <div className="electronics-product-footer">
                    <Rate disabled defaultValue={5} allowHalf className="electronics-product-rating" />
                    <Button
                      size="small"
                      className="electronics-add-btn"
                    >
                      <img src="/src/Resources/Eye/basket.svg" alt="Cart" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default ElectronicsPage


