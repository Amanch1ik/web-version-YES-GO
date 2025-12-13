import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input, Card, Row, Col, Typography, Rate, Empty, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner } from '@/types/partner'
import { resolveAssetUrl, imageResource } from '@/utils/assets'
import './PartnersPage.css'

const { Text, Title } = Typography

const PartnersPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  // Читаем параметр category из URL при загрузке
  useEffect(() => {
    const categoryId = searchParams.get('category')
    if (categoryId) {
      const categoryIdNum = parseInt(categoryId, 10)
      if (!isNaN(categoryIdNum)) {
        setSelectedCategory(categoryIdNum)
      }
    } else {
      setSelectedCategory(null)
    }
  }, [searchParams])

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['partner-categories'],
    queryFn: partnerService.getCategories,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: partners, isLoading: partnersLoading, error } = useQuery({
    queryKey: ['partners', selectedCategory],
    queryFn: partnerService.getPartners,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  // Функция для получения изображения категории - приоритет маппингу по названию
  const getCategoryImage = (categoryName?: string): string => {
    if (!categoryName) return imageResource('cat_all.png')
    
    const name = categoryName.toLowerCase().trim()
    
    // Точное сопоставление по названиям из дизайна
    // Продукты - должна быть отдельная категория с овощами (проверяем первым, так как "продукт" может быть в других названиях)
    if (name === 'продукты' || (name.includes('продукт') && !name.includes('компани') && !name.includes('еда'))) {
      return imageResource('category_products.png')
    }
    // Еда и напитки
    if (name.includes('еда') && name.includes('напитк')) {
      return imageResource('cat_food.png')
    }
    // Одежда и обувь
    if ((name.includes('одежда') && name.includes('обувь')) || name === 'одежда и обувь') {
      return imageResource('cat_clothes.png')
    }
    // Красота
    if (name === 'красота' || name.includes('красот')) {
      return imageResource('cat_beauty.png')
    }
    // Все для дома
    if (name.includes('дом') || name === 'все для дома' || name.includes('home')) {
      return imageResource('cat_home.png')
    }
    // Электроника
    if (name.includes('электро') || name.includes('electronics')) {
      return imageResource('cat_electronics.png')
    }
    // Детское
    if (name === 'детское' || name.includes('дет')) {
      return imageResource('cat_kids.png')
    }
    // Спорт и отдых
    if ((name.includes('спорт') && name.includes('отдых')) || name.includes('спорт') || name === 'спорт и отдых') {
      return imageResource('cat_sport.png')
    }
    // Кафе и рестораны
    if ((name.includes('кафе') && name.includes('ресторан')) || name.includes('кафе') || name.includes('ресторан')) {
      return imageResource('category_cafe.png')
    }
    // Транспорт
    if (name === 'транспорт' || name.includes('транспорт')) {
      return imageResource('category_transport.png')
    }
    // Образование
    if (name === 'образование' || name.includes('образован')) {
      return imageResource('category_education.png')
    }
    // Все компании
    if (name.includes('все компани') || name === 'все компании' || name.includes('all')) {
      return imageResource('cat_all.png')
    }
    
    // Частичные совпадения как fallback
    if (name.includes('еда') || name.includes('напитк') || name.includes('food')) {
      return imageResource('cat_food.png')
    }
    if (name.includes('одежда') || name.includes('обувь') || name.includes('clothes')) {
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
    if (name.includes('кафе') || name.includes('cafe')) {
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

  // Цвета для категорий
  const categoryColors = [
    '#faad14', '#fa8c16', '#1890ff', '#eb2f96', '#722ed1',
    '#52c41a', '#13c2c2', '#fa8c16', '#2f54eb', '#fa541c',
    '#1890ff', '#722ed1'
  ]

  const filteredPartners =
    partners
      ?.filter((partner: Partner) =>
        partner.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((partner: Partner) => {
        if (!selectedCategory) return true
        // Проверяем разные варианты структуры данных
        return partner.categoryId === selectedCategory || 
               (partner as any).category?.id === selectedCategory ||
               (partner as any).categoryId === selectedCategory
      }) || []

  return (
    <div className="partners-page">
      {/* Header with green background */}
      <div className="partners-header">
        <div className="partners-header-content">
          {/* Search & filters block */}
          <div className="partners-search-panel">
            <div className="partners-search-row">
              <Input
                size="large"
                placeholder="Поиск по компаниям"
                prefix={(
                  <img
                    src="/src/Resources/Images/search_category_icon.png"
                    alt="Поиск"
                    className="partners-search-icon"
                  />
                )}
                suffix={(
                  <div className="partners-search-suffix-icons">
                    <img
                      src="/src/Resources/Eye/basket.svg"
                      alt="Корзина"
                      className="partners-search-suffix-icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/cart')
                      }}
                    />
                    <img
                      src="/src/Resources/Images/map_category_icon.png"
                      alt="Карта"
                      className="partners-map-icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('/map')
                      }}
                    />
                  </div>
                )}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="partners-search-input"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Categories Grid - White background */}
      <div className="partners-content">
        <Title level={2} className="partners-categories-title">
          Категории
        </Title>

        {categoriesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spin size="large" />
          </div>
        ) : categories && categories.length > 0 ? (
          <Row gutter={[16, 16]} className="partners-categories-grid animate-fade">
            {categories.map((category, index) => {
              // Всегда используем маппинг по названию для правильного отображения
              const categoryImage = getCategoryImage(category.name)
              return (
                <Col key={`${category.id ?? category.name ?? index}`} xs={8} sm={8} md={8} lg={8}>
                  <Card
                    hoverable
                    className="partners-category-card"
                    onClick={() => {
                      setSelectedCategory(category.id)
                      navigate(`/partners?category=${category.id}`)
                    }}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className="partners-category-icon-wrapper"
                      style={{ backgroundColor: `${categoryColors[index % categoryColors.length]}15` }}
                    >
                      <img 
                        src={categoryImage} 
                        alt={category.name} 
                        className="partners-category-icon"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const placeholder = target.nextElementSibling as HTMLElement
                          if (placeholder) placeholder.style.display = 'flex'
                        }}
                      />
                      <div className="partners-category-icon-placeholder" style={{ display: 'none' }}>
                        {category.name?.[0] || 'C'}
                      </div>
                    </div>
                    <div className="partners-category-name">{category.name}</div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        ) : (
          <Empty description="Нет доступных категорий" />
        )}

        {/* Partners List */}
        {selectedCategory && (
          <>
            <Title level={3} className="partners-list-title" style={{ marginTop: 32, marginBottom: 16 }}>
              Партнеры
            </Title>
            {partnersLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : error ? (
              <Empty description="Ошибка загрузки партнеров" style={{ padding: '40px 0' }} />
            ) : filteredPartners.length === 0 ? (
              <Empty description="Партнеры не найдены" style={{ padding: '40px 0' }} />
            ) : (
              <div className="partners-list">
                {filteredPartners.map((partner: Partner) => {
                  const logoUrl = resolveAssetUrl(
                    partner.logoUrl ||
                    (partner as any).LogoUrl ||
                    (partner as any).logo ||
                    (partner as any).Logo ||
                    (partner as any).image ||
                    (partner as any).Image ||
                    (partner as any).avatarUrl ||
                    (partner as any).AvatarUrl ||
                    (partner as any).avatar ||
                    (partner as any).Avatar ||
                    (partner as any).photo ||
                    (partner as any).Photo
                  )
                  const rating = partner.rating || 0
                  const reviewCount = partner.reviewCount || 0
                  const discount = partner.discount || 0

                  return (
                    <Card
                      key={partner.id}
                      className="partner-card"
                      onClick={() => navigate(`/partners/${partner.id}`)}
                      hoverable
                    >
                      <div className="partner-card-content">
                        <div className="partner-avatar-wrapper">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={partner.name}
                              className="partner-logo-img"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const placeholder = target.nextElementSibling as HTMLElement
                                if (placeholder) placeholder.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className="partner-logo-placeholder" style={{ display: logoUrl ? 'none' : 'flex' }}>
                            <Text strong className="partner-logo-text">{partner.name?.[0] || 'P'}</Text>
                          </div>
                        </div>
                        <div className="partner-info-wrapper">
                          <div className="partner-title-row">
                            <Text strong className="partner-name">
                              {partner.name}
                            </Text>
                            {discount > 0 && (
                              <Text className="partner-discount">
                                -{discount}%
                              </Text>
                            )}
                          </div>
                          <div className="partner-rating-row">
                            <Rate disabled defaultValue={rating} allowHalf className="partner-rate" />
                            <Text className="partner-rating-text">
                              {rating.toFixed(1)} ({reviewCount} отзывов)
                            </Text>
                          </div>
                          <Text className="partner-description" ellipsis={{ tooltip: partner.description }}>
                            {partner.description || 'Партнер YESS Go'}
                          </Text>
                          {partner.cashbackPercent && (
                            <Text className="partner-cashback">
                              Кешбек до {partner.cashbackPercent}%
                            </Text>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}

        {/* Show all partners if no category selected */}
        {!selectedCategory && partners && partners.length > 0 && (
          <>
            <Title level={3} className="partners-list-title" style={{ marginTop: 32, marginBottom: 16 }}>
              Все партнеры
            </Title>
            <div className="partners-list">
              {partners
                .filter((partner: Partner) =>
                  partner.name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((partner: Partner) => {
                  const logoUrl = resolveAssetUrl(
                    partner.logoUrl ||
                    (partner as any).LogoUrl ||
                    (partner as any).logo ||
                    (partner as any).Logo ||
                    (partner as any).image ||
                    (partner as any).Image ||
                    (partner as any).avatarUrl ||
                    (partner as any).AvatarUrl ||
                    (partner as any).avatar ||
                    (partner as any).Avatar ||
                    (partner as any).photo ||
                    (partner as any).Photo
                  )
                  const rating = partner.rating || 0
                  const reviewCount = partner.reviewCount || 0
                  const discount = partner.discount || 0

                  return (
                    <Card
                      key={partner.id}
                      className="partner-card"
                      onClick={() => navigate(`/partners/${partner.id}`)}
                      hoverable
                    >
                      <div className="partner-card-content">
                        <div className="partner-avatar-wrapper">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={partner.name}
                              className="partner-logo-img"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                                const placeholder = target.nextElementSibling as HTMLElement
                                if (placeholder) placeholder.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div className="partner-logo-placeholder" style={{ display: logoUrl ? 'none' : 'flex' }}>
                            <Text strong className="partner-logo-text">{partner.name?.[0] || 'P'}</Text>
                          </div>
                        </div>
                        <div className="partner-info-wrapper">
                          <div className="partner-title-row">
                            <Text strong className="partner-name">
                              {partner.name}
                            </Text>
                            {discount > 0 && (
                              <Text className="partner-discount">
                                -{discount}%
                              </Text>
                            )}
                          </div>
                          <div className="partner-rating-row">
                            <Rate disabled defaultValue={rating} allowHalf className="partner-rate" />
                            <Text className="partner-rating-text">
                              {rating.toFixed(1)} ({reviewCount} отзывов)
                            </Text>
                          </div>
                          <Text className="partner-description" ellipsis={{ tooltip: partner.description }}>
                            {partner.description || 'Партнер YESS Go'}
                          </Text>
                          {partner.cashbackPercent && (
                            <Text className="partner-cashback">
                              Кешбек до {partner.cashbackPercent}%
                            </Text>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PartnersPage
