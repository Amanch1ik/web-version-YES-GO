import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '@/services/auth.service'
import './AuthPage.css'

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [sending, setSending] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const sendCode = async (phone: string) => {
    setSending(true)
    try {
      await authService.sendCode({ phone, type: 'reset' })
      message.success('Код отправлен')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Не удалось отправить код')
    } finally {
      setSending(false)
    }
  }

  const onFinish = async (values: { phone: string; code: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('Пароли не совпадают')
      return
    }
    setSubmitting(true)
    try {
      await authService.resetPassword({
        phone: values.phone,
        code: values.code,
        password: values.password,
      })
      message.success('Пароль изменён, войдите заново')
      navigate('/login')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Не удалось изменить пароль')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className="auth-tab active">СБРОС ПАРОЛЯ</button>
        </div>
        <div className="auth-content">
          <Form layout="vertical" onFinish={onFinish} autoComplete="off">
            <Form.Item
              label="Телефон"
              name="phone"
              rules={[{ required: true, message: 'Введите телефон' }]}
            >
              <Input placeholder="+996..." size="large" />
            </Form.Item>

            <Form.Item
              label="Код из SMS"
              name="code"
              rules={[{ required: true, message: 'Введите код' }]}
              extra={
                <Button type="link" onClick={() => {
                  const phone = (document.querySelector('input[name=\"phone\"]') as HTMLInputElement)?.value
                  if (!phone) { message.warning('Введите телефон'); return }
                  sendCode(phone)
                }} loading={sending}>
                  Отправить код
                </Button>
              }
            >
              <Input placeholder="Код" size="large" />
            </Form.Item>

            <Form.Item
              label="Новый пароль"
              name="password"
              rules={[{ required: true, message: 'Введите новый пароль' }, { min: 6, message: 'Не менее 6 символов' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="Подтвердите пароль"
              name="confirmPassword"
              dependencies={['password']}
              rules={[{ required: true, message: 'Подтвердите пароль' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={submitting}
              className="auth-primary-button"
            >
              Сменить пароль
            </Button>

            <Button
              type="link"
              block
              onClick={() => navigate('/login')}
              style={{ marginTop: 8 }}
            >
              Вернуться к входу
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

