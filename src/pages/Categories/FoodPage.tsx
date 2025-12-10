import { useNavigate } from 'react-router-dom'
import { Card, Typography, Input, Spin, Empty } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import './FoodPage.css'

const { Title, Text } = Typography

const FoodPage: React.FC = () => {
  const navigate = useNavigate()

  // Получаем партнёров категории "Еда и напитки" (id = 2)
  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners-food'],
    queryFn: () => partnerService.getPartnersByCategoryId(2),
    retry: 1,
  })

  // Получаем категории
  const { data: categories } = useQuery({
    queryKey: ['partner-categories'],
    queryFn: partnerService.getCategories,
    retry: 1,
  })

  const foodCategories = categories?.filter(cat => 
    cat.name?.toLowerCase().includes('еда') || 
    cat.name?.toLowerCase().includes('напиток') ||
    cat.name?.toLowerCase().includes('кофе') ||
    cat.name?.toLowerCase().includes('ресторан')
  ) || []

  return (
    <div className="food-page">
      {/* Header */}
      <div className="food-header">
        <button
          type="button"
          className="food-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined />
        </button>
        <Title level={4} className="food-title">
          Еда и напитки
        </Title>
        <button
          type="button"
          className="food-cart-button"
          onClick={() => navigate('/orders')}
        >
          <img src="/src/Resources/Eye/basket.svg" alt="Cart" />
        </button>
      </div>

      {/* Search */}
      <div className="food-search">
        <Input
          size="large"
          placeholder="Поиск"
          prefix={(
            <img
              src="/src/Resources/Images/search.png"
              alt="Поиск"
              className="food-search-icon"
            />
          )}
          className="food-search-input"
        />
      </div>

      {/* Food categories */}
      {foodCategories.length > 0 && (
        <div className="food-chips-row">
          {foodCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="food-chip"
              onClick={() => navigate(`/partners?category=${cat.id}`)}
            >
              <div className="food-chip-icon">
                {cat.iconUrl && <img src={cat.iconUrl} alt={cat.name} />}
              </div>
              <span className="food-chip-label">{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Partners list */}
      <div className="food-section">
        <div className="food-section-header">
          <Title level={4} className="food-section-title">
            Рестораны и кафе
          </Title>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
            <Spin size="large" />
          </div>
        ) : partners && partners.length > 0 ? (
          partners.map((partner) => (
            <Card
              key={partner.id}
              className="food-restaurant-card"
              variant="borderless"
              onClick={() => navigate(`/partners/${partner.id}`)}
            >
              <div className="food-restaurant-image">
                {partner.logo && <img src={partner.logo} alt={partner.name} />}
              </div>
              <div className="food-restaurant-info">
                <div className="food-restaurant-title-row">
                  <Text className="food-restaurant-name">{partner.name}</Text>
                  {partner.cashbackPercent && (
                    <span className="food-restaurant-discount">
                      {partner.cashbackPercent}%
                    </span>
                  )}
                </div>
                {partner.description && (
                  <Text className="food-restaurant-rating">{partner.description}</Text>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Empty description="Нет доступных партнёров" />
        )}
      </div>
    </div>
  )
}

export default FoodPage
