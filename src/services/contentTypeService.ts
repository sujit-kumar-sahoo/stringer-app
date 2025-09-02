import api from '../utils/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getContentTypes = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/content_type/', {
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching content types.',
    };
  }
};

export const addContentTypes = async  (formData: any): Promise<ApiResponse> => {
  try {
  
   
   
    const response = await api.post('/api/content_type/',  {
      headers: {
        'Content-Type': 'application/json',
        formData,
      },
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('Content type API error:', error.response?.data); 
    return {
      success: false,
      message: error.response?.data?.detail || error.response?.data?.message || 'Error adding content type.',
    };
  }
};