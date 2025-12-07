import { Typography } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import './FeedbackPage.css'

const { Title, Text } = Typography

const FeedbackPage: React.FC = () => {
  const faqSections = [
    {
      key: '1',
      title: 'Не могу войти в аккаунт',
      items: [
        'Мне не поступает звонок подтверждения',
        'Не могу вспомнить как регистрировался',
      ],
    },
    {
      key: '2',
      title: 'Не могу прикрепить номер телефона',
      items: [
        'Мне не поступает звонок подтверждения',
        'Мой номер уже кем-то занят',
      ],
    },
    {
      key: '3',
      title: 'Ваши предложения',
      items: [
        'Предложения по функционалу и работе приложения',
      ],
    },
    {
      key: '4',
      title: 'Отзыв номера',
      items: [
        'Хочу, чтобы мой номер перестал отображаться у компании',
      ],
    },
  ]

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <BellOutlined className="feedback-header-icon" />
        <Title level={3} className="feedback-title">
          Обратная связь
        </Title>
      </div>

      <Title level={4} className="feedback-faq-title">
        Частые вопросы
      </Title>

      <div className="feedback-list-wrapper">
        {faqSections.map((section) => (
          <div key={section.key} className="feedback-section">
            <Text strong className="feedback-section-title">
              {section.title}
            </Text>
            <ul className="feedback-list">
              {section.items.map((item, index) => (
                <li key={index} className="feedback-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeedbackPage

