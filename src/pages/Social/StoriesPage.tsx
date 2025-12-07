import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './StoriesPage.css'

interface Story {
  id: number
  image: string
}

const stories: Story[] = [
  { id: 1, image: '/src/Resources/Images/storiespage_bonus.png' },
  { id: 2, image: '/src/Resources/Images/storiespage_bday.png' },
  { id: 3, image: '/src/Resources/Images/storiespage_yesscoin.png' },
]

const STORY_DURATION = 5000

const StoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (stories.length === 0) return

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length)
    }, STORY_DURATION)

    return () => clearTimeout(timer)
  }, [currentIndex])

  const handleClose = () => {
    navigate(-1)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  if (stories.length === 0) {
    return null
  }

  return (
    <div className="stories-page">
      <div className="stories-top-bar">
        <div className="stories-progress">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="stories-progress-segment"
            >
              <div
                key={
                  index === currentIndex
                    ? `active-${currentIndex}`
                    : `inner-${index}`
                }
                className={`stories-progress-inner ${
                  index < currentIndex
                    ? 'passed'
                    : index === currentIndex
                    ? 'active'
                    : ''
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="stories-image-wrapper" onClick={handleNext}>
        <img
          src={stories[currentIndex].image}
          alt="story"
          className="stories-image"
        />
        <div
          className="stories-touch-zone left"
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
        />
        <div
          className="stories-touch-zone right"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
        />
      </div>

      <button
        type="button"
        className="stories-close-button"
        onClick={handleClose}
      >
        ✕
      </button>

      <div className="stories-home-indicator" />
    </div>
  )
}

export default StoriesPage


