import api from '../utilis/api';
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export const getPriorities = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/priority/', {
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching priorities.',
    };
  }
};
