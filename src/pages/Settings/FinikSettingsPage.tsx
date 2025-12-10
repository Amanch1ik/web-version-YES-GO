import { useState, useEffect } from 'react'
import { Card, Typography, Button, Input, Form, message, List, Modal, Space, Tag, Popconfirm } from 'antd'
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, KeyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { finikService } from '@/services/finik.service'
import { FinikApiKey } from '@/types/finik'
import './FinikSettingsPage.css'

const { Title, Text } = Typography

const FinikSettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [apiKeys, setApiKeys] = useState<FinikApiKey[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadApiKeys()
  }, [])

  const loadApiKeys = async () => {
    setLoading(true)
    try {
      const keys = await finikService.getApiKeysList()
      setApiKeys(keys)
    } catch (error) {
      message.error('Не удалось загрузить список ключей')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async (values: { name: string; apiKey: string; secretKey: string }) => {
    setLoading(true)
    try {
      finikService.saveApiKeys(values.apiKey, values.secretKey)
      message.success('API ключи успешно сохранены')
      setModalVisible(false)
      form.resetFields()
      loadApiKeys()
    } catch (error) {
      message.error('Не удалось сохранить ключи')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKey = (_keyId?: string) => {
    finikService.removeApiKeys()
    message.success('API ключи удалены')
    loadApiKeys()
  }

  const toggleShowKey = (keyId: string) => {
    setShowKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string, show: boolean) => {
    if (show) return key
    return key.substring(0, 8) + '•'.repeat(key.length - 8)
  }

  return (
    <div className="finik-settings-page">
      <div className="finik-settings-header">
        <ArrowLeftOutlined
          className="finik-settings-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="finik-settings-title">
          Настройки Finik
        </Title>
      </div>

      <Card className="finik-settings-card">
        <div className="finik-settings-info">
          <Title level={5}>Информация о Finik</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Finik — это платежная система для приема платежей на сайте. Вы можете самостоятельно
            генерировать API-ключи для интеграции.
          </Text>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Button
              type="link"
              href="https://www.finik.kg/"
              target="_blank"
              style={{ padding: 0 }}
            >
              🌐 Сайт Finik
            </Button>
            <Button
              type="link"
              href="https://wa.me/+996550037601"
              target="_blank"
              style={{ padding: 0 }}
            >
              💬 Получить тестовые ключи
            </Button>
            <Button
              type="link"
              href="https://www.finik.kg/for-developers/"
              target="_blank"
              style={{ padding: 0 }}
            >
              📚 Документация для разработчиков
            </Button>
          </Space>
        </div>
      </Card>

      <Card className="finik-settings-card" style={{ marginTop: 16 }}>
        <div className="finik-settings-keys-header">
          <Title level={5} style={{ margin: 0 }}>
            API Ключи
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Добавить ключ
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="finik-settings-empty">
            <KeyOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
            <Text type="secondary">API ключи не настроены</Text>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8 }}>
              Добавьте API ключи для начала работы с Finik
            </Text>
          </div>
        ) : (
          <List
            dataSource={apiKeys}
            loading={loading}
            renderItem={(key) => (
              <List.Item
                actions={[
                  <Button
                    type="text"
                    icon={showKeys[key.id || ''] ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    onClick={() => key.id && toggleShowKey(key.id)}
                  />,
                  <Popconfirm
                    title="Удалить API ключ?"
                    description="Это действие нельзя отменить"
                    onConfirm={() => handleDeleteKey(key.id)}
                    okText="Да"
                    cancelText="Нет"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<KeyOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
                  title={key.name}
                  description={
                    <Space direction="vertical" size="small">
                      <div>
                        <Text strong>API Key: </Text>
                        <Text code>{maskKey(key.apiKey, showKeys[key.id || ''] || false)}</Text>
                      </div>
                      <div>
                        <Text strong>Secret Key: </Text>
                        <Text code>{maskKey(key.secretKey, showKeys[key.id || ''] || false)}</Text>
                      </div>
                      {key.isActive && <Tag color="green">Активен</Tag>}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      <Modal
        title="Добавить API ключи Finik"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateKey}
          autoComplete="off"
        >
          <Form.Item
            label="Название ключа"
            name="name"
            rules={[{ required: true, message: 'Введите название ключа' }]}
          >
            <Input placeholder="Основной ключ" />
          </Form.Item>

          <Form.Item
            label="API Key"
            name="apiKey"
            rules={[{ required: true, message: 'Введите API Key' }]}
          >
            <Input.Password placeholder="Введите API Key" />
          </Form.Item>

          <Form.Item
            label="Secret Key"
            name="secretKey"
            rules={[{ required: true, message: 'Введите Secret Key' }]}
          >
            <Input.Password placeholder="Введите Secret Key" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Сохранить
              </Button>
              <Button onClick={() => setModalVisible(false)}>Отмена</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FinikSettingsPage

