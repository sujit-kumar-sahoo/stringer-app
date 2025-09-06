import api from '../utils/api';

interface CountData {
  draft: number;
  waitList: number;
  waitingInOutput: number;
  rejected: number;
  published: number;
  deleted: number;
  inputToStringer: number;
  outputToInput: number;
  inputWip: number;
  outputWip: number;
  outputToStringer: number;
  stringerToOutput: number;
  shared: number;
}

// Define the structure of the new JSON response
interface ApiCountItem {
  count: number;
  status_text: string;
}

interface ApiCountResponse {
  [key: string]: ApiCountItem;
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

    // Handle nested response structure
    if (data.success && data.data) {
      data = data.data;
    }

    
    const mappedCounts: CountData = {
      draft: Number(data['1']?.count) || 0,                   
      waitList: Number(data['2']?.count) || 0,                 
      waitingInOutput: Number(data['3']?.count) || 0,         
      rejected: Number(data['4']?.count) || 0,                 
      published: Number(data['5']?.count) || 0,               
      deleted: Number(data['6']?.count) || 0,                 
      inputToStringer: Number(data['7']?.count) || 0,          
      outputToInput: Number(data['8']?.count) || 0,            
      inputWip: Number(data['9']?.count) || 0,                 
      outputWip: Number(data['10']?.count) || 0,               
      outputToStringer: Number(data['11']?.count) || 0,        
      stringerToOutput: Number(data['12']?.count) || 0,        
      shared: Number(data['13']?.count) || 0,                
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