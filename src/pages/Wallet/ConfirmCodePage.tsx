import { useState, useRef, useEffect } from 'react'
import { Card, Typography, Button, Input, message } from 'antd'
import type { InputRef } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import './ConfirmCodePage.css'

const { Title, Text } = Typography

const ConfirmCodePage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { phone } = location.state || {}
  
  const [code, setCode] = useState(['', '', '', ''])
  const inputRefs = useRef<(InputRef | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    const newCode = pastedData.split('').concat(['', '', '', '']).slice(0, 4)
    setCode(newCode)
    inputRefs.current[newCode.filter(c => c).length - 1]?.focus()
  }

  const handleConfirm = () => {
    const fullCode = code.join('')
    if (fullCode.length === 4) {
      message.success('Код подтвержден!')
      setTimeout(() => {
        navigate('/wallet', { state: { success: true } })
      }, 1000)
    } else {
      message.error('Введите полный код')
    }
  }

  const handleResend = () => {
    message.info('Код отправлен повторно')
  }

  return (
    <div className="confirm-code-page">
      <div className="confirm-code-header">
        <div className="mbank-logo-small">
          <div className="mbank-logo-bg-small">
            <span className="mbank-logo-m-small">M</span>
            <span className="mbank-logo-star-small">★</span>
          </div>
        </div>
        <Title level={4} className="confirm-code-title">
          Код подтверждения отправлен в ваше приложение МБанк
        </Title>
        <Text className="confirm-code-subtitle">
          Код отправлен на номер {phone || '+996 507700007'}
        </Text>
      </div>

      <div className="confirm-code-content">
        <div className="confirm-code-inputs">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              maxLength={1}
              className="confirm-code-input"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <Button
          type="primary"
          size="large"
          className="confirm-code-button"
          block
          onClick={handleConfirm}
        >
          Подтвердить
        </Button>

        <button
          type="button"
          className="confirm-code-resend"
          onClick={handleResend}
        >
          Отправить код еще раз
        </button>
      </div>
    </div>
  )
}

export default ConfirmCodePage

