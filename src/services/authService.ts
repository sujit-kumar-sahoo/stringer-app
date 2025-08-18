import api from '../utilis/api';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const signIn = async (username: string, password: string): Promise<ApiResponse> => {
  try {
    console.log('========Signing in with provided credentials=========');
    
    const response = await api.post('/api/auth/login', JSON.stringify({
      username: username,
      password: password,
    }), {
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
      message: error.response?.data?.detail || 'Error signing in.',
    };
  }
};

