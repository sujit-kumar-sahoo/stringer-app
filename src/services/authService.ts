import api from '../utilis/api';
import { encodePayload, formDataToObject } from '@/utilis/encodeUtil';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const signIn = async (formData: FormData): Promise<ApiResponse> => {
  try {
    // Convert FormData → object
    const payloadObj = formDataToObject(formData);

    // Encode object into Base64 JSON
    const encodedPayload = encodePayload(payloadObj);

    const response = await api.post(
                                      '/api/auth/login', 
                                      { data: encodedPayload }, 
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

