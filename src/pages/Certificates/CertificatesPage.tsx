import { Typography } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import './CertificatesPage.css'

const { Title } = Typography

const CertificatesPage: React.FC = () => {
  return (
    <div className="certificates-page">
      <div className="certificates-header">
        <MenuOutlined className="certificates-header-icon" />
        <Title level={3} className="certificates-title">
          Мои сертификаты
        </Title>
      </div>

      <div className="certificates-empty-wrapper">
        <span className="empty-description">
          У вас пока что нету сертификатов
        </span>
      </div>
    </div>
  )
}

export default CertificatesPage

