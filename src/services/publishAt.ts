import api from '../utils/api';
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getPublish = async (id:any ): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/api/published_at/content/${id}`,
        
       {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || error.response?.data?.message || 'Error adding role.',
    };
  }
};

export const addPublish = async (formData: any): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/published_at/',
       formData, 
       {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || error.response?.data?.message || 'Error adding role.',
    };
  }
};





