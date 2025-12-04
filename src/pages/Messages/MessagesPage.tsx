import { Card, Empty, Typography } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import './MessagesPage.css'

const { Title } = Typography

const MessagesPage: React.FC = () => {
  return (
    <div className="messages-page">
      <div className="messages-header">
        <MessageOutlined className="messages-header-icon" />
        <Title level={3} className="messages-title">
          Сообщения
        </Title>
      </div>

      <Card className="messages-content-card">
        <Empty
          description={
            <span className="empty-description">
              У вас пока что нету сообщений
            </span>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </div>
  )
}

export default MessagesPage

