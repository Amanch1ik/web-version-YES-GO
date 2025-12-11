import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { Story, StoryStats, StorySlide } from '@/types/story'

export interface AdminStoryPayload {
  title?: string
  previewUrl?: string
  slides?: StorySlide[]
  partnerId?: number
  isActive?: boolean
  startDate?: string
  endDate?: string
}

export const adminService = {
  // ---------- File upload ----------
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<{ url: string }>(API_ENDPOINTS.ADMIN.FILE_UPLOAD.AVATAR, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // ---------- Stories CRUD ----------
  getStories: async (): Promise<Story[]> => {
    const response = await api.get<Story[]>(API_ENDPOINTS.ADMIN.STORIES.LIST)
    return response.data
  },

  createStory: async (data: AdminStoryPayload): Promise<Story> => {
    const response = await api.post<Story>(API_ENDPOINTS.ADMIN.STORIES.CREATE, data)
    return response.data
  },

  getStoryById: async (storyId: string | number): Promise<Story> => {
    const response = await api.get<Story>(API_ENDPOINTS.ADMIN.STORIES.BY_ID(storyId))
    return response.data
  },

  updateStory: async (storyId: string | number, data: AdminStoryPayload): Promise<Story> => {
    const response = await api.put<Story>(API_ENDPOINTS.ADMIN.STORIES.UPDATE(storyId), data)
    return response.data
  },

  deleteStory: async (storyId: string | number): Promise<void> => {
    await api.delete(API_ENDPOINTS.ADMIN.STORIES.DELETE(storyId))
  },

  toggleStory: async (storyId: string | number): Promise<Story> => {
    const response = await api.patch<Story>(API_ENDPOINTS.ADMIN.STORIES.TOGGLE(storyId), {})
    return response.data
  },

  getStoryStats: async (storyId: string | number): Promise<StoryStats> => {
    const response = await api.get<StoryStats>(API_ENDPOINTS.ADMIN.STORIES.STATS_BY_ID(storyId))
    return response.data
  },

  getStoriesStats: async (): Promise<StoryStats> => {
    const response = await api.get<StoryStats>(API_ENDPOINTS.ADMIN.STORIES.STATS)
    return response.data
  },
}

