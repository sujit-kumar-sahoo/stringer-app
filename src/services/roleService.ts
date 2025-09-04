import api from '../utils/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const getRoles = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/api/role/', {
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

export const addRoles = async (formData: any): Promise<ApiResponse> => {
  try {
    const response = await api.post('/api/role/',
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

export const editRoles = async (formData: any): Promise<ApiResponse> => {
  try {
    const { id, ...roleData } = formData; 
    const response = await api.put(`/api/role/${id}`, roleData, {
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

export const dltRoles = async (formData: any): Promise<ApiResponse> => {
  try {
    const { id, ...roleData } = formData;
    const response = await api.delete(`/api/role/${id}`, {
      data: roleData, 
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
      message: error.response?.data?.detail || error.response?.data?.message || 'Error deleting role.',
    };
  }
};

