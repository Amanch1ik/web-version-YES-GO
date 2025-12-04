import { useEffect, useState } from 'react'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onComplete: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        onComplete()
      }, 300)
    }, 2500) // Показываем welcome screen 2.5 секунды

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="welcome-screen">
      <div className="welcome-text">Добро пожаловать в</div>
      <div className="welcome-title">Yess!</div>
      <div className="home-indicator"></div>
    </div>
  )
}

export default WelcomeScreen

