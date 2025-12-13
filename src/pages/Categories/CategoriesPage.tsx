import { Input, Card, Row, Col, Typography, Spin, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import './CategoriesPage.css'
import { resolveAssetUrl, imageResource, designImageResource } from '@/utils/assets'

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

  // Функция для получения изображения категории - точное сопоставление по названиям
  const getCategoryImage = (categoryName?: string, categoryId?: number): string => {
    if (!categoryName) return imageResource('cat_all.png')
    
    const name = categoryName.toLowerCase().trim()
    
    // Точное сопоставление по названиям из дизайна
    if (name.includes('все компании') || name === 'все компании' || name.includes('all companies')) {
      return imageResource('cat_all.png')
    }
    // Еда и напитки - отдельная категория
    if ((name.includes('еда') && name.includes('напитк')) || (name.includes('food') && name.includes('drink'))) {
      return imageResource('cat_food.png')
    }
    // Продукты - отдельная категория с овощами
    if (name === 'продукты' || (name.includes('продукт') && !name.includes('еда')) || name.includes('groceries')) {
      return imageResource('category_products.png')
    }
    if ((name.includes('одежда') && name.includes('обувь')) || (name.includes('clothes') && name.includes('shoes'))) {
      return imageResource('cat_clothes.png')
    }
    if (name === 'красота' || name.includes('красот') || name.includes('beauty')) {
      return imageResource('cat_beauty.png')
    }
    if (name.includes('дом') || name === 'все для дома' || name.includes('home')) {
      return imageResource('cat_home.png')
    }
    if (name.includes('электро') || name.includes('electronics')) {
      return imageResource('cat_electronics.png')
    }
    if (name === 'детское' || name.includes('дет') || name.includes('kids')) {
      return imageResource('cat_kids.png')
    }
    if ((name.includes('спорт') && name.includes('отдых')) || name.includes('sport')) {
      return imageResource('cat_sport.png')
    }
    if ((name.includes('кафе') || name.includes('ресторан')) || name.includes('cafe') || name.includes('restaurant')) {
      return imageResource('category_cafe.png')
    }
    if (name === 'транспорт' || name.includes('транспорт') || name.includes('transport')) {
      return imageResource('category_transport.png')
    }
    if (name === 'образование' || name.includes('образован') || name.includes('education')) {
      return imageResource('category_education.png')
    }
    
    // Fallback на основе частичных совпадений
    if (name.includes('еда') || name.includes('напитк') || name.includes('food') || name.includes('drink')) {
      return imageResource('cat_food.png')
    }
    if (name.includes('одежда') || name.includes('обувь') || name.includes('clothes') || name.includes('shoes')) {
      return imageResource('cat_clothes.png')
    }
    if (name.includes('красот') || name.includes('beauty')) {
      return imageResource('cat_beauty.png')
    }
    if (name.includes('дом') || name.includes('home')) {
      return imageResource('cat_home.png')
    }
    if (name.includes('электро') || name.includes('electronics')) {
      return imageResource('cat_electronics.png')
    }
    if (name.includes('дет') || name.includes('kids')) {
      return imageResource('cat_kids.png')
    }
    if (name.includes('спорт') || name.includes('sport')) {
      return imageResource('cat_sport.png')
    }
    if (name.includes('кафе') || name.includes('ресторан') || name.includes('cafe')) {
      return imageResource('category_cafe.png')
    }
    if (name.includes('транспорт') || name.includes('transport')) {
      return imageResource('category_transport.png')
    }
    if (name.includes('образован') || name.includes('education')) {
      return imageResource('category_education.png')
    }
    
    return imageResource('cat_all.png')
  }

  return (
    <div className="categories-page">
      <div className="search-section animate-fade">
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
                  navigate('/cart')
                }}
              />
              <img 
                src="/src/Resources/Images/map_category_icon.png" 
                alt="Карта" 
                className="suffix-icon"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/map')
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
        <Row gutter={[16, 16]} className="categories-grid animate-fade">
          {categories.map((category, index) => {
            const iconSrc = resolveAssetUrl(
              category.iconUrl ||
              (category as any).IconUrl ||
              (category as any).icon ||
              (category as any).Icon ||
              (category as any).image ||
              (category as any).Image ||
              (category as any).coverUrl ||
              (category as any).CoverUrl
            )
            const fallbackImage = getCategoryImage(category.name, category.id)
            return (
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
                  <img 
                    src={iconSrc || fallbackImage} 
                    alt={category.name} 
                    className="category-icon"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      // Если изображение не загрузилось, используем fallback
                      if (target.src !== fallbackImage) {
                        target.src = fallbackImage
                      } else {
                        // Если и fallback не загрузился, показываем placeholder
                        target.style.display = 'none'
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }
                    }}
                  />
                  <div className="category-icon-placeholder" style={{ display: 'none' }}>
                    {category.name?.[0] || 'C'}
                  </div>
                </div>
                <div className="category-name">{category.name}</div>
              </Card>
            </Col>
          )})}
        </Row>
      ) : (
        <Empty description="Нет доступных категорий" />
      )}
    </div>
  )
}

export default CategoriesPage
