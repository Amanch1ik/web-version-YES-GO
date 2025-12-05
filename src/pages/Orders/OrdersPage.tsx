import { Card, List, Tag, Typography, Empty, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services/order.service'
import { Order } from '@/types/order'

const { Title } = Typography

const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'confirmed':
        return 'blue'
      case 'pending':
        return 'orange'
      case 'cancelled':
        return 'red'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен'
      case 'confirmed':
        return 'Подтвержден'
      case 'pending':
        return 'В обработке'
      case 'cancelled':
        return 'Отменен'
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div>
      <Title level={2}>Мои заказы</Title>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      ) : error ? (
        <Empty description="Не удалось загрузить заказы" />
      ) : orders && orders.length === 0 ? (
        <Empty description="У вас пока нет заказов" />
      ) : (
        <List
          dataSource={orders}
          renderItem={(order: Order) => (
            <Card style={{ marginBottom: 16 }}>
              <List.Item>
                <List.Item.Meta
                  title={`Заказ #${order.id.slice(0, 8)}`}
                  description={
                    <div>
                      <div style={{ marginBottom: 4 }}>Партнер: {order.partnerName}</div>
                      <div>
                        Создан: {formatDate(order.createdAt)}
                      </div>
                      {order.products && order.products.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <strong>Товары:</strong>
                          <ul style={{ marginTop: 4, marginBottom: 0 }}>
                            {order.products.map((product, index) => (
                              <li key={index}>
                                {product.productName} - {product.quantity} шт. × {product.price} сом
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  }
                />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: 8, fontSize: '18px' }}>
                    <strong>{order.totalAmount} сом</strong>
                  </div>
                  <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Tag>
                </div>
              </List.Item>
            </Card>
          )}
        />
      )}
    </div>
  )
}

export default OrdersPage

