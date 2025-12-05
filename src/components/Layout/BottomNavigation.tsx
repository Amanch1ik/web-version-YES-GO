import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNavigation.css'

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: '/src/Resources/Images/nav_home.png', iconActive: '/src/Resources/Images/nav_home_press.png', label: 'Главная' },
    { path: '/categories', icon: '/src/Resources/Images/nav_partners.png', iconActive: '/src/Resources/Images/nav_partners_press.png', label: 'Партнеры' },
    { path: '/qr', icon: '/src/Resources/Images/nav_qr.png', iconActive: '/src/Resources/Images/nav_qr.png', label: '' },
    { path: '/notifications', icon: '/src/Resources/Images/nav_notification.png', iconActive: '/src/Resources/Images/nav_notification_press.png', label: 'Уведомления' },
    { path: '/profile', icon: '/src/Resources/Images/nav_more.png', iconActive: '/src/Resources/Images/nav_more_press.png', label: 'Еще' },
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
        const active = isActive(item.path)
        const iconSrc = active ? item.iconActive : item.icon
        
        return (
          <div
            key={item.path}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <img src={iconSrc} alt={item.label || 'Nav'} className="nav-icon" />
            {item.label && <span className="nav-label">{item.label}</span>}
          </div>
        )
      })}
    </div>
  )
}

export default BottomNavigation

