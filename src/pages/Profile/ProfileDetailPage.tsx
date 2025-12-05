import { useState, useEffect } from 'react'
import { Card, Avatar, Typography, Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { ArrowLeftOutlined, UserOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/services/user.service'
import './ProfileDetailPage.css'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

const ProfileDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateUser, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    birthDate: user?.birthDate ? dayjs(user.birthDate, 'DD.MM.YYYY') : null,
    gender: user?.gender || 'male',
  })

  // Обновляем formData при изменении user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate ? dayjs(user.birthDate, 'DD.MM.YYYY') : null,
        gender: user.gender || 'male',
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate?.format('DD.MM.YYYY'),
        gender: formData.gender,
      }

      const response = await userService.updateProfile(updateData)
      
      // Обновляем локальное состояние пользователя
      updateUser(response.user)
      setIsEditing(false)
      message.success('Профиль успешно обновлен!')
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 
        'Не удалось обновить профиль. Попробуйте еще раз.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await userService.deleteAccount()
      message.success('Аккаунт успешно удален')
      logout()
      window.location.href = '/login'
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 
        'Не удалось удалить аккаунт. Попробуйте еще раз.'
      )
      setDeleting(false)
    }
  }

  const userFullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`.trim()
    : user?.fullName || 'Пользователь'

  return (
    <div className="profile-detail-page">
      <div className="profile-detail-header">
        <ArrowLeftOutlined
          className="profile-detail-back-button"
          onClick={() => navigate(-1)}
        />
        <Title level={4} className="profile-detail-title">
          Профиль
        </Title>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          className="profile-detail-delete-button"
          onClick={() => setDeleteModalVisible(true)}
        />
      </div>

      {/* Profile Image Card */}
      <Card 
        className="profile-image-card"
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = (e: any) => {
            const file = e.target.files?.[0]
            if (file) {
              // Здесь можно добавить загрузку изображения на сервер
              const reader = new FileReader()
              reader.onload = () => {
                message.info('Изображение загружено (в разработке)')
                // В будущем здесь будет загрузка на сервер и обновление аватара
              }
              reader.readAsDataURL(file)
            }
          }
          input.click()
        }}
        style={{ cursor: 'pointer' }}
      >
        <div className="profile-image-content">
          <Avatar 
            size={80} 
            src={user?.avatar || '/src/Resources/Images/profile.png'} 
            icon={<UserOutlined />} 
            className="profile-detail-avatar" 
          />
          <div className="profile-image-info">
            <Title level={4} className="profile-image-name">
              {userFullName}
            </Title>
            <Text className="profile-image-change">Изменить изображение</Text>
          </div>
          <ArrowLeftOutlined className="profile-image-arrow" />
        </div>
      </Card>

      {/* User Details Card */}
      <Card className="profile-details-card">
        <div className="profile-details-header">
          <Title level={5} style={{ margin: 0 }}>
            Пользователь
          </Title>
          {!isEditing ? (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => setIsEditing(true)}
              className="profile-edit-button"
            >
              Изменить
            </Button>
          ) : (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={handleSave}
              className="profile-save-button"
              loading={loading}
              disabled={loading}
            >
              Сохранить
            </Button>
          )}
        </div>

        <div className="profile-details-content">
          {isEditing ? (
            <>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Имя</Text>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="profile-detail-input"
                />
              </div>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Фамилия</Text>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="profile-detail-input"
                />
              </div>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Дата рождения</Text>
                <DatePicker
                  value={formData.birthDate}
                  onChange={(date) => setFormData({ ...formData, birthDate: date })}
                  format="DD.MM.YYYY"
                  className="profile-detail-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Пол</Text>
                <Select
                  value={formData.gender}
                  onChange={(value) => setFormData({ ...formData, gender: value })}
                  className="profile-detail-input"
                  style={{ width: '100%' }}
                >
                  <Option value="male">Мужской</Option>
                  <Option value="female">Женский</Option>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Имя</Text>
                <Text className="profile-detail-value">{userFullName}</Text>
              </div>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Дата рождения</Text>
                <Text className="profile-detail-value">
                  {user?.birthDate || 'Не указано'}
                </Text>
              </div>
              <div className="profile-detail-field">
                <Text className="profile-detail-label">Пол</Text>
                <Text className="profile-detail-value">
                  {user?.gender === 'male' ? 'Мужской' : user?.gender === 'female' ? 'Женский' : 'Не указано'}
                </Text>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Login Methods Card */}
      <Card className="profile-methods-card">
        <div className="profile-methods-header">
          <Title level={5} style={{ margin: 0 }}>
            Способы входа
          </Title>
          <Button type="link" className="profile-view-button">
            Посмотреть
          </Button>
        </div>
        <div className="profile-methods-icons">
          <div className="method-icon-wrapper">
            <div className="method-icon method-icon-document">
              <UserOutlined />
            </div>
            <CheckCircleOutlined className="method-check" />
          </div>
          <div className="method-icon-wrapper">
            <div className="method-icon method-icon-google">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <CheckCircleOutlined className="method-check" />
          </div>
        </div>
      </Card>

      {/* Delete Account Card */}
      <Card className="profile-delete-card">
        <div className="profile-delete-content">
          <div>
            <Title level={5} className="profile-delete-title">
              Удаление аккаунта
            </Title>
            <Text className="profile-delete-warning">
              Все бонусы будут удалены
            </Text>
          </div>
          <Button
            type="text"
            danger
            className="profile-delete-button"
            onClick={() => setDeleteModalVisible(true)}
          >
            Удалить
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
        className="delete-account-modal"
        centered
      >
        <div className="delete-modal-content">
          <Title level={4} className="delete-modal-title">
            Вы уверены?
          </Title>
          <Text className="delete-modal-text">
            Все ваши данные и бонусы будут безвозвратно удалены. Это действие нельзя отменить.
          </Text>
          <div className="delete-modal-buttons">
            <Button
              className="delete-cancel-button"
              onClick={() => setDeleteModalVisible(false)}
            >
              Отмена
            </Button>
            <Button
              danger
              className="delete-confirm-button"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              Удалить аккаунт
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfileDetailPage

