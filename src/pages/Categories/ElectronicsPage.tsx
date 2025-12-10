import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button, Input, Spin, Empty } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import './ElectronicsPage.css'

const { Title, Text } = Typography

const ElectronicsPage: React.FC = () => {
  const navigate = useNavigate()

  // Получаем партнёров категории "Электроника" (id = 7)
  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners-electronics'],
    queryFn: () => partnerService.getPartnersByCategoryId(7),
    retry: 1,
  })

  // Получаем продукты первого партнёра электроники
  const firstPartnerId = partners?.[0]?.id
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['partner-products', firstPartnerId],
    queryFn: () => firstPartnerId ? partnerService.getPartnerProducts(firstPartnerId) : Promise.resolve([]),
    enabled: !!firstPartnerId,
    retry: 1,
  })

  const isLoading = partnersLoading || productsLoading

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
          <img src="/src/Resources/Eye/basket.svg" alt="Cart" />
        </button>
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
            Магазины электроники
          </Title>
        </div>

        {partnersLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <Spin size="large" />
          </div>
        ) : partners && partners.length > 0 ? (
          <div className="electronics-brands-row">
            {partners.map((partner) => (
              <button
                key={partner.id}
                type="button"
                className="electronics-brand-card"
                onClick={() => navigate(`/partners/${partner.id}`)}
              >
                <div className="electronics-brand-logo">
                  {partner.logo && <img src={partner.logo} alt={partner.name} />}
                </div>
                {partner.cashbackPercent && (
                  <div className="electronics-brand-discount">
                    <span>{partner.cashbackPercent}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <Empty description="Нет доступных магазинов" />
        )}
      </div>

      {/* Products */}
      {products && products.length > 0 && (
        <div className="electronics-section">
          <div className="electronics-section-header">
            <Title level={4} className="electronics-section-title">
              Товары
            </Title>
          </div>
          <Row gutter={[16, 16]} className="electronics-hot-grid">
            {products.map((product) => (
              <Col xs={24} sm={12} key={product.id}>
                <Card className="electronics-product-card" variant="borderless">
                  <div className="electronics-product-image">
                    {(product.image || product.imageUrl) && <img src={product.image || product.imageUrl} alt={product.name} />}
                    {product.discount && (
                      <span className="electronics-discount-pill">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="electronics-product-body">
                    <div className="electronics-price-row">
                      <div className="electronics-price-main">
                        {product.originalPrice && (
                          <div className="electronics-price-old">
                            {product.originalPrice.toLocaleString()} сом
                          </div>
                        )}
                        <div className="electronics-price-current">
                          {product.price?.toLocaleString()} сом
                          {product.yessCoins && ` + ${product.yessCoins} Yess!Coins`}
                        </div>
                      </div>
                    </div>
                    <Text className="electronics-product-name">{product.name}</Text>
                    {product.description && (
                      <Text className="electronics-product-desc">{product.description}</Text>
                    )}
                    <div className="electronics-product-footer">
                      <Button
                        size="small"
                        className="electronics-add-btn"
                        onClick={() => navigate(`/partners/${firstPartnerId}`)}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  )
}

export default ElectronicsPage
