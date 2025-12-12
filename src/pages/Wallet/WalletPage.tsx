import { Card, Typography, Spin, Empty } from 'antd'
import { CheckCircleFilled } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { walletService } from '@/services/wallet.service'
import './WalletPage.css'

const { Text } = Typography

const WalletPage: React.FC = () => {
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: walletService.getBalance,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['wallet-history'],
    queryFn: () => walletService.getHistory(1, 100),
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const tasks = useMemo(() => {
    const payments = history.filter((t) => t.type === 'payment' || t.type === 'order')
    const totalPayments = payments.length
    return [
      {
        id: 1,
        title: 'Совершите хотя бы один платеж',
        current: Math.min(totalPayments, 1),
        total: 1,
      },
      {
        id: 2,
        title: 'Количество платежей от 5',
        current: Math.min(totalPayments, 5),
        total: 5,
      },
    ]
  }, [history])

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <div className="wallet-header-row">
          <Text className="wallet-header-label">У вас</Text>
          <div className="wallet-header-value">
            <span className="wallet-header-amount">
              {balanceLoading ? <Spin size="small" /> : balance?.balance?.toFixed(1) || '0.0'}
            </span>
            <img
              src="/src/Resources/Images/coin.png"
              alt="Yess!Coin"
              className="wallet-header-coin"
            />
          </div>
        </div>
        <Text className="wallet-header-subtitle">
          Начисляем Yess!coin после заказа
        </Text>
      </div>

      <Card className="wallet-levels-card animate-pop" variant="borderless">
        <div className="wallet-levels-header">
          <Text className="wallet-levels-title">Уровни</Text>
          <Text className="wallet-levels-subtitle">Bronze • Gold • Silver</Text>
        </div>
        <div className="wallet-levels-image">
          <img
            src="/src/Resources/Images/Уровни.png"
            alt="Уровни BRONZE GOLD SILVER"
          />
        </div>
      </Card>

      <Text className="wallet-tasks-title">Задания</Text>

      <div className="wallet-tasks-list animate-fade">
        {historyLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
            <Spin />
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => {
            const progress = Math.min(task.current / task.total, 1)
            const isDone = progress >= 1
            return (
              <Card key={task.id} className="wallet-task-card" variant="borderless">
                <div className="wallet-task-content">
                  <div className="wallet-task-icon">
                    <img
                      src="/src/Resources/Images/coin.png"
                      alt="task"
                    />
                  </div>
                  <div className="wallet-task-main">
                    <Text className="wallet-task-title">{task.title}</Text>
                    <div className="wallet-task-progress">
                      <div className="wallet-task-progress-bar">
                        <div
                          className="wallet-task-progress-inner"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={`wallet-task-status ${isDone ? 'done' : ''}`}>
                    <CheckCircleFilled />
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Empty description="Нет заданий" />
        )}
      </div>
    </div>
  )
}

export default WalletPage
