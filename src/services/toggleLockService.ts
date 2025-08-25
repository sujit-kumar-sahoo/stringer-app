import api from '../utils/api';

export interface ToggleLockResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const toggleActivityLock = async (activityId: number): Promise<ToggleLockResponse> => {
  try {
    // Use your api utility
    const response = await api.post(`/api/content/${activityId}/toggle-lock/`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return {
      success: true,
      data: response.data,
    }
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to toggle lock'
    
    console.error('Error toggling lock:', error)
    
    return {
      success: false,
      message: errorMessage,
    }
  }
}