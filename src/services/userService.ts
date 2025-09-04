import api from '../utils/api';
interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getUser = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/user/', {
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

export const addUser = async (formData: any): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/auth/signup',
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

export const editUser = async (formData: any): Promise<ApiResponse> => {
  try {
    const { id, ...roleData } = formData; 
    const response = await api.put(`/api/auth/signup${id}`, roleData, {
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error updating role.',
    };
  }
};


