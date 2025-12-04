import { useState } from 'react'
import { Card, Typography, Collapse } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import './FeedbackPage.css'

const { Title, Text } = Typography
const { Panel } = Collapse

const FeedbackPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])

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
        <ClockCircleOutlined className="feedback-header-icon" />
        <Title level={3} className="feedback-title">
          Обратная связь
        </Title>
      </div>

      <Title level={4} className="feedback-faq-title">
        Частые вопросы
      </Title>

      <Card className="feedback-faq-card">
        <Collapse
          activeKey={activeKey}
          onChange={setActiveKey}
          className="feedback-collapse"
          expandIconPosition="end"
        >
          {faqSections.map((section) => (
            <Panel
              key={section.key}
              header={<Text strong>{section.title}</Text>}
              className="feedback-panel"
            >
              <ul className="feedback-list">
                {section.items.map((item, index) => (
                  <li key={index} className="feedback-item">
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </Collapse>
      </Card>
    </div>
  )
}

export default FeedbackPage

