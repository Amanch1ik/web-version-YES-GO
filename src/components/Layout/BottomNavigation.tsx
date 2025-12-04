import { useNavigate, useLocation } from 'react-router-dom'
import { HomeOutlined, AppstoreOutlined, QrcodeOutlined, BellOutlined, UserOutlined } from '@ant-design/icons'
import './BottomNavigation.css'

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: HomeOutlined, label: 'Главная' },
    { path: '/categories', icon: AppstoreOutlined, label: 'Партнеры' },
    { path: '/qr', icon: QrcodeOutlined, label: '' },
    { path: '/notifications', icon: BellOutlined, label: 'Уведомления' },
    { path: '/profile', icon: UserOutlined, label: 'Еще' },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.path)
        
        return (
          <div
            key={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon className="nav-icon" />
            {item.label && <span className="nav-label">{item.label}</span>}
          </div>
        )
      })}
    </div>
  )
}

export default BottomNavigation

