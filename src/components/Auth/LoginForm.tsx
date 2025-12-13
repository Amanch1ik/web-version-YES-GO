import { useState } from 'react'
import { Form, Input, Button, Checkbox, message, Divider } from 'antd'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone, MailOutlined, ReloadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { LoginRequest, User } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './AuthForm.css'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null)
  const [resetLoading, setResetLoading] = useState(false)
  const isDevMode = (import.meta as any)?.env?.VITE_DEV_MODE === 'true'

  const devLogin = () => {
    const mockUser: User = {
      id: 'dev-user',
      phone: '+000000000',
      email: 'dev@yessgo.org',
      firstName: 'Dev',
      lastName: 'User',
      fullName: 'Dev User',
      isActive: true,
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    import('@/utils/storage').then(({ setToken, setUser }) => {
      setToken('dev-token')
      setUser(mockUser)
      updateUser(mockUser)
      message.success('Dev вход активирован')
      navigate('/', { replace: true })
    })
  }
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data) => {
      try {
        if (import.meta.env.DEV) {
          console.log('Login onSuccess - received data:', {
            hasToken: !!data.token,
            hasUser: !!data.user,
            userId: data.user?.id
          })
        }
        
        // authService.login уже сохранил токен и пользователя
        // Проверяем, что данные сохранены
        const savedToken = localStorage.getItem('yess_token')
        const savedUser = localStorage.getItem('yess_user')
        
        if (import.meta.env.DEV) {
          let parsedUser = null
          if (savedUser && savedUser !== 'undefined') {
            try {
              parsedUser = JSON.parse(savedUser)
            } catch (e) {
              console.error('Error parsing saved user:', e, 'savedUser:', savedUser)
            }
          }
          console.log('Login onSuccess - checking saved data:', {
            hasToken: !!savedToken,
            hasUser: !!savedUser,
            savedUserValue: savedUser,
            tokenLength: savedToken?.length || 0,
            userData: parsedUser
          })
        }
        
        if (!savedToken || !savedUser || savedUser === 'undefined') {
          message.error('Ошибка сохранения данных авторизации')
          return
        }
        
        // Обновляем пользователя в контексте (используем данные из ответа API)
        if (data.user) {
          updateUser(data.user)
        }
        
        message.success({
          content: 'Успешный вход!',
          duration: 1.5,
        })
        
        // Даем время для обновления состояния и затем перенаправляем
        setTimeout(() => {
          const finalToken = localStorage.getItem('yess_token')
          const finalUser = localStorage.getItem('yess_user')
          
          if (import.meta.env.DEV) {
            console.log('Redirecting to home page...', {
              hasToken: !!finalToken,
              hasUser: !!finalUser,
              finalUserValue: finalUser
            })
          }
          
          if (finalToken && finalUser && finalUser !== 'undefined') {
            navigate('/', { replace: true })
          } else {
            console.error('Auth data missing before redirect', {
              token: finalToken,
              user: finalUser
            })
            message.error('Ошибка: данные авторизации не найдены')
          }
        }, 500)
      } catch (error) {
        console.error('Login onSuccess error:', error)
        message.error('Ошибка при входе в систему')
      }
    },
    onError: (error: any) => {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        const apiUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.yessgo.org'
        message.error({
          content: `Не удалось подключиться к серверу. Убедитесь, что Backend API запущен на ${apiUrl}`,
          duration: 5,
        })
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data
        // Логируем детали ошибки для отладки
        console.error('Login error details:', errorData)
        if (errorData?.errors) {
          console.error('Validation errors:', JSON.stringify(errorData.errors, null, 2))
        }
        
        if (errorData?.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.entries(errorData.errors)
            .flatMap(([field, messages]) => {
              const msgs = Array.isArray(messages) ? messages : [messages]
              // Преобразуем название поля в читаемый формат
              const fieldName = field === 'Email' || field === 'email' ? 'Email' :
                               field === 'Phone' || field === 'PhoneNumber' || field === 'phone' ? 'Телефон' :
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
          const errorString = typeof errorData === 'string' ? errorData : JSON.stringify(errorData)
          message.error({
            content: `Ошибка входа: ${errorString || 'Неверный формат данных'}`,
            duration: 5,
          })
        }
      } else if (error.response?.status === 401) {
        message.error('Неверный телефон/email или пароль')
      } else if (error.response?.status === 404) {
        message.error('Пользователь не найден')
      } else if (error.response?.status >= 500) {
        message.error('Ошибка сервера. Попробуйте позже')
      } else {
        message.error(error.response?.data?.message || error.response?.data?.error || error.message || 'Ошибка входа')
      }
    },
  })

  const onFinish = (values: LoginRequest & { remember?: boolean }) => {
    const { remember, ...loginData } = values

    if (isDevMode && loginData.phone === '0000') {
      devLogin()
      return
    }

    mutate(loginData)
  }

  const handleResetPassword = async (phoneOrEmail?: string) => {
    const contact = phoneOrEmail?.trim()
    if (!contact) {
      message.warning('Укажите телефон или email в форме и попробуйте снова')
      return
    }
    setResetLoading(true)
    try {
      await authService.sendCode({ phone: contact, type: 'reset' })
      message.success('Код для сброса отправлен')
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Не удалось отправить код')
    } finally {
      setResetLoading(false)
    }
  }

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setSocialLoading('google')
    
    try {
      const authUrl = authService.getGoogleAuthUrl()
      window.location.href = authUrl
    } catch (error: any) {
      message.error(error.message || 'Ошибка входа через Google')
      setSocialLoading(null)
    }
  }

  const handleAppleLogin = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setSocialLoading('apple')
    
    try {
      const authUrl = authService.getAppleAuthUrl()
      window.location.href = authUrl
    } catch (error: any) {
      message.error(error.message || 'Ошибка входа через Apple')
      setSocialLoading(null)
    }
  }

  return (
    <Form
      name="login"
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      className="auth-form"
    >
      <Form.Item
        label="Телефон или Email"
        name="phone"
        rules={[
          { required: true, message: 'Введите номер телефона или email' },
          { 
            validator: (_, value) => {
              if (!value) {
                return Promise.reject(new Error('Введите номер телефона или email'))
              }
              // Проверяем, является ли это email или телефон
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              const isPhone = /^(\+?996|996|0)?[0-9]{9}$/.test(value.replace(/[^\d+]/g, ''))
              if (isEmail || isPhone) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Неверный формат телефона или email'))
            }
          },
        ]}
        normalize={(value) => {
          if (!value) return value
          // Если это похоже на email, оставляем как есть
          if (value.includes('@')) {
            return value.trim().toLowerCase()
          }
          // Для телефона убираем все кроме цифр и +
          return value.replace(/[^\d+]/g, '')
        }}
      >
        <Input
          placeholder="+996507700007 или email@example.com"
          size="large"
          prefix={<UserOutlined />}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введите пароль' }]}
      >
        <Input.Password
          placeholder="Введите пароль"
          size="large"
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          className="auth-input"
        />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Запомнить меня</Checkbox>
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
          ВОЙТИ
        </Button>
      </Form.Item>

      {isDevMode && (
        <Form.Item style={{ marginTop: -8 }}>
          <Button
            block
            size="large"
            onClick={devLogin}
          >
            Войти (dev)
          </Button>
        </Form.Item>
      )}

      <div className="auth-link">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/reset-password')
          }}
        >
          Забыли пароль?
        </a>
      </div>

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
          onClick={handleGoogleLogin}
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
          onClick={handleAppleLogin}
          loading={socialLoading === 'apple'}
          disabled={isPending || socialLoading !== null}
        >
          Продолжить с Apple
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
