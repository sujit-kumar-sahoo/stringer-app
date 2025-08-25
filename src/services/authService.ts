import api from '../utils/api';
import { encodePayload, formDataToObject } from '@/utils/encodeUtil';

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




// Optimized storage helpers
const getStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const clearStorage = () => {
  if (typeof window !== 'undefined') {

    const itemsToRemove = ['token', 'user'];
    itemsToRemove.forEach(item => {
      localStorage.removeItem(item);
    });
    sessionStorage.clear();
  }
};

export const logout = async (): Promise<ApiResponse> => {
  const token = getStorageItem('token');

  clearStorage();
  
 
  if (!token) {
    return { success: true, message: 'Already logged out' };
  }
  
  try {
    
    const response = await api.post(
      '/api/auth/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 1000, 
      }
    );

    return {
      success: true,
      message: 'Logged out successfully',
      data: response.data,
    };
  } catch (error: any) {
    
    return {
      success: true, 
      message: 'Logged out successfully',
    };
  }
};