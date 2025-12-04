import { Card, Empty, Typography } from 'antd'
import { FileDoneOutlined } from '@ant-design/icons'
import './CertificatesPage.css'

const { Title } = Typography

const CertificatesPage: React.FC = () => {
  return (
    <div className="certificates-page">
      <div className="certificates-header">
        <FileDoneOutlined className="certificates-header-icon" />
        <Title level={3} className="certificates-title">
          Мои сертификаты
        </Title>
      </div>

      <Card className="certificates-content-card">
        <Empty
          description={
            <span className="empty-description">
              У вас пока что нету сертификатов
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </div>
  )
}

export default CertificatesPage

