import { Layout } from 'antd'
import BottomNavigation from './BottomNavigation'
import { useSwipeBack } from '../../hooks/useSwipeBack'
import './AppLayout.css'

const { Content } = Layout

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  useSwipeBack()
  
  return (
    <Layout className="app-layout">
      <Content className="app-content">
        {children}
      </Content>
      <BottomNavigation />
    </Layout>
  )
}

export default AppLayout

