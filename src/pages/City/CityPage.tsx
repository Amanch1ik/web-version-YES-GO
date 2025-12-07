import { useState } from 'react'
import { Card, Input, Typography, List, Avatar, message, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './CityPage.css'

const { Title, Text } = Typography

const CityPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [selectedCity, setSelectedCity] = useState('Бишкек')
  const [detectingLocation, setDetectingLocation] = useState(false)

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
    // Сохраняем выбранный город в localStorage
    localStorage.setItem('selectedCity', cityName)
    message.success(`Город изменен на ${cityName}`)
    setTimeout(() => navigate(-1), 1000)
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      message.error('Геолокация не поддерживается вашим браузером')
      return
    }

    setDetectingLocation(true)
    message.loading('Определение местоположения...', 0)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Используем обратный геокодинг для определения города
          // В реальном приложении здесь будет вызов API для определения города по координатам
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          )
          const data = await response.json()
          
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.municipality
            if (city) {
              // Проверяем, есть ли этот город в списке
              const foundCity = cities.find(c => 
                c.name.toLowerCase().includes(city.toLowerCase()) || 
                city.toLowerCase().includes(c.name.toLowerCase())
              )
              
              if (foundCity) {
                handleCitySelect(foundCity.name)
              } else {
                message.success(`Определен город: ${city}`)
                setSelectedCity(city)
                localStorage.setItem('selectedCity', city)
                setTimeout(() => navigate(-1), 2000)
              }
            } else {
              message.info('Не удалось определить город по координатам')
            }
          } else {
            message.info('Не удалось определить местоположение')
          }
        } catch (error) {
          message.error('Ошибка при определении местоположения')
          console.error('Geocoding error:', error)
        } finally {
          setDetectingLocation(false)
          message.destroy()
        }
      },
      (error) => {
        setDetectingLocation(false)
        message.destroy()
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message.error('Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.')
            break
          case error.POSITION_UNAVAILABLE:
            message.error('Информация о местоположении недоступна')
            break
          case error.TIMEOUT:
            message.error('Превышено время ожидания определения местоположения')
            break
          default:
            message.error('Произошла ошибка при определении местоположения')
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="city-page">
      <div className="city-header">
        <button
          type="button"
          className="city-back-button"
          onClick={() => navigate(-1)}
        >
          <img src="/src/Resources/Images/icon-park-solid_back.png" alt="Назад" />
        </button>
        <Input
          size="large"
          placeholder="Поиск"
          prefix={<SearchOutlined style={{ color: '#52c41a' }} />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="city-search-input"
        />
      </div>

      <Card 
        className="city-location-card" 
        onClick={handleDetectLocation}
        style={{ cursor: 'pointer' }}
      >
        <div className="city-location-item">
          {detectingLocation ? (
            <Spin size="small" style={{ marginRight: 16 }} />
          ) : (
            <img
              src="/src/Resources/Images/bi_geo-alt-fill.png"
              alt="Мое местоположение"
              className="city-location-icon"
            />
          )}
          <div className="city-location-content">
            <Title level={5} className="city-location-title">
              Мое местоположение
            </Title>
            <Text className="city-location-subtitle">
              {detectingLocation ? 'Определение местоположения...' : 'Определить мое местоположение автоматически'}
            </Text>
          </div>
        </div>
      </Card>

      <Card className="city-current-card">
        <div className="city-location-item">
          <img
            src="/src/Resources/Images/tabler_location-filled.png"
            alt="Город"
            className="city-pin-icon"
          />
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
                  avatar={
                    <Avatar 
                      icon={<img src="/src/Resources/Images/icon_location.png" alt="Location" style={{ width: 20, height: 20 }} />} 
                      style={{ backgroundColor: '#52c41a' }} 
                    />
                  }
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

