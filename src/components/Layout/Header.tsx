import { Layout, Button, Space, Typography } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'

const { Header: AntHeader } = Layout
const { Text } = Typography

const Header: React.FC = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <AntHeader style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Text strong style={{ fontSize: '20px', color: '#389e0d' }}>
        YESS Go
      </Text>
      <Space>
        {user && (
          <>
            <Text>{user.fullName || user.phone}</Text>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Выход
            </Button>
          </>
        )}
      </Space>
    </AntHeader>
  )
}

export default Header

