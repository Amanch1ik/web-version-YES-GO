import { useEffect, useState, useRef } from 'react'
import './WelcomeScreen.css'

interface WelcomeScreenProps {
  onComplete: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    let isMounted = true
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null
    let videoStarted = false
    let minDisplayTime = 2500 // Минимальное время показа - 2.5 секунды
    const startTime = Date.now()

    if (video) {
      // Функция для завершения экрана
      const complete = () => {
        if (!isMounted) return
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, minDisplayTime - elapsed)
        
        setTimeout(() => {
          if (isMounted) {
            setFadeOut(true)
            setTimeout(() => {
              if (isMounted) {
                setShow(false)
                onComplete()
              }
            }, 400)
          }
        }, remaining)
      }

      // Ждем загрузки видео перед воспроизведением
      const handleCanPlay = () => {
        if (!isMounted || !video || videoStarted) return
        videoStarted = true
        
        const playPromise = video.play()
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            // Подавляем AbortError - это нормально, если компонент размонтировался
            if (error.name !== 'AbortError' && isMounted) {
              // Если не удалось воспроизвести, используем fallback
              if (fallbackTimer) clearTimeout(fallbackTimer)
              fallbackTimer = setTimeout(complete, minDisplayTime)
            }
          })
        }
      }

      // Когда видео закончится, запускаем fade-out
      const handleEnded = () => {
        if (!isMounted) return
        if (fallbackTimer) clearTimeout(fallbackTimer)
        complete()
      }

      // Обработка ошибок загрузки
      const handleError = () => {
        if (!isMounted) return
        // Если видео не загрузилось, используем fallback
        if (fallbackTimer) clearTimeout(fallbackTimer)
        fallbackTimer = setTimeout(complete, minDisplayTime)
      }

      // Проверяем, может ли видео уже воспроизводиться
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA или выше
        handleCanPlay()
      } else {
        video.addEventListener('canplay', handleCanPlay, { once: true })
        video.addEventListener('loadeddata', handleCanPlay, { once: true })
      }

      video.addEventListener('ended', handleEnded)
      video.addEventListener('error', handleError)

      // Fallback: если видео не закончилось за 8 секунд
      fallbackTimer = setTimeout(() => {
        if (isMounted && video && !video.ended) {
          complete()
        }
      }, 8000)

      return () => {
        isMounted = false
        if (fallbackTimer) clearTimeout(fallbackTimer)
        if (video) {
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('loadeddata', handleCanPlay)
          video.removeEventListener('ended', handleEnded)
          video.removeEventListener('error', handleError)
          // Останавливаем видео при размонтировании
          video.pause()
          video.src = ''
        }
      }
    } else {
      // Fallback без видео - минимум 2.5 секунды
      const timer = setTimeout(() => {
        if (isMounted) {
          setFadeOut(true)
          setTimeout(() => {
            if (isMounted) {
              setShow(false)
              onComplete()
            }
          }, 400)
        }
      }, minDisplayTime)

      return () => {
        isMounted = false
        clearTimeout(timer)
      }
    }
  }, [onComplete])

  if (!show) return null

  return (
    <div className={`welcome-screen ${fadeOut ? 'fade-out' : ''}`}>
      <video
        ref={videoRef}
        className="welcome-video"
        muted
        playsInline
        loop={false}
        preload="auto"
      >
        <source src="/animations/prv0001-0125.mov" type="video/quicktime" />
        <source src="/animations/prv0001-0125.mp4" type="video/mp4" />
      </video>
      <div className="welcome-content">
        <div className="welcome-text">Добро пожаловать в</div>
        <div className="welcome-title">
          <span className="welcome-title-main">YESS!</span>
          <span className="welcome-title-go">GO</span>
        </div>
      </div>
      <div className="home-indicator"></div>
    </div>
  )
}

export default WelcomeScreen

