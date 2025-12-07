import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button, Input, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './FoodPage.css'

const { Title, Text } = Typography

const FoodPage: React.FC = () => {
  const navigate = useNavigate()

  const categories = [
    { id: 'fastfood', name: 'Фаст-фуд', icon: '/src/Resources/Images/stories_sales.png' },
    { id: 'burger', name: 'Бургер', icon: '/src/Resources/Images/sales_stories1.png' },
    { id: 'chicken', name: 'Курица', icon: '/src/Resources/Images/Frame 20 (1).png' },
    { id: 'lagman', name: 'Лагман', icon: '/src/Resources/Images/sales_stories2.png' },
    { id: 'coffee', name: 'Кофе', icon: '/src/Resources/Images/sales_stories3.png' },
  ]

  const brands = [
    { id: 'whycook', name: 'WHYCOOK', logo: '/src/Resources/Images/Frame 20 (1).png' },
    { id: 'tasty', name: 'Tasty', logo: '/src/Resources/Images/sales_stories4.png' },
    { id: 'goodfood', name: 'good food', logo: '/src/Resources/Images/storiespage_yesscoin.png' },
    { id: 'goods', name: 'GOOD', logo: '/src/Resources/Images/storiespage_bonus.png' },
  ]

  const restaurants = [
    {
      id: 'whycook-rest',
      name: 'WHYCOOK',
      image: '/src/Resources/Images/Frame 20 (1).png',
      discount: '30 %',
      rating: '100 % (500+)',
    },
    {
      id: 'mubarak',
      name: 'Mubarak/Мубарак',
      image: '/src/Resources/Images/image 185.png',
      discount: '25 %',
      rating: '97 % (400+)',
    },
  ]

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

      {/* Food categories icons */}
      <div className="food-chips-row">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className="food-chip"
          >
            <div className="food-chip-icon">
              <img src={cat.icon} alt={cat.name} />
            </div>
            <span className="food-chip-label">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Popular brands */}
      <div className="food-section">
        <div className="food-section-header">
          <Title level={4} className="food-section-title">
            Популярные бренды
          </Title>
        </div>
        <div className="food-brands-row">
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              className="food-brand-card"
              onClick={() => navigate('/partners')}
            >
              <div className="food-brand-logo">
                <img src={brand.logo} alt={brand.name} />
              </div>
              <Tag color="green" className="food-brand-discount">
                30 %
              </Tag>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurants list */}
      <div className="food-section">
        {restaurants.map((rest) => (
          <Card
            key={rest.id}
            className="food-restaurant-card"
            variant="borderless"
            onClick={() => navigate('/partners')}
          >
            <div className="food-restaurant-image">
              <img src={rest.image} alt={rest.name} />
            </div>
            <div className="food-restaurant-info">
              <div className="food-restaurant-title-row">
                <Text className="food-restaurant-name">{rest.name}</Text>
                <Tag color="green" className="food-restaurant-discount">
                  {rest.discount}
                </Tag>
              </div>
              <Text className="food-restaurant-rating">{rest.rating}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default FoodPage


