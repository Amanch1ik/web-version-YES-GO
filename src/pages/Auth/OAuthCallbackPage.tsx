import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { Spin, message, Result, Button } from 'antd'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/contexts/AuthContext'
import './AuthPage.css'

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [searchParams] = useSearchParams()
  const { provider } = useParams<{ provider: 'google' | 'apple' }>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Получаем параметры из URL
        const code = searchParams.get('code')
        const idToken = searchParams.get('id_token')
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (errorParam) {
          setError(errorDescription || errorParam || 'Ошибка авторизации')
          setLoading(false)
          return
        }

        if (!code && !idToken) {
          setError('Не получены данные авторизации')
          setLoading(false)
          return
        }

        let response

        if (provider === 'google') {
          // Для Google используем id_token или code
          response = await authService.loginWithGoogle(idToken || code || '')
        } else if (provider === 'apple') {
          // Для Apple используем id_token и authorization_code
          response = await authService.loginWithApple(idToken || '', code || undefined)
        } else {
          throw new Error('Неизвестный провайдер')
        }

        if (response.token && response.user) {
          updateUser(response.user)
          
          message.success({
            content: response.isNewUser ? 'Регистрация успешна!' : 'Успешный вход!',
            duration: 1.5,
          })

          setTimeout(() => {
            navigate('/', { replace: true })
          }, 500)
        } else {
          throw new Error('Не удалось получить данные пользователя')
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err)
        setError(err.response?.data?.message || err.message || 'Ошибка авторизации')
        setLoading(false)
      }
    }

    handleCallback()
  }, [provider, searchParams, navigate, updateUser])

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 24, color: '#fff', fontSize: 16 }}>
            Выполняется вход через {provider === 'google' ? 'Google' : 'Apple'}...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ padding: '40px 20px' }}>
          <Result
            status="error"
            title="Ошибка авторизации"
            subTitle={error}
            extra={[
              <Button 
                type="primary" 
                key="login"
                onClick={() => navigate('/login', { replace: true })}
              >
                Вернуться к входу
              </Button>,
            ]}
          />
        </div>
      </div>
    )
  }

  return null
}

export default OAuthCallbackPage

