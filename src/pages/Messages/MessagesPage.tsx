import { Card, Empty, Typography } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import './MessagesPage.css'

const { Title } = Typography

const MessagesPage: React.FC = () => {
  return (
    <div className="messages-page">
      <div className="messages-header">
        <img src="/src/Resources/Images/icon_messages.png" alt="Messages" className="messages-header-icon" style={{ width: 24, height: 24 }} />
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

