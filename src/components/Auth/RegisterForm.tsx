import { Form, Input, Button, message } from 'antd'
import { UserOutlined, PhoneOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { RegisterRequest } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './AuthForm.css'

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (data) => {
      // Обновляем состояние авторизации через контекст
      updateUser(data.user)
      
      message.success({
        content: 'Регистрация успешна!',
        duration: 1.5,
      })
      
      // Небольшая задержка для анимации перед переходом
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 800)
    },
    onError: (error: any) => {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        const apiUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'
        message.error(`Не удалось подключиться к серверу. Убедитесь, что Backend API запущен на ${apiUrl}`)
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data
        
        if (errorData?.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.entries(errorData.errors)
            .flatMap(([field, messages]) => {
              const msgs = Array.isArray(messages) ? messages : [messages]
              return msgs.map((msg: string) => `${field}: ${msg}`)
            })
            .filter(Boolean)
          
          if (errorMessages.length > 0) {
            message.error(errorMessages[0])
          } else {
            message.error('Ошибка валидации данных')
          }
        } else {
          const errorMsg = errorData?.title || errorData?.message || JSON.stringify(errorData) || 'Неверный формат данных'
          message.error(errorMsg)
        }
      } else {
        message.error(error.response?.data?.message || error.response?.data?.error || 'Ошибка регистрации')
      }
    },
  })

  const onFinish = (values: any) => {
    const { confirmPassword, ...registerData } = values
    mutate(registerData as RegisterRequest)
  }

  return (
    <Form
      name="register"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      className="auth-form"
    >
      <Form.Item
        label="Имя"
        name="firstName"
        rules={[{ required: true, message: 'Введите имя' }]}
      >
        <Input
          placeholder="Введите имя"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="Фамилия"
        name="lastName"
        rules={[{ required: true, message: 'Введите фамилию' }]}
      >
        <Input
          placeholder="Введите фамилию"
          size="large"
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: 'Введите E-mail' },
          { type: 'email', message: 'Неверный формат E-mail' },
        ]}
      >
        <Input
          placeholder="example@email.com"
          size="large"
          prefix={<UserOutlined />}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="Телефон"
        name="phone"
        rules={[
          { required: true, message: 'Введите номер телефона' },
          { 
            pattern: /^(\+?996|0)?[0-9]{9}$/, 
            message: 'Неверный формат телефона (например: +996551697296)' 
          },
        ]}
        normalize={(value) => value?.replace(/\s+/g, '')}
      >
        <Input
          placeholder="+996551697296"
          size="large"
          prefix={<PhoneOutlined />}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[
          { required: true, message: 'Введите пароль' },
          { min: 6, message: 'Пароль должен быть не менее 6 символов' },
        ]}
      >
        <Input.Password
          placeholder="Введите пароль"
          size="large"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="Подтвердите пароль"
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Подтвердите пароль' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Пароли не совпадают'))
            },
          }),
        ]}
      >
        <Input.Password
          placeholder="Повторите пароль"
          size="large"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={isPending}
          className="auth-primary-button"
        >
          РЕГИСТРАЦИЯ
        </Button>
      </Form.Item>

      <Form.Item style={{ marginTop: 24 }}>
        <Button
          block
          size="large"
          className="auth-google-button"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ marginRight: 8 }}>
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.96-2.184l-2.908-2.258c-.806.54-1.837.86-3.052.86-2.347 0-4.33-1.584-5.04-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.96 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.003-2.332z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.96 7.293C4.67 5.163 6.653 3.58 9 3.58z"
              />
            </svg>
          }
          onClick={(e) => {
            e.preventDefault()
            message.info('Регистрация через Google в разработке')
          }}
        >
          Продолжить с Google
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm

