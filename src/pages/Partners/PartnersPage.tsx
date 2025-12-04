import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Card, List, Avatar, Typography, Button, Space, Badge } from 'antd'
import { SearchOutlined, MenuOutlined, ShoppingCartOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { partnerService } from '@/services/partner.service'
import { Partner } from '@/types/partner'
import './PartnersPage.css'

const { Text } = Typography

const PartnersPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Красота')

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: partnerService.getPartners,
  })

  const categories = ['Красота', 'Еда и напитки', 'Продукты']

  // Моковые данные для процентов (в реальном приложении будут приходить с API)
  const getCashbackPercent = (partnerId: string) => {
    const percents: { [key: string]: number } = {
      '1': 10,
      '2': 8,
      '3': 1,
    }
    return percents[partnerId] || Math.floor(Math.random() * 10) + 1
  }

  const getPartnerIcon = (partnerName: string) => {
    // Простая логика для иконок
    if (partnerName.includes('Фармамир')) return '💎'
    if (partnerName.includes('Кофе')) return '☕'
    if (partnerName.includes('Салон')) return '💅'
    if (partnerName.includes('Элдик')) return '🛍️'
    return '🏪'
  }

  const filteredPartners = partners?.filter((partner: Partner) =>
    partner.name.toLowerCase().includes(searchValue.toLowerCase())
  ) || []

  return (
    <div className="partners-page">
      {/* Header with Search */}
      <div className="partners-header">
        <MenuOutlined className="partners-menu-icon" />
        <Input
          size="large"
          placeholder="Поиск"
          prefix={<SearchOutlined style={{ color: '#52c41a' }} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="partners-search-input"
        />
        <Space>
          <Badge count={0} showZero={false}>
            <ShoppingCartOutlined className="partners-cart-icon" />
          </Badge>
          <EnvironmentOutlined className="partners-location-icon" />
        </Space>
      </div>

      {/* Category Filters */}
      <div className="partners-categories">
        {categories.map((category) => (
          <Button
            key={category}
            className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Partners List */}
      <Card className="partners-list-card">
        <List
          loading={isLoading}
          dataSource={filteredPartners}
          renderItem={(partner: Partner) => (
            <List.Item 
              className="partner-item"
              onClick={() => navigate(`/partners/${partner.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    style={{ backgroundColor: '#52c41a' }}
                    icon={<span style={{ fontSize: 24 }}>{getPartnerIcon(partner.name)}</span>}
                  />
                }
                title={
                  <div className="partner-title-row">
                    <Text strong className="partner-name">
                      {partner.name}
                    </Text>
                    <Text className="partner-cashback">
                      до {getCashbackPercent(partner.id)}%
                    </Text>
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
