import { useState } from 'react'
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
  List
} from 'antd'
import { 
  ArrowLeftOutlined, 
  ShoppingCartOutlined,
  InstagramOutlined,
  PhoneOutlined,
  WhatsAppOutlined
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner, Product, Review } from '@/types/partner'
import './PartnerDetailPage.css'

const { Title, Text } = Typography

// Моковые данные для отзывов (в реальном приложении будут приходить с API)
const mockReviews: Review[] = [
  {
    id: '1',
    partnerId: '1',
    userId: '1',
    userName: 'Айтбеков Аманбол',
    rating: 5,
    text: 'Недавно купил у вас IPHONE 14 Pro очень понравился камера бомба',
    createdAt: '2025-11-08T17:44:00Z',
  },
  {
    id: '2',
    partnerId: '1',
    userId: '2',
    userName: 'Канай',
    rating: 4,
    text: 'Купил наушники вчера, очень хорошее качество звука, всем советую',
    createdAt: '2025-11-08T17:44:00Z',
  },
]

const PartnerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'products' | 'reviews'>('reviews')

  const { data: partner, isLoading: partnerLoading } = useQuery<Partner>({
    queryKey: ['partner', id],
    queryFn: async () => {
      // В реальном приложении будет отдельный endpoint для получения партнера по ID
      const partners = await partnerService.getPartners()
      return partners.find(p => p.id === id) || partners[0]
    },
    enabled: !!id,
  })

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['partner-products', id],
    queryFn: () => partnerService.getPartnerProducts(id || ''),
    enabled: !!id && activeTab === 'products',
  })

  const reviews = mockReviews.filter(r => r.partnerId === id)

  if (partnerLoading) {
    return <div>Загрузка...</div>
  }

  if (!partner) {
    return <div>Партнер не найден</div>
  }

  const categoryName = partner.category || 'Электроника'
  const discount = partner.discount || 30
  const rating = partner.rating || 5.0
  const reviewCount = partner.reviewCount || 1365

  return (
    <div className="partner-detail-page">
      {/* Header with Background */}
      <div className="partner-detail-header">
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
            icon={<ShoppingCartOutlined />}
            className="partner-detail-cart-button"
          />
        </div>
      </div>

      {/* Partner Info Card */}
      <Card className="partner-info-card">
        <div className="partner-info-content">
          <Avatar 
            size={80} 
            src={partner.logo}
            className="partner-logo"
          >
            {partner.name?.[0] || 'P'}
          </Avatar>
          <div className="partner-info-text">
            <Title level={2} className="partner-name">
              {partner.name}
            </Title>
            <div className="partner-discount-badge">
              <Badge.Ribbon text={`-${discount}%`} color="green">
                <div style={{ padding: '8px 0' }}>
                  <Text className="partner-discount-text">Скидки на все</Text>
                </div>
              </Badge.Ribbon>
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
                icon={<InstagramOutlined />} 
                className="social-button"
              />
              <Button 
                type="text" 
                icon={<WhatsAppOutlined />} 
                className="social-button"
                style={{ color: '#25D366' }}
              />
              <Button 
                type="text" 
                icon={<PhoneOutlined />} 
                className="social-button"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="partner-tabs-card">
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
                              icon={<ShoppingCartOutlined />}
                            >
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
                <>
                  <List
                    dataSource={reviews}
                    renderItem={(review) => (
                      <List.Item className="review-item">
                        <List.Item.Meta
                          avatar={
                            <Avatar size={48} icon={<span>👤</span>} />
                          }
                          title={
                            <div className="review-header">
                              <Text strong className="review-user-name">
                                {review.userName}
                              </Text>
                              <Rate disabled defaultValue={review.rating} allowHalf className="review-rating" />
                            </div>
                          }
                          description={
                            <>
                              <Text className="review-text">{review.text}</Text>
                              <Text className="review-date">
                                {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Text>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  {reviews.length === 0 && (
                    <div className="empty-state">Отзывов пока нет</div>
                  )}
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export default PartnerDetailPage

