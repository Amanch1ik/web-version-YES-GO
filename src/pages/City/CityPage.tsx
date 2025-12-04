import { useState } from 'react'
import { Card, Input, Typography, List, Avatar, message } from 'antd'
import { ArrowLeftOutlined, EnvironmentOutlined, SendOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './CityPage.css'

const { Title, Text } = Typography

const CityPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedCity, setSelectedCity] = useState('Бишкек')

  const cities = [
    { id: 1, name: 'Бишкек', region: 'Чуйская область' },
    { id: 2, name: 'Ош', region: 'Ошская область' },
    { id: 3, name: 'Джалал-Абад', region: 'Джалал-Абадская область' },
    { id: 4, name: 'Каракол', region: 'Иссык-Кульская область' },
    { id: 5, name: 'Токмок', region: 'Чуйская область' },
    { id: 6, name: 'Узген', region: 'Ошская область' },
    { id: 7, name: 'Балыкчи', region: 'Иссык-Кульская область' },
    { id: 8, name: 'Кара-Балта', region: 'Чуйская область' },
  ]

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    city.region.toLowerCase().includes(searchValue.toLowerCase())
  )

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName)
    message.success(`Город изменен на ${cityName}`)
    setTimeout(() => navigate(-1), 1000)
  }

  return (
    <div className="city-page">
      <div className="city-header">
        <ArrowLeftOutlined
          className="city-back-button"
          onClick={() => navigate(-1)}
        />
        <Input
          size="large"
          placeholder="Поиск"
          prefix={<SearchOutlined style={{ color: '#52c41a' }} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="city-search-input"
        />
      </div>

      <Card className="city-location-card">
        <div className="city-location-item">
          <SendOutlined className="city-location-icon" />
          <div className="city-location-content">
            <Title level={5} className="city-location-title">
              Мое местоположение
            </Title>
            <Text className="city-location-subtitle">
              Определить мое местоположение автоматически
            </Text>
          </div>
        </div>
      </Card>

      <Card className="city-current-card">
        <div className="city-location-item">
          <EnvironmentOutlined className="city-pin-icon" />
          <div className="city-location-content">
            <Title level={5} className="city-location-title">
              Мой город
            </Title>
            <Text className="city-location-subtitle">{selectedCity}</Text>
          </div>
        </div>
      </Card>

      {searchValue && (
        <Card className="city-list-card">
          <List
            dataSource={filteredCities}
            renderItem={(city) => (
              <List.Item
                className="city-list-item"
                onClick={() => handleCitySelect(city.name)}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<EnvironmentOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                  title={city.name}
                  description={city.region}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  )
}

export default CityPage

