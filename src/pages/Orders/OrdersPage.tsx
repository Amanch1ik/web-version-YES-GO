import { Card, Typography, Button, Empty, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { orderService } from '@/services/order.service'
import './OrdersPage.css'

const { Title, Text } = Typography

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
    retry: 1,
  })

  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <Title level={3} className="cart-title">Корзина</Title>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      </div>
    )
  }

  if (error || !orders || orders.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <Title level={3} className="cart-title">Корзина</Title>
        </div>
        <Empty 
          description="Корзина пуста" 
          style={{ padding: '48px' }}
        >
          <Button type="primary" onClick={() => navigate('/partners')}>
            Перейти к покупкам
          </Button>
        </Empty>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <Title level={3} className="cart-title">Корзина</Title>
      </div>

      <div className="cart-list">
        {orders.map((order) => (
          <Card key={order.id} className="cart-partner-card" variant="borderless">
            <div className="cart-partner-header">
              <div className="cart-partner-name">{order.partnerName || 'Партнёр'}</div>
            </div>

            {order.products?.map((product, idx) => (
              <div key={idx} className="cart-item">
                <div className="cart-item-body">
                  <Text className="cart-item-title">{product.productName || 'Товар'}</Text>
                  <div className="cart-item-footer">
                    <div className="cart-price-line">
                      <span className="cart-main-price">
                        {product.price?.toLocaleString()} сом x {product.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="cart-partner-total">
              Итого: {order.totalAmount?.toLocaleString()} сом
              {order.coinsUsed ? ` + ${order.coinsUsed} Yess!Coins` : ''}
            </div>

            <div className="cart-partner-actions">
              <Button 
                type="primary" 
                className="cart-go-order-btn"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                Подробнее
              </Button>
              <div className="cart-status-info">
                {order.status === 'pending' && 'Ожидает'}
                {order.status === 'processing' && 'В обработке'}
                {order.status === 'completed' && 'Завершён'}
                {order.status === 'cancelled' && 'Отменён'}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
