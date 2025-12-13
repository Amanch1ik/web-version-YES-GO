import { Card, Typography, Button, Empty, List, Divider } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'

const { Title, Text } = Typography

interface CartItem {
  id: string | number
  name: string
  price: number
  originalPrice?: number
  image?: string
  quantity: number
  partnerId?: string | number
  partnerName?: string
}

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  
  // TODO: Получить реальные данные корзины из API
  const cartItems: CartItem[] = []
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleQuantityChange = (itemId: string | number, delta: number) => {
    // TODO: Обновить количество товара в корзине через API
    console.log('Change quantity:', itemId, delta)
  }

  const handleRemoveItem = (itemId: string | number) => {
    // TODO: Удалить товар из корзины через API
    console.log('Remove item:', itemId)
  }

  const handleCheckout = () => {
    // TODO: Переход к оформлению заказа
    navigate('/checkout')
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={2} className="cart-title">
          Корзина
        </Title>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <Empty 
            description="Корзина пуста"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/partners')}>
              Перейти к партнерам
            </Button>
          </Empty>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item className="cart-item">
                  <Card className="cart-item-card">
                    <div className="cart-item-content">
                      <div className="cart-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="cart-item-placeholder">
                            {item.name?.[0] || 'P'}
                          </div>
                        )}
                      </div>
                      <div className="cart-item-info">
                        <Text strong className="cart-item-name">
                          {item.name}
                        </Text>
                        {item.partnerName && (
                          <Text className="cart-item-partner">
                            {item.partnerName}
                          </Text>
                        )}
                        <div className="cart-item-price-row">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <Text delete className="cart-item-original-price">
                              {item.originalPrice.toLocaleString()} сом
                            </Text>
                          )}
                          <Text className="cart-item-price">
                            {item.price.toLocaleString()} сом
                          </Text>
                        </div>
                        <div className="cart-item-actions">
                          <Button
                            icon={<MinusOutlined />}
                            size="small"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          />
                          <Text className="cart-item-quantity">{item.quantity}</Text>
                          <Button
                            icon={<PlusOutlined />}
                            size="small"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            className="cart-item-delete"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>

          <Divider />

          <Card className="cart-summary">
            <div className="cart-summary-row">
              <Text className="cart-summary-label">Итого:</Text>
              <Text strong className="cart-summary-total">
                {total.toLocaleString()} сом
              </Text>
            </div>
            <Button 
              type="primary" 
              size="large" 
              block
              className="cart-checkout-button"
              onClick={handleCheckout}
            >
              Оформить заказ
            </Button>
          </Card>
        </>
      )}
    </div>
  )
}

export default CartPage

