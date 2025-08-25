import api from '../utils/api';
import { encodePayload, formDataToObject } from '@/utils/encodeUtil';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}
export const getContents = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/content/', {
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


export const createContent = async (formData: any): Promise<ApiResponse> => {
  try {
    // Convert FormData → object
    //const payloadObj = formDataToObject(formData);
    // Encode object into Base64 JSON
    //const encodedPayload = encodePayload(payloadObj);

    const response = await api.post(
                                      '/api/content/', 
                                      formData, 
                                      {
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                      }
                                    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Error signing in.',
    };
  }
};

export const getContentById = async (id:any): Promise<ApiResponse> => {
  try {
    const response = await api.get(`/api/content/${id}`, {
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