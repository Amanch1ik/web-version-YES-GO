import { Form, Input, Button, Checkbox, message } from 'antd'
import { UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { LoginRequest } from '@/types/auth'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './AuthForm.css'

const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data) => {
      // Проверяем, что данные сохранились в localStorage (должны быть уже из authService.login)
      const token = localStorage.getItem('yess_token')
      const user = localStorage.getItem('yess_user')
      
      if (!token || !user) {
        // Повторно сохраняем
        const { setToken, setUser } = await import('@/utils/storage')
        setToken(data.token)
        setUser(data.user)
      }
      
      // Обновляем состояние авторизации через контекст СИНХРОННО
      updateUser(data.user)
      
      message.success({
        content: 'Успешный вход!',
        duration: 1.5,
      })
      
      // Небольшая задержка для гарантии обновления состояния
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Проверяем финальное состояние перед навигацией
      const finalToken = localStorage.getItem('yess_token')
      const finalUser = localStorage.getItem('yess_user')
      
      if (finalToken && finalUser) {
        // Даем дополнительное время на обновление состояния перед навигацией
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 200)
      } else {
        message.error('Ошибка сохранения данных авторизации')
      }
    },
    onError: (error: any) => {
      // В DEV режиме не показываем ошибки сети
      const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
      if (isDev && (error.code === 'ERR_NETWORK' || error.message?.includes('ERR_CONNECTION_REFUSED'))) {
        return
      }
      
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
        message.error(error.response?.data?.message || error.response?.data?.error || error.message || 'Ошибка входа')
      }
    },
  })

  const onFinish = (values: LoginRequest & { remember?: boolean }) => {
    const { remember, ...loginData } = values
    mutate(loginData)
  }

  const handleDevLogin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const isDev = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true'
    
    if (!isDev) {
      message.warning('DEV режим не активен. Убедитесь, что вы запускаете приложение через npm run dev')
      return
    }
    
    const mockData: LoginRequest = {
      email: 'dev@example.com',
      password: 'dev123',
    }
    
    // Вызываем mutate напрямую - onSuccess и onError уже определены в useMutation
    mutate(mockData)
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
        label="E-mail"
        name="email"
        rules={[
          { required: true, message: 'Введите E-mail' },
          { type: 'email', message: 'Неверный формат E-mail' },
        ]}
      >
        <Input
          placeholder="sofia@gmail.com"
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

      {(import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === 'true') && (
        <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
          <Button
            type="dashed"
            block
            size="large"
            onClick={handleDevLogin}
            disabled={isPending}
            htmlType="button"
          >
            🚀 Войти для разработки (DEV)
          </Button>
        </Form.Item>
      )}

      <div className="auth-link">
        <a href="#" onClick={(e) => { e.preventDefault(); message.info('Функция в разработке') }}>
          Забыли пароль?
        </a>
      </div>

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
            message.info('Вход через Google в разработке')
          }}
        >
          Продолжить с Google
        </Button>
      </Form.Item>
    </Form>
  )
}

export default LoginForm
