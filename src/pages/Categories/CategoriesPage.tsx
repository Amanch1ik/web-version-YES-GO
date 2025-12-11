import { Input, Card, Row, Col, Typography, Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import './CategoriesPage.css'

const { Title } = Typography

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['partner-categories'],
    queryFn: partnerService.getCategories,
    retry: 1,
  })

  // Цвета для категорий
  const categoryColors = [
    '#faad14', '#fa8c16', '#1890ff', '#eb2f96', '#722ed1',
    '#52c41a', '#13c2c2', '#fa8c16', '#2f54eb', '#fa541c',
    '#1890ff', '#722ed1'
  ]

  return (
    <div className="categories-page">
      <div className="search-section">
        <Input
          size="large"
          placeholder="Поиск по компаниям"
          prefix={(
            <img
              src="/src/Resources/Images/search_category_icon.png"
              alt="Поиск"
              className="search-icon"
            />
          )}
          suffix={(
            <div className="search-suffix-icons">
              <img
                src="/src/Resources/Eye/basket.svg"
                alt="Корзина"
                className="suffix-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/orders')
                }}
              />
              <img 
                src="/src/Resources/Images/map_category_icon.png" 
                alt="Город" 
                className="suffix-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/city')
                }}
              />
            </div>
          )}
          className="search-input"
        />
      </div>

      <Title level={2} className="categories-title">
        Категории
      </Title>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : categories && categories.length > 0 ? (
        <Row gutter={[16, 16]} className="categories-grid">
          {categories.map((category, index) => (
            <Col key={`${category.id ?? category.name ?? index}`} xs={8} sm={8} md={8} lg={8}>
              <Card
                hoverable
                className="category-card"
                onClick={() => navigate(`/partners?category=${category.id}`)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="category-icon-wrapper"
                  style={{ backgroundColor: `${categoryColors[index % categoryColors.length]}15` }}
                >
                  {category.iconUrl && (
                    <img 
                      src={category.iconUrl} 
                      alt={category.name} 
                      className="category-icon"
                    />
                  )}
                </div>
                <div className="category-name">{category.name}</div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="Нет доступных категорий" />
      )}
    </div>
  )
}

export default CategoriesPage
