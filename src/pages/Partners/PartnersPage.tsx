import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Card, List, Typography, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner } from '@/types/partner'
import './PartnersPage.css'

const { Text } = Typography

const PartnersPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const categoryFilters = [
    { key: 'beauty', label: 'Красота' },
    { key: 'food', label: 'Еда и напитки' },
    { key: 'products', label: 'Продукты' },
  ]

  const { data: partners, isLoading, error } = useQuery({
    queryKey: ['partners'],
    queryFn: partnerService.getPartners,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const getPartnerIcon = (partnerName: string) => {
    // Логика для иконок партнеров
    const name = partnerName.toLowerCase()
    if (name.includes('фармамир') || name.includes('аптека') || name.includes('медицин')) {
      return <img src="/src/Resources/Images/category_products.png" alt="Shop" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    }
    if (name.includes('кофе') || name.includes('кафе') || name.includes('ресторан')) {
      return <img src="/src/Resources/Images/category_cafe.png" alt="Cafe" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    }
    if (name.includes('салон') || name.includes('красота') || name.includes('косметик')) {
      return <img src="/src/Resources/Images/cat_beauty.png" alt="Beauty" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    }
    if (name.includes('элдик') || name.includes('электроник') || name.includes('техник')) {
      return <img src="/src/Resources/Images/cat_electronics.png" alt="Electronics" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    }
    if (name.includes('одежд') || name.includes('магазин')) {
      return <img src="/src/Resources/Images/cat_clothes.png" alt="Clothes" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    }
    return <img src="/src/Resources/Images/cat_all.png" alt="Shop" style={{ width: 28, height: 28, objectFit: 'contain' }} />
  }

  const filteredPartners =
    partners
      ?.filter((partner: Partner) =>
        partner.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .filter((partner: Partner) => {
        if (!activeFilter) return true
        const category = partner.category?.toLowerCase() || ''
        const name = partner.name.toLowerCase()

        if (activeFilter === 'beauty') {
          return (
            category.includes('красот') ||
            name.includes('салон') ||
            name.includes('красот')
          )
        }
        if (activeFilter === 'food') {
          return (
            category.includes('еда') ||
            category.includes('кафе') ||
            category.includes('ресторан') ||
            name.includes('кафе') ||
            name.includes('кофе')
          )
        }
        if (activeFilter === 'products') {
          return (
            category.includes('продукт') ||
            category.includes('супермаркет') ||
            name.includes('супермаркет')
          )
        }
        return true
      }) || []

  return (
    <div className="partners-page">
      {/* Search & filters block */}
      <div className="partners-search-panel">
        <div className="partners-search-row">
          <Input
            size="large"
            placeholder="Поиск"
            prefix={(
              <img
                src="/src/Resources/Images/search.png"
                alt="Поиск"
                className="partners-search-icon"
              />
            )}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="partners-search-input"
          />
        </div>

        <div className="partners-filters-row">
          <button
            type="button"
            className="partners-menu-button"
            onClick={() => navigate('/categories')}
          >
            <img
              src="/src/Resources/Images/map_category_icon.png"
              alt="Категории"
            />
          </button>

          <div className="partners-filters">
            {categoryFilters.map((filter) => (
              <Button
                key={filter.key}
                size="small"
                className={`partners-filter-chip ${
                  activeFilter === filter.key ? 'active' : ''
                }`}
                onClick={() =>
                  setActiveFilter((prev) =>
                    prev === filter.key ? null : filter.key
                  )
                }
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Partners List */}
      <Card className="partners-list-card">
        <List
          loading={isLoading}
          dataSource={error ? [] : filteredPartners}
          renderItem={(partner: Partner) => (
            <List.Item 
              className="partner-item"
              onClick={() => navigate(`/partners/${partner.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ 
                    width: 48, 
                    height: 48, 
                    borderRadius: '50%', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    background: 'linear-gradient(135deg, #f0f9e8 0%, #e6f7d9 100%)',
                    border: '2px solid #52c41a',
                    transition: 'all 0.3s ease'
                  }}>
                    {getPartnerIcon(partner.name)}
                  </div>
                }
                title={
                  <div className="partner-title-row">
                    <Text strong className="partner-name">
                      {partner.name}
                    </Text>
                    {partner.cashbackPercent && (
                      <Text className="partner-cashback">
                        до {partner.cashbackPercent}%
                      </Text>
                    )}
                  </div>
                }
                description={
                  <Text className="partner-description">
                    {partner.description || 'Партнер YESS Go'}
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default PartnersPage
