import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tabs,
  Rate,
  Badge,
  Row,
  Col,
  Empty,
} from 'antd'
import { 
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner, Product, Review } from '@/types/partner'
import { resolveAssetUrl } from '@/utils/assets'
import './PartnerDetailPage.css'

const { Title, Text } = Typography

const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('reviews')

  const { data: partner, isLoading: partnerLoading } = useQuery<Partner>({
    queryKey: ['partner', id],
    queryFn: () => partnerService.getPartnerById(id || ''),
    enabled: !!id,
  })

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['partner-products', id],
    queryFn: () => partnerService.getPartnerProducts(id || ''),
    enabled: !!id && activeTab === 'products',
    select: (data) => data ?? [],
  })

  // Backend не отдает отзывы в swagger, поэтому пока не запрашиваем, чтобы не ловить 404
  const reviews: Review[] = []
  const reviewsLoading = false

  if (partnerLoading) {
    return <div>Загрузка...</div>
  }

  if (!partner) {
    return <div>Партнер не найден</div>
  }

  const categoryName = partner.category || 'Категория'
  const discount = partner.discount || 0
  const rating = partner.rating || 0
  const reviewCount = partner.reviewCount || reviews.length || 0

  const headerImage = resolveAssetUrl(
    partner.coverUrl ||
    (partner as any).CoverUrl ||
    (partner as any).cover ||
    (partner as any).Cover ||
    (partner as any).coverImageUrl ||
    (partner as any).CoverImageUrl ||
    (partner as any).image ||
    (partner as any).Image ||
    (partner as any).photo ||
    (partner as any).Photo
  ) || '/src/Resources/Images/banner_2.png'

  const fallbackProducts: Product[] = []

  const handleOpenInMaps = () => {
    const query = partner.address || partner.name
    if (!query) return

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`
    window.open(url, '_blank')
  }

  const getInstagramUrl = () => {
    const handle = partner.socialMedia?.instagram
    if (!handle) return 'https://instagram.com'
    if (handle.startsWith('http')) return handle
    return `https://instagram.com/${handle.replace('@', '')}`
  }

  const getWhatsappUrl = () => {
    const phone = partner.socialMedia?.whatsapp || partner.phone
    if (!phone) return 'https://wa.me'
    const digits = phone.replace(/\D/g, '')
    return `https://wa.me/${digits}`
  }

  const getPhoneUrl = () => {
    const phone = partner.socialMedia?.phone || partner.phone
    if (!phone) return 'tel:'
    return `tel:${phone.replace(/\s/g, '')}`
  }

  return (
    <div className="partner-detail-page">
      {/* Header with Background */}
      <div
        className="partner-detail-header"
        style={{ backgroundImage: `url('${headerImage}')` }}
      >
        <div className="partner-detail-header-content">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="partner-detail-back-button"
            onClick={() => navigate(-1)}
          />
          <Title level={4} className="partner-detail-category-title">
            {categoryName}
          </Title>
          <Button
            type="text"
            className="partner-detail-cart-button"
            onClick={() => navigate('/cart')}
          >
            <img src="/src/Resources/Eye/basket.svg" alt="Cart" style={{ width: 20, height: 20 }} />
          </Button>
        </div>
      </div>

      {/* Partner Info Card */}
      <Card className="partner-info-card">
        <div className="partner-info-content">
          <Avatar 
            size={80} 
            src={resolveAssetUrl(
              partner.logoUrl ||
              (partner as any).LogoUrl ||
              (partner as any).logo ||
              (partner as any).Logo ||
              (partner as any).image ||
              (partner as any).Image ||
              partner.avatarUrl ||
              (partner as any).avatar ||
              (partner as any).Avatar ||
              (partner as any).photo ||
              (partner as any).Photo
            )}
            className="partner-logo"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          >
            {!resolveAssetUrl(
              partner.logoUrl ||
              (partner as any).LogoUrl ||
              (partner as any).logo ||
              (partner as any).Logo ||
              (partner as any).image ||
              (partner as any).Image ||
              partner.avatarUrl ||
              (partner as any).avatar ||
              (partner as any).Avatar ||
              (partner as any).photo ||
              (partner as any).Photo
            ) && (partner.name?.[0] || 'P')}
          </Avatar>
          <div className="partner-info-text">
            <Title level={2} className="partner-name">
              {partner.name}
            </Title>
            <div className="partner-discount-badge">
              <Button
                type="primary"
                size="large"
                className="partner-discount-button"
                onClick={() => {
                  // Переход на вкладку товаров или открытие модального окна со скидками
                  setActiveTab('products')
                  // Можно также добавить прокрутку к товарам
                  setTimeout(() => {
                    const productsSection = document.querySelector('.partner-tabs-card')
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }}
              >
                <Badge.Ribbon text={`-${discount}%`} color="green">
                  <div style={{ padding: '8px 16px' }}>
                    <Text className="partner-discount-text" strong>Скидки на все</Text>
                  </div>
                </Badge.Ribbon>
              </Button>
            </div>
            <div className="partner-rating">
              <Rate disabled defaultValue={rating} allowHalf />
              <Text className="partner-rating-text">
                {rating.toFixed(1)} ({reviewCount} отзывов)
              </Text>
            </div>
            <Text className="partner-description">
              {partner.description || 'Техника для вашего комфорта | Быстрые и умные устройства | Только сертифицированная электроника'}
            </Text>
            <div className="partner-social">
              <Button 
                type="text" 
                className="social-button"
                onClick={() => window.open(getInstagramUrl(), '_blank')}
              >
                <img src="/src/Resources/PatnerDetailViewPage/skill_icons_instagram.svg" alt="Instagram" style={{ width: 24, height: 24 }} />
              </Button>
              <Button 
                type="text" 
                className="social-button"
                style={{ color: '#25D366' }}
                onClick={() => window.open(getWhatsappUrl(), '_blank')}
              >
                <img src="/src/Resources/PatnerDetailViewPage/logos_whatsapp_icon.svg" alt="WhatsApp" style={{ width: 24, height: 24 }} />
              </Button>
              <Button 
                type="text" 
                className="social-button"
                onClick={() => window.open(getPhoneUrl(), '_blank')}
              >
                <img src="/src/Resources/PatnerDetailViewPage/famicons_call.svg" alt="Phone" style={{ width: 24, height: 24 }} />
              </Button>
            </div>
            {partner.address && (
              <div className="partner-address">
                <Typography.Paragraph className="partner-address-text">
                  {partner.address}
                </Typography.Paragraph>
                <Button 
                  type="default" 
                  size="small" 
                  className="partner-map-button"
                  onClick={handleOpenInMaps}
                >
                  Открыть на карте
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="partner-tabs-card animate-fade">
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as 'products' | 'reviews')}
          className="partner-tabs"
          items={[
            {
              key: 'products',
              label: 'Товары',
              children: (
                <>
                  {productsLoading ? (
                    <div>Загрузка товаров...</div>
                  ) : products && products.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {products.map((product) => (
                        <Col xs={24} sm={12} key={product.id}>
                      <Card
                        hoverable
                        className="product-card"
                        cover={
                          product.image || (product as any).imageUrl || (product as any).ImageUrl || (product as any).Image || (product as any).image ? (
                            <img
                              alt={product.name}
                              src={resolveAssetUrl(
                                (product as any).imageUrl ||
                                (product as any).ImageUrl ||
                                (product as any).image ||
                                (product as any).Image
                              )}
                            />
                          ) : (
                            <div className="product-image-placeholder">
                              {product.name?.[0] || 'P'}
                            </div>
                          )
                        }
                      >
                            <div className="product-badge">
                              {product.discount && (
                                <Badge count={`-${product.discount}%`} style={{ backgroundColor: '#52c41a' }} />
                              )}
                            </div>
                            <Title level={5} className="product-name">
                              {product.name}
                            </Title>
                            {product.description && (
                              <Text className="product-description" ellipsis>
                                {product.description}
                              </Text>
                            )}
                            <div className="product-price">
                              {product.originalPrice && (
                                <Text delete className="product-original-price">
                                  {product.originalPrice.toLocaleString()} сом
                                </Text>
                              )}
                              <Text className="product-current-price">
                                {product.price.toLocaleString()} сом
                              </Text>
                              {product.yessCoins && (
                                <Text className="product-coins">
                                  + {product.yessCoins.toLocaleString()} Yess!Coins
                                </Text>
                              )}
                            </div>
                            <Button 
                              type="primary" 
                              block 
                              className="product-add-button"
                            >
                              <img src="/src/Resources/Eye/basket.svg" alt="Cart" style={{ width: 16, height: 16, marginRight: 8 }} />
                              В корзину
                            </Button>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : fallbackProducts.length > 0 ? (
                    <Row gutter={[16, 16]}>
                      {fallbackProducts.map((product) => (
                        <Col xs={24} sm={12} key={product.id}>
                          <Card
                            hoverable
                            className="product-card"
                            cover={
                              product.image ? (
                                <img alt={product.name} src={product.image} />
                              ) : (
                                <div className="product-image-placeholder">
                                  {product.name?.[0] || 'P'}
                                </div>
                              )
                            }
                          >
                            <div className="product-badge">
                              {product.discount && (
                                <Badge count={`-${product.discount}%`} style={{ backgroundColor: '#52c41a' }} />
                              )}
                            </div>
                            <Title level={5} className="product-name">
                              {product.name}
                            </Title>
                            {product.description && (
                              <Text className="product-description" ellipsis>
                                {product.description}
                              </Text>
                            )}
                            <div className="product-price">
                              {product.originalPrice && (
                                <Text delete className="product-original-price">
                                  {product.originalPrice.toLocaleString()} сом
                                </Text>
                              )}
                              <Text className="product-current-price">
                                {product.price.toLocaleString()} сом
                              </Text>
                              {product.yessCoins && (
                                <Text className="product-coins">
                                  + {product.yessCoins.toLocaleString()} Yess!Coins
                                </Text>
                              )}
                            </div>
                            <Button 
                              type="primary" 
                              block 
                              className="product-add-button"
                            >
                              <img src="/src/Resources/Eye/basket.svg" alt="Cart" style={{ width: 16, height: 16, marginRight: 8 }} />
                              В корзину
                            </Button>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="empty-state">Товары не найдены</div>
                  )}
                </>
              ),
            },
            {
              key: 'reviews',
              label: 'Отзывы',
              children: (
                <div style={{ padding: '12px 0' }}>
                  {reviewsLoading ? (
                    <Spin />
                  ) : reviews.length > 0 ? (
                    <div className="partner-reviews-list">
                      {reviews.map((review) => (
                        <Card key={review.id} className="partner-review-card" variant="borderless">
                          <div className="review-header">
                            <div className="review-user">
                              <Avatar size={40} className="review-avatar">
                                {review.userName[0] || 'U'}
                              </Avatar>
                              <div className="review-user-meta">
                                <Text strong className="review-user-name">
                                  {review.userName}
                                </Text>
                                <Rate
                                  disabled
                                  defaultValue={review.rating}
                                  allowHalf
                                  className="review-rating"
                                />
                              </div>
                            </div>
                            <Text className="review-date">
                              {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </Text>
                          </div>
                          <Text className="review-text">{review.text}</Text>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Empty description="Отзывы недоступны" />
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default PartnerDetailPage

