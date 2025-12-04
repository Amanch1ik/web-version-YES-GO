import { Card, Typography, Button, Row, Col, List, Avatar, Empty, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { walletService } from '@/services/wallet.service'
import { Transaction } from '@/types/wallet'
import './WalletPage.css'

const { Title, Text } = Typography

const WalletPage: React.FC = () => {
  const navigate = useNavigate()
  const { data: balance } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
  })

  const { data: transactions } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: walletService.getTransactions,
  })

  // Группируем транзакции по датам
  const groupedTransactions = transactions?.reduce((acc: any, transaction: Transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(transaction)
    return acc
  }, {}) || {}

  const getTransactionIcon = (description: string) => {
    if (description.includes('Фармамир')) return '💎'
    if (description.includes('Кофе')) return '☕'
    if (description.includes('Салон')) return '💅'
    if (description.includes('Элдик')) return '🛍️'
    if (description.includes('Продукты')) return '🛒'
    return '🏪'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
    }
  }

  return (
    <div className="wallet-page">
      {/* Top Cards */}
      <Row gutter={12} className="wallet-top-cards">
        <Col xs={8}>
          <Card className="wallet-balance-card">
            <div className="wallet-coin-icon">🪙</div>
            <Title level={2} className="wallet-balance-amount">
              {balance?.balance || 55.7}
            </Title>
            <Button className="wallet-coin-button" size="small">
              Yess!Coin
            </Button>
          </Card>
        </Col>
        <Col xs={8}>
          <Card className="wallet-level-card">
            <div className="wallet-level-icon">🛡️</div>
            <Text className="wallet-level-name">Бронза</Text>
            <div className="wallet-levels-row">
              <span className="wallet-level-badge bronze">BRONZE</span>
              <span className="wallet-level-badge gold">GOLD</span>
              <span className="wallet-level-badge silver">SILVER</span>
            </div>
            <Text className="wallet-levels-label">Уровни</Text>
          </Card>
        </Col>
        <Col xs={8}>
          <Card className="wallet-info-card">
            <Title level={5} className="wallet-info-title">
              Что такое Yess!coin
            </Title>
            <Button
              className="wallet-info-button"
              size="small"
              onClick={() => message.info('Информация о Yess!Coin')}
            >
              Посмотреть
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Top Up Button */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="wallet-topup-button"
        block
        onClick={() => navigate('/wallet/topup')}
      >
        Пополнить
      </Button>

      {/* History Section */}
      <div className="wallet-history-section">
        <Title level={4} className="wallet-history-title">
          История покупок
        </Title>

        {transactions && transactions.length === 0 ? (
          <Empty description="Нет транзакций" />
        ) : (
          <div className="wallet-transactions">
            {Object.entries(groupedTransactions).map(([date, dateTransactions]: [string, any]) => (
              <div key={date} className="wallet-date-group">
                <Text className="wallet-date-label">{formatDate(dateTransactions[0].createdAt)}</Text>
                <List
                  dataSource={dateTransactions}
                  renderItem={(transaction: Transaction) => (
                    <Card className="wallet-transaction-card">
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={40}
                              style={{ backgroundColor: '#f0f9e8' }}
                              icon={<span style={{ fontSize: 20 }}>{getTransactionIcon(transaction.description)}</span>}
                            />
                          }
                          title={
                            <div className="wallet-transaction-title-row">
                              <Text strong>{transaction.description}</Text>
                              <Text className="wallet-transaction-amount">
                                {transaction.amount} Y
                              </Text>
                            </div>
                          }
                          description={
                            <Text className="wallet-transaction-type">Начисление бонусов</Text>
                          }
                        />
                      </List.Item>
                    </Card>
                  )}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WalletPage
