import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Card, List, Typography, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner } from '@/types/partner'
import { resolveAssetUrl } from '@/utils/assets'
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
                    {partner.logoUrl || (partner as any).LogoUrl || (partner as any).logo || (partner as any).Logo || (partner as any).image || (partner as any).Image || partner.avatarUrl || (partner as any).avatar || (partner as any).Avatar || (partner as any).photo || (partner as any).Photo ? (
                      <img
                        src={resolveAssetUrl(
                          partner.logoUrl ||
                          (partner as any).LogoUrl ||
                          (partner as any).logo ||
                          (partner as any).Logo ||
                          (partner as any).image ||
                          (partner as any).Image ||
                          partner.avatarUrl ||
                          (partner as any).avatar ||
                          (partner as any).Avatar ||
                          (partner as any).photo ||
                          (partner as any).Photo
                        )}
                        alt={partner.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Text strong>{partner.name?.[0] || 'P'}</Text>
                    )}
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
