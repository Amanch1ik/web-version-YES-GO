import { useState, useRef, useEffect } from 'react'
import { Typography, Button, Slider, Space, message, Modal } from 'antd'
import { ArrowLeftOutlined, QrcodeOutlined, PictureOutlined, ThunderboltOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import './QRScannerPage.css'

const { Title, Text } = Typography

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [zoom, setZoom] = useState(50)
  const [flashlight, setFlashlight] = useState(false)
  const [showMyQR, setShowMyQR] = useState(false)
  const [scanning, setScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Генерируем QR код для пользователя
  const userQRData = user?.id ? `yess://user/${user.id}` : 'yess://app'

  useEffect(() => {
    // Очистка при размонтировании
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleStartScan = async () => {
    try {
      setScanning(true)
      const constraints: MediaStreamConstraints = {
        video: { 
          facingMode: 'environment'
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      message.success('Камера активирована')
    } catch (error) {
      message.error('Не удалось получить доступ к камере. Проверьте разрешения.')
      setScanning(false)
    }
  }

  const handleStopScan = () => {
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
      // Здесь можно добавить обработку изображения для сканирования QR
      message.info('Обработка изображения...')
      // В реальном приложении здесь будет библиотека для сканирования QR из изображения
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
            width: 200, 
            height: 200, 
            margin: '20px auto',
            background: '#f5f5f5',
            border: '2px solid #52c41a',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <QrcodeOutlined style={{ fontSize: 80, color: '#52c41a' }} />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              QR код
            </Text>
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

