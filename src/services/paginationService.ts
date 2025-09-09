import api from '../utils/api';

export interface Activity {
  id: number
  headline: string
  status: number
  status_text: string
  created_date: string
  location: string
  priority: number
  priority_text: string
  created_name: string
  locked: boolean
  lock: any
  attachments: any[]
  content_type: number
  content_type_text: string
  content_price: string
}

export interface ApiResponse {
  count: number
  limit: number
  offset: number
  results: Activity[]
  total_records: number
}

export interface FetchActivitiesParams {
  page?: number;
  limit?: number;
  status: number;
  appliedSearchTerm?: string
  dateFrom?: string
  dateTo?: string
  selectedLocations?: string[]
  selectedPriorities?: string[]
  selectedCreatedBy?: string[]
  selectedContentTypes?: string[]
  fetchLatestMonth?: boolean; // New parameter to control initial fetch
}

// Helper function to get date range for the latest month
const getLatestMonthRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    from: firstDayOfMonth.toISOString().split('T')[0],
    to: lastDayOfMonth.toISOString().split('T')[0]
  };
};

export const fetchActivities = async (params: FetchActivitiesParams): Promise<ApiResponse> => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      appliedSearchTerm,
      dateFrom,
      dateTo,
      selectedLocations,
      selectedPriorities,
      selectedCreatedBy,
      selectedContentTypes,
      fetchLatestMonth = false
    } = params

    const queryParts = [`status=${status}`];

    // If fetching latest month data initially, don't use pagination
    if (!fetchLatestMonth) {
      const offset = (page - 1) * limit;
      queryParts.push(`limit=${limit}`, `offset=${offset}`);
    }

    // Handle date range - if fetchLatestMonth is true and no specific dates are provided
    if (fetchLatestMonth && !dateFrom && !dateTo) {
      const { from, to } = getLatestMonthRange();
      queryParts.push(`from_date=${from}`, `to_date=${to}`);
    } else {
      if (dateFrom) {
        queryParts.push(`from_date=${dateFrom}`);
      }
      if (dateTo) {
        queryParts.push(`to_date=${dateTo}`);
      }
    }

    if (appliedSearchTerm) {
      queryParts.push(`headline=${encodeURIComponent(appliedSearchTerm)}`);
    }

    if (selectedLocations && selectedLocations.length > 0) {
      queryParts.push(`location=${selectedLocations.join(',')}`);
    }
    if (selectedPriorities && selectedPriorities.length > 0) {
      queryParts.push(`priority=${selectedPriorities.join(',')}`);
    }
    if (selectedCreatedBy && selectedCreatedBy.length > 0) {
      queryParts.push(`created_by=${selectedCreatedBy.join(',')}`);
    }
    if (selectedContentTypes && selectedContentTypes.length > 0) {
      queryParts.push(`content_type=${selectedContentTypes.join(',')}`);
    }

    const queryString = queryParts.join('&');
    console.log('API URL:', `/api/content/?${queryString}`);

    const response = await api.get(`/api/content/?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;

  } catch (error: any) {
    const errorMessage = error.response?.data?.detail ||
                        error.response?.data?.message ||
                        error.message ||
                        'Failed to fetch data';

    console.error('Error fetching activities:', error);
    throw new Error(errorMessage);
  }
}