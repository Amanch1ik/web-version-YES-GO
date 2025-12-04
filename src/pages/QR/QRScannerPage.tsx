import { useState } from 'react'
import { Typography, Button, Slider, Space, message } from 'antd'
import { ArrowLeftOutlined, QrcodeOutlined, PictureOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './QRScannerPage.css'

const { Title, Text } = Typography

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate()
  const [zoom, setZoom] = useState(50)
  const [flashlight, setFlashlight] = useState(false)

  return (
    <div className="qr-scanner-page">
      <div className="qr-scanner-header">
        <ArrowLeftOutlined
          className="qr-scanner-back-button"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="qr-scanner-content">
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
      </div>

      <div className="qr-scanner-controls">
        <div className="qr-scanner-slider-wrapper">
          <Slider
            value={zoom}
            onChange={setZoom}
            min={0}
            max={100}
            className="qr-scanner-slider"
          />
          <Button
            type="text"
            icon={<ThunderboltOutlined />}
            className={`qr-scanner-flashlight ${flashlight ? 'active' : ''}`}
            onClick={() => setFlashlight(!flashlight)}
          />
        </div>

        <Space size="middle" className="qr-scanner-buttons">
          <Button
            icon={<QrcodeOutlined />}
            className="qr-scanner-button"
            onClick={() => message.info('Мой QR код')}
          >
            Мой QR
          </Button>
          <Button
            icon={<PictureOutlined />}
            className="qr-scanner-button"
            onClick={() => message.info('Выбор из галереи')}
          >
            Из Галереи
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default QRScannerPage

