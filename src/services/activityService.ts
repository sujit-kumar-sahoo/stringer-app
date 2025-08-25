import api from '@/utils/api';

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
  activities: Array<{
    id: string
    user: string
    user_id: number
    action: string
    action_type: string
    created_date: string
    avatar?: string
  }>
  version: number
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
    
    // Return the response data
    return {
      success: true,
      data: response.data
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

// Optional: Service for updating activity
export const updateActivity = async (id: number, data: Partial<ActivityDetail>): Promise<ActivityDetailResponse> => {
  try {
    console.log('Updating activity:', id, data)
    
    const response = await api.put(`/api/content/${id}/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    return {
      success: true,
      data: response.data
    }
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to update activity'
    
    console.error('Error updating activity:', error)
    
    return {
      success: false,
      data: {} as ActivityDetail,
      message: errorMessage
    }
  }
}

// Optional: Service for deleting activity
export const deleteActivity = async (id: number): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log('Deleting activity:', id)
    
    await api.delete(`/api/content/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    return {
      success: true
    }
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to delete activity'
    
    console.error('Error deleting activity:', error)
    
    return {
      success: false,
      message: errorMessage
    }
  }
}