import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'
import { Carousel } from 'antd'
import './StoriesPage.css'

const storiesImages = [
  '/src/Resources/Images/sales_stories1.png',
  '/src/Resources/Images/sales_stories2.png',
  '/src/Resources/Images/sales_stories3.png',
  '/src/Resources/Images/sales_stories4.png',
]

const StoriesPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="stories-page">
      <div className="stories-status-bar" />

      <button
        className="stories-back-button"
        onClick={() => navigate(-1)}
        aria-label="Назад"
      >
        <LeftOutlined />
      </button>

      <Carousel className="stories-carousel" dots={false}>
        {storiesImages.map((src, index) => (
          <div key={index} className="stories-slide">
            <img src={src} alt={`Story ${index + 1}`} className="stories-image" />
          </div>
        ))}
      </Carousel>

      <div className="stories-home-indicator" />
    </div>
  )
}

export default StoriesPage


