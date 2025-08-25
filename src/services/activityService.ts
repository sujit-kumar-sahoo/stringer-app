import api from '@/utilis/api';

export interface ActivityDetail {
  id: number
  headline: string
  description: string
  status: number
  status_text: string
  created_date: string
  updated_date: string
  location: string
  priority: number
  priority_text: string
  created_name: string
  created_by: number
  locked: boolean
  lock: any
  attachments: Array<{
    id: string
    type: 'image' | 'video' | 'document' | 'audio' | 'pdf'
    url: string
    name: string
    file_size?: number
    uploaded_date?: string
  }>
  content_type: number
  content_type_text: string
  tags?: string
  activities?: Array<{
    id: string
    user: string
    user_id: number
    action: string
    action_type: string
    created_date: string
    avatar?: string
  }>
  version?: number
  version_history?: Array<{
    version: number
    title: string
    author: string
    created_date: string
  }>
}

export interface ActivityDetailResponse {
  success: boolean
  data: ActivityDetail
  message?: string
}

export const fetchActivityDetail = async (id: number): Promise<ActivityDetailResponse> => {
  try {
    console.log('Fetching activity detail for ID:', id)
    
    const response = await api.get(`/api/content/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Map the response data to ensure all fields are properly formatted
    const mappedData: ActivityDetail = {
      ...response.data,
      attachments: response.data.attachments || [],
      activities: response.data.activities || [],
      version_history: response.data.version_history || [],
      tags: response.data.tags || '',
      version: response.data.version || 1
    }
    
    return {
      success: true,
      data: mappedData
    }
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch activity details'
    
    console.error('Error fetching activity detail:', error)
    
    return {
      success: false,
      data: {} as ActivityDetail,
      message: errorMessage
    }
  }
}

