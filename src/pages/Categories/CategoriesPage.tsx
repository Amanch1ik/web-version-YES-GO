import { Input, Card, Row, Col, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './CategoriesPage.css'

const { Title, Text } = Typography

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 1, name: 'Все компании', icon: '/src/Resources/Images/cat_all.png', color: '#faad14' },
    { id: 2, name: 'Еда и напитки', icon: '/src/Resources/Images/cat_food.png', color: '#ff4d4f' },
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
          prefix={<SearchOutlined />}
          suffix={
            <img src="/src/Resources/Images/map_category_icon.png" alt="Map" style={{ width: 20, height: 20, cursor: 'pointer' }} />
          }
          className="search-input"
        />
      </div>

      <Title level={2} style={{ marginTop: 24, marginBottom: 16 }}>
        Категории
      </Title>

      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col key={category.id} xs={8} sm={8} md={8} lg={8}>
            <Card
              hoverable
              className="category-card"
              onClick={() => navigate(`/partners?category=${category.id}`)}
            >
              <div
                className="category-icon-wrapper"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <img src={category.icon} alt={category.name} className="category-icon" style={{ width: 40, height: 40, objectFit: 'contain' }} />
              </div>
              <Text className="category-name">{category.name}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default CategoriesPage

