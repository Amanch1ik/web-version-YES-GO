import { useEffect, useState } from 'react'
import './SplashScreen.css'

interface SplashScreenProps {
  onComplete: () => void
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(() => {
        onComplete()
      }, 300)
    }, 2000) // Показываем splash screen 2 секунды

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) return null

  return (
    <div className="splash-screen">
      <div className="splash-logo">φ</div>
      <div className="home-indicator"></div>
    </div>
  )
}

export default SplashScreen

