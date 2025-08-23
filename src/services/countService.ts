import api from '../utilis/api';

interface CountData {
 draft:number;
  waitList: number;
  inputWip: number;
  inputToStringer: number;
  outputToInput: number;
  published: number;
}

// Optimized storage helper
const getStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const fetchCounts = async (): Promise<CountData> => {
  const token = getStorageItem('token');
  
  try {
    const response = await api.get('/api/content/count', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    
    let data = response.data;

   
    if (data.success && data.data) {
      data = data.data;
    }

   
    const mappedCounts = {
        
        waitList: Number(data['2']) || 0, 
        inputWip: Number(data['9']) || 0,     
        inputToStringer: Number(data['7']) || 0,
        outputToInput: Number(data['11']) || 0,   
        published: Number(data['5']) || 0,   


        draft: Number(data['1']) || 0,
    };

    return mappedCounts;

  } catch (error: any) {
    // Return more specific error information
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.detail || 
                        error.response?.data?.error ||
                        error.message || 
                        'Failed to fetch counts';
    
    throw new Error(errorMessage);
  }
};