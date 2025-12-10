import { useEffect, useState } from 'react'
import { Card, Typography, Button, Result, Spin } from 'antd'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { finikService } from '@/services/finik.service'
import { FinikPaymentStatus } from '@/types/finik'
import './FinikSuccessPage.css'

const { Text } = Typography

const FinikSuccessPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<FinikPaymentStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  const paymentId = searchParams.get('paymentId') || searchParams.get('payment_id')
  const orderId = searchParams.get('orderId') || searchParams.get('order_id')
  const status = searchParams.get('status')

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus()
    } else if (status === 'success') {
      setPaymentStatus({
        paymentId: orderId || 'unknown',
        status: 'success',
        amount: 0,
        currency: 'KGS',
        orderId: orderId || '',
        createdAt: new Date().toISOString(),
      })
      setLoading(false)
    } else {
      setError('Параметры платежа не найдены')
      setLoading(false)
    }
  }, [paymentId, status])

  const checkPaymentStatus = async () => {
    if (!paymentId) return

    setLoading(true)
    try {
      const status = await finikService.checkPaymentStatus(paymentId)
      setPaymentStatus(status)
    } catch (error: any) {
      setError('Не удалось проверить статус платежа')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="finik-success-page">
        <Card className="finik-success-card">
          <div className="finik-success-loading">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            <Text style={{ marginTop: 16, display: 'block' }}>Проверка статуса платежа...</Text>
          </div>
        </Card>
      </div>
    )
  }

  if (error || paymentStatus?.status === 'failed' || paymentStatus?.status === 'cancelled') {
    return (
      <div className="finik-success-page">
        <Card className="finik-success-card">
          <Result
            status="error"
            title="Ошибка оплаты"
            subTitle={error || 'Платеж не был завершен. Попробуйте еще раз.'}
            extra={[
              <Button type="primary" key="retry" onClick={() => navigate('/wallet/topup')}>
                Попробовать снова
              </Button>,
              <Button key="wallet" onClick={() => navigate('/wallet')}>
                Вернуться в кошелек
              </Button>,
            ]}
          />
        </Card>
      </div>
    )
  }

  if (paymentStatus?.status === 'success') {
    return (
      <div className="finik-success-page">
        <Card className="finik-success-card">
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="Оплата успешно завершена!"
            subTitle={`Ваш кошелек пополнен на сумму ${paymentStatus.amount} ${paymentStatus.currency}`}
            extra={[
              <Button type="primary" key="wallet" onClick={() => navigate('/wallet')}>
                Перейти в кошелек
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                На главную
              </Button>,
            ]}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="finik-success-page">
      <Card className="finik-success-card">
        <Result
          status="info"
          title="Обработка платежа"
          subTitle="Ваш платеж обрабатывается. Пожалуйста, подождите..."
          extra={[
            <Button type="primary" key="check" onClick={checkPaymentStatus} loading={loading}>
              Проверить статус
            </Button>,
            <Button key="wallet" onClick={() => navigate('/wallet')}>
              Вернуться в кошелек
            </Button>,
          ]}
        />
      </Card>
    </div>
  )
}

export default FinikSuccessPage

