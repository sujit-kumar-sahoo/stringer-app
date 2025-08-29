import api from '../utils/api';
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export const getTags = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/tag/', {
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching tags.',
    };
  }
};
export const addTags = async  (formData: any): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/tag/',
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching tags.',
    };
  }
};