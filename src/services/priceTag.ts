import api from '../utils/api';
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getPriceTag= async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/price_tag/', {
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching roles.',
    };
  }
};

export const addPriceTags = async  (formData: any): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/price_tag/',
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error fetching locations.',
    };
  }
};


