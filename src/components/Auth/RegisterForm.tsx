import { useState } from 'react'
import { Form, Input, Button, message, Divider } from 'antd'
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
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (data) => {
      try {
        // authService.register уже сохраняет токен и пользователя
        // Проверяем, что данные сохранены
        const savedToken = localStorage.getItem('yess_token')
        const savedUser = localStorage.getItem('yess_user')
        
        if (!savedToken || !savedUser) {
          message.error('Ошибка сохранения данных авторизации')
          return
        }
        
        updateUser(data.user)
        
        message.success({
          content: 'Регистрация успешна!',
          duration: 1.5,
        })
        
        setTimeout(() => {
          const finalToken = localStorage.getItem('yess_token')
          const finalUser = localStorage.getItem('yess_user')
          
          if (finalToken && finalUser) {
            navigate('/', { replace: true })
          } else {
            message.error('Ошибка: данные авторизации не найдены')
          }
        }, 800)
      } catch (error) {
        console.error('Register error:', error)
        message.error('Ошибка при регистрации')
      }
    },
    onError: (error: any) => {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        const apiUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.yessgo.org'
        message.error({
          content: `Не удалось подключиться к серверу. Убедитесь, что Backend API запущен на ${apiUrl}`,
          duration: 5,
        })
      } else if (error.response?.status === 502 || error.response?.status === 503 || error.response?.status === 504) {
        message.error('Сервер временно недоступен. Попробуйте позже.')
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data
        // Логируем детали ошибки для отладки
        console.error('Registration error details:', errorData)
        if (errorData?.errors) {
          console.error('Validation errors:', JSON.stringify(errorData.errors, null, 2))
        }
        
        if (errorData?.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.entries(errorData.errors)
            .flatMap(([field, messages]) => {
              const msgs = Array.isArray(messages) ? messages : [messages]
              // Преобразуем название поля в читаемый формат
              const fieldName = field === 'FirstName' || field === 'firstName' ? 'Имя' : 
                               field === 'LastName' || field === 'lastName' ? 'Фамилия' :
                               field === 'Email' || field === 'email' ? 'Email' :
                               field === 'PhoneNumber' || field === 'phone' ? 'Телефон' :
                               field === 'Password' || field === 'password' ? 'Пароль' : field
              return msgs.map((msg: string) => `${fieldName}: ${msg}`)
            })
            .filter(Boolean)
          if (errorMessages.length > 0) {
            message.error({
              content: errorMessages.join(' | '),
              duration: 5,
            })
          } else {
            message.error('Ошибка валидации данных')
          }
        } else if (errorData?.message) {
          message.error({
            content: errorData.message,
            duration: 5,
          })
        } else if (errorData?.title) {
          message.error({
            content: errorData.title,
            duration: 5,
          })
        } else {
          // Показываем весь объект ошибки для отладки
          const errorString = typeof errorData === 'string' ? errorData : JSON.stringify(errorData)
          message.error({
            content: `Ошибка регистрации: ${errorString || 'Неверный формат данных'}`,
            duration: 5,
          })
        }
      } else if (error.response?.status === 409) {
        message.error('Пользователь с таким телефоном или email уже существует')
      } else if (error.response?.status === 404) {
        message.error('Сервис регистрации недоступен')
      } else if (error.response?.status >= 500) {
        message.error('Ошибка сервера. Попробуйте позже')
      } else {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Ошибка регистрации'
        message.error(errorMsg)
      }
    },
  })

  const onFinish = (values: any) => {
    const { confirmPassword, ...registerData } = values
    mutate(registerData as RegisterRequest)
  }

  const handleGoogleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setSocialLoading('google')
    
    try {
      // Переход на страницу авторизации Google через бэкенд
      const authUrl = authService.getGoogleAuthUrl()
      window.location.href = authUrl
    } catch (error: any) {
      message.error(error.message || 'Ошибка регистрации через Google')
      setSocialLoading(null)
    }
  }

  const handleAppleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setSocialLoading('apple')
    
    try {
      // Переход на страницу авторизации Apple через бэкенд
      const authUrl = authService.getAppleAuthUrl()
      window.location.href = authUrl
    } catch (error: any) {
      message.error(error.message || 'Ошибка регистрации через Apple')
      setSocialLoading(null)
    }
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
            pattern: /^(\+996|996|0)?[0-9]{9}$/, 
            message: 'Неверный формат телефона. Пример: +996507700007 или 0507700007' 
          },
        ]}
        normalize={(value) => {
          if (!value) return value
          // Убираем все пробелы, дефисы и другие символы, оставляем только цифры и +
          return value.replace(/[^\d+]/g, '')
        }}
      >
        <Input
          placeholder="+996507700007 или 0507700007"
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

      <Divider className="auth-divider">или</Divider>

      <Form.Item style={{ marginBottom: 12 }}>
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
          onClick={handleGoogleRegister}
          loading={socialLoading === 'google'}
          disabled={isPending || socialLoading !== null}
        >
          Продолжить с Google
        </Button>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Button
          block
          size="large"
          className="auth-apple-button"
          icon={
            <img
              src="/src/Resources/Images/image 281.png"
              alt="Apple"
              style={{ width: 18, height: 18, marginRight: 8 }}
            />
          }
          onClick={handleAppleRegister}
          loading={socialLoading === 'apple'}
          disabled={isPending || socialLoading !== null}
        >
          Продолжить с Apple
        </Button>
      </Form.Item>
    </Form>
  )
}

export default RegisterForm
