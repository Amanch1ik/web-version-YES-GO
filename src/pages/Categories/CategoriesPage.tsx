import { Input, Card, Row, Col, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './CategoriesPage.css'

const { Title, Text } = Typography

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 1, name: 'Все компании', icon: '🤝', color: '#faad14' },
    { id: 2, name: 'Еда и напитки', icon: '🍳', color: '#ff4d4f' },
    { id: 3, name: 'Одежда и обувь', icon: '👕', color: '#1890ff' },
    { id: 4, name: 'Красота', icon: '💄', color: '#eb2f96' },
    { id: 5, name: 'Все для дома', icon: '🛋️', color: '#722ed1' },
    { id: 6, name: 'Продукты', icon: '🥬', color: '#52c41a' },
    { id: 7, name: 'Электроника', icon: '💻', color: '#13c2c2' },
    { id: 8, name: 'Детское', icon: '🧸', color: '#fa8c16' },
    { id: 9, name: 'Спорт и отдых', icon: '🏋️', color: '#2f54eb' },
    { id: 10, name: 'Кафе и рестораны', icon: '☕', color: '#fa541c' },
    { id: 11, name: 'Транспорт', icon: '🚗', color: '#1890ff' },
    { id: 12, name: 'Образование', icon: '📚', color: '#722ed1' },
  ]

  return (
    <div className="categories-page">
      <div className="search-section">
        <Input
          size="large"
          placeholder="Поиск по компаниям"
          prefix={<SearchOutlined />}
          suffix={
            <span style={{ color: '#52c41a', cursor: 'pointer' }}>🗺️</span>
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
                <span className="category-icon">{category.icon}</span>
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

