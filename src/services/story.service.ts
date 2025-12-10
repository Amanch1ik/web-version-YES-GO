import api from './api'
import { API_ENDPOINTS } from '@/config/api'
import { 
  Story, 
  StoryViewResponse, 
  StoryClickResponse,
  StoryStats 
} from '@/types/story'

export const storyService = {
  /**
   * Получить список историй
   */
  getStories: async (): Promise<Story[]> => {
    const response = await api.get<Story[]>(API_ENDPOINTS.STORIES.LIST)
    return response.data
  },

  /**
   * Получить историю по ID
   */
  getStoryById: async (id: string | number): Promise<Story | null> => {
    const response = await api.get<Story>(API_ENDPOINTS.STORIES.BY_ID(id))
    return response.data
  },

  /**
   * Отметить просмотр истории
   */
  markStoryViewed: async (storyId: string | number): Promise<StoryViewResponse> => {
    const response = await api.post<StoryViewResponse>(
      API_ENDPOINTS.STORIES.VIEW(storyId),
      {}
    )
    return response.data
  },

  /**
   * Отметить клик по истории
   */
  markStoryClicked: async (storyId: string | number, slideId?: number): Promise<StoryClickResponse> => {
    const response = await api.post<StoryClickResponse>(
      API_ENDPOINTS.STORIES.CLICK(storyId),
      { slideId }
    )
    return response.data
  },

  /**
   * Получить статистику истории (для админов)
   */
  getStoryStats: async (storyId: string | number): Promise<StoryStats> => {
    const response = await api.get<StoryStats>(
      `${API_ENDPOINTS.STORIES.BY_ID(storyId)}/stats`
    )
    return response.data
  },
}
