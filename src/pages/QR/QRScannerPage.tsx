import { useState, useRef, useEffect } from 'react'
import { Typography, Button, Slider, Space, message, Modal, QRCode } from 'antd'
import { ArrowLeftOutlined, QrcodeOutlined, PictureOutlined, ThunderboltOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { walletService } from '@/services/wallet.service'
import jsQR from 'jsqr'
import './QRScannerPage.css'

const { Title, Text } = Typography

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [zoom, setZoom] = useState(50)
  const [flashlight, setFlashlight] = useState(false)
  const [showMyQR, setShowMyQR] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanIntervalRef = useRef<number | null>(null)

  // Генерируем QR код для пользователя
  const userQRData = user?.id ? `yess://user/${user.id}` : 'yess://app'

  useEffect(() => {
    // Очистка при размонтировании
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [])

  const handleRedeemQr = async (data: string) => {
    try {
      const response = await walletService.applyQrCode(data)

      if (response.success) {
        message.success(response.message || 'Бонусы успешно начислены')
        Modal.info({
          title: 'QR код обработан',
          content: (
            <>
              <p>{response.message || 'Ваш QR код успешно обработан.'}</p>
              {typeof response.addedCoins === 'number' && (
                <p>Начислено: {response.addedCoins} Yess!Coins</p>
              )}
              {typeof response.newBalance === 'number' && (
                <p>Новый баланс: {response.newBalance} Yess!Coins</p>
              )}
            </>
          ),
          okText: 'Ок',
        })
      } else {
        message.error(response.message || 'Не удалось обработать QR код')
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Ошибка при обработке QR кода'
      message.error(errorMsg)
    }
  }

  const scanQRCode = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    if (code) {
      const data = code.data
      setScannedData(data)
      handleStopScan()
      message.success('QR код успешно отсканирован!')
      
      // Обработка отсканированных данных
      if (data.startsWith('yess://')) {
        // Обработка внутренних ссылок приложения
        const url = new URL(data.replace('yess://', 'https://'))
        if (url.pathname.startsWith('/user/')) {
          const userId = url.pathname.split('/user/')[1]
          message.info(`Найден пользователь: ${userId}`)
        } else {
          message.info(`Обработана внутренняя ссылка: ${data}`)
        }
      } else if (data.startsWith('http://') || data.startsWith('https://')) {
        // Открываем URL в новой вкладке
        window.open(data, '_blank')
      } else {
        // Пытаемся отправить QR‑код на бэкенд для начисления/обработки
        await handleRedeemQr(data)
      }
    }
  }

  const handleStartScan = async () => {
    try {
      setScanning(true)
      setScannedData(null)
      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment'
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        
        // Начинаем сканирование каждые 100ms
        scanIntervalRef.current = window.setInterval(scanQRCode, 100)
      }
      message.success('Камера активирована')
    } catch (error) {
      message.error('Не удалось получить доступ к камере. Проверьте разрешения.')
      setScanning(false)
    }
  }

  const handleStopScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  const handleGallerySelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      message.info('Обработка изображения...')
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          if (!context) {
            message.error('Не удалось обработать изображение')
            return
          }
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img, 0, 0)
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          
          if (code) {
            setScannedData(code.data)
            message.success('QR код найден в изображении!')
            Modal.info({
              title: 'Отсканированные данные',
              content: code.data,
              okText: 'Закрыть',
            })
          } else {
            message.error('QR код не найден в изображении')
          }
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMyQR = () => {
    setShowMyQR(true)
  }

  const handleCopyQR = () => {
    navigator.clipboard.writeText(userQRData)
    message.success('QR код скопирован!')
  }

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-header">
        <ArrowLeftOutlined
          className="qr-scanner-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="qr-scanner-header-title">QR Сканер</Title>
      </div>

      <div className="qr-scanner-content">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {scanning ? (
          <div className="qr-scanner-video-container">
            <video
              ref={videoRef}
              className="qr-scanner-video"
              autoPlay
              playsInline
              muted
            />
            <div className="qr-scanner-frame">
              <div className="qr-scanner-corner top-left"></div>
              <div className="qr-scanner-corner top-right"></div>
              <div className="qr-scanner-corner bottom-left"></div>
              <div className="qr-scanner-corner bottom-right"></div>
            </div>
            <Button
              type="primary"
              danger
              className="qr-scanner-stop-button"
              onClick={handleStopScan}
            >
              Остановить сканирование
            </Button>
          </div>
        ) : (
          <>
            <div className="qr-scanner-frame">
              <div className="qr-scanner-corner top-left"></div>
              <div className="qr-scanner-corner top-right"></div>
              <div className="qr-scanner-corner bottom-left"></div>
              <div className="qr-scanner-corner bottom-right"></div>
            </div>

            <div className="qr-scanner-instructions">
              <Title level={4} className="qr-scanner-title">
                Сканируйте QR код
              </Title>
              <Text className="qr-scanner-subtitle">
                Отсканируйте чек, чтобы получить
              </Text>
              <Text className="qr-scanner-subtitle">
                бонусные баллы
              </Text>
            </div>
          </>
        )}
      </div>

      <div className="qr-scanner-controls">
        {!scanning && (
          <div className="qr-scanner-slider-wrapper">
            <Slider
              value={zoom}
              onChange={setZoom}
              min={0}
              max={100}
              className="qr-scanner-slider"
              tooltip={{ formatter: (value) => `${value}%` }}
            />
            <Button
              type="text"
              icon={<ThunderboltOutlined />}
              className={`qr-scanner-flashlight ${flashlight ? 'active' : ''}`}
              onClick={() => {
                setFlashlight(!flashlight)
                message.info(flashlight ? 'Фонарик выключен' : 'Фонарик включен')
              }}
            />
          </div>
        )}

        <Space size="middle" className="qr-scanner-buttons" direction="vertical" style={{ width: '100%' }}>
          {!scanning ? (
            <>
              <Button
                type="primary"
                icon={<QrcodeOutlined />}
                className="qr-scanner-button"
                block
                size="large"
                onClick={handleStartScan}
              >
                Начать сканирование
              </Button>
              <Space size="middle" style={{ width: '100%' }}>
                <Button
                  icon={<QrcodeOutlined />}
                  className="qr-scanner-button"
                  onClick={handleMyQR}
                  block
                >
                  Мой QR
                </Button>
                <Button
                  icon={<PictureOutlined />}
                  className="qr-scanner-button"
                  onClick={handleGallerySelect}
                  block
                >
                  Из Галереи
                </Button>
              </Space>
            </>
          ) : (
            <Button
              icon={<PictureOutlined />}
              className="qr-scanner-button"
              onClick={handleGallerySelect}
              block
            >
              Выбрать из галереи
            </Button>
          )}
        </Space>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <Modal
        open={showMyQR}
        onCancel={() => setShowMyQR(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={4}>Мой QR код</Title>
          <div style={{ 
            width: 250, 
            height: 250, 
            margin: '20px auto',
            background: '#fff',
            border: '2px solid #52c41a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}>
            <QRCode 
              value={userQRData} 
              size={218}
              color="#52c41a"
              icon="/src/Resources/Splash/splash.svg"
            />
          </div>
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            Поделитесь этим QR кодом с друзьями
          </Text>
          <Text code style={{ display: 'block', marginBottom: '16px', wordBreak: 'break-all' }}>
            {userQRData}
          </Text>
          <Button
            type="primary"
            onClick={handleCopyQR}
            block
          >
            Копировать ссылку
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default QRScannerPage

