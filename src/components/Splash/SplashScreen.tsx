import { useEffect, useState } from 'react'
import './SplashScreen.css'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => {
        setShow(false)
        onComplete()
      }, 400) // Время для fade-out анимации
    }, 2000) // Показываем splash screen 2 секунды

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-logo">φ</div>
      <div className="home-indicator"></div>
    </div>
  )
}

export default SplashScreen

