import { Input, Card, Row, Col, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import './CategoriesPage.css'

const { Title } = Typography

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 1, name: 'Все компании', icon: '/src/Resources/Images/cat_all.png', color: '#faad14' },
    { id: 2, name: 'Еда и напитки', icon: '/src/Resources/Images/cat_food.png', color: '#fa8c16' },
    { id: 3, name: 'Одежда и обувь', icon: '/src/Resources/Images/cat_clothes.png', color: '#1890ff' },
    { id: 4, name: 'Красота', icon: '/src/Resources/Images/cat_beauty.png', color: '#eb2f96' },
    { id: 5, name: 'Все для дома', icon: '/src/Resources/Images/cat_home.png', color: '#722ed1' },
    { id: 6, name: 'Продукты', icon: '/src/Resources/Images/category_products.png', color: '#52c41a' },
    { id: 7, name: 'Электроника', icon: '/src/Resources/Images/cat_electronics.png', color: '#13c2c2' },
    { id: 8, name: 'Детское', icon: '/src/Resources/Images/cat_kids.png', color: '#fa8c16' },
    { id: 9, name: 'Спорт и отдых', icon: '/src/Resources/Images/cat_sport.png', color: '#2f54eb' },
    { id: 10, name: 'Кафе и рестораны', icon: '/src/Resources/Images/category_cafe.png', color: '#fa541c' },
    { id: 11, name: 'Транспорт', icon: '/src/Resources/Images/category_transport.png', color: '#1890ff' },
    { id: 12, name: 'Образование', icon: '/src/Resources/Images/category_education.png', color: '#722ed1' },
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

      <Row gutter={[16, 16]} className="categories-grid">
        {categories.map((category, index) => (
          <Col key={category.id} xs={8} sm={8} md={8} lg={8}>
            <Card
              hoverable
              className="category-card"
              onClick={() =>
                category.id === 7
                  ? navigate('/categories/electronics')
                  : category.id === 2
                  ? navigate('/categories/food')
                  : navigate(`/partners?category=${category.id}`)
              }
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="category-icon-wrapper"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <img 
                  src={category.icon} 
                  alt={category.name} 
                  className="category-icon"
                />
              </div>
              <div className="category-name">{category.name}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default CategoriesPage
