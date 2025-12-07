import { Typography } from 'antd'
import './SocialPage.css'

const { Title, Text } = Typography

const SocialPage: React.FC = () => {
  const socialNetworks = [
    {
      id: 'whatsapp',
      name: '@Yess!Go_Bisha',
      icon: '/src/Resources/Images/logos_whatsapp-icon.png',
      align: 'left' as const,
    },
    {
      id: 'instagram',
      name: '@Yess!Go_Bisha',
      icon: '/src/Resources/Images/skill-icons_instagram.png',
      align: 'right' as const,
    },
    {
      id: 'facebook',
      name: '@Yess!Go_Bisha',
      icon: '/src/Resources/Images/streamline-logos_messages-logo-block.png',
      align: 'left' as const,
    },
  ]

  return (
    <div className="social-page">
      <div className="social-top-bar">
        <div className="social-progress">
          <div className="social-progress-segment active" />
          <div className="social-progress-segment" />
          <div className="social-progress-segment" />
        </div>
      </div>

      <div className="social-header-row">
        <div className="social-avatar">
          <img src="/src/Resources/Images/Component 13.png" alt="Stories" />
        </div>
        <Title level={3} className="social-title">
          Мы в соцсетях
        </Title>
      </div>

      <div className="social-cards">
        {socialNetworks.map((network) => (
          <button
            key={network.id}
            className="social-card"
            onClick={() => {
              // В реальном приложении здесь будет переход на соцсеть
              window.open(`https://${network.id}.com/YessGo_Bisha`, '_blank')
            }}
          >
            <div className="social-card-inner">
              {network.align === 'left' && (
                <img src={network.icon} alt={network.id} className="social-icon large left" />
              )}
              <Text className="social-name">{network.name}</Text>
              {network.align === 'right' && (
                <img src={network.icon} alt={network.id} className="social-icon large right" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SocialPage

