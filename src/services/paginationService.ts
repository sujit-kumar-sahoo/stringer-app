import api from '../utilis/api';

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
}

export interface ApiResponse {
  count: number
  limit: number
  offset: number
  results: Activity[]
  total_records: number
}

export interface FetchActivitiesParams {
  page: number
  limit: number
  appliedSearchTerm?: string
  dateFrom?: string
  dateTo?: string
  selectedLocations?: string[]
  selectedPriorities?: string[]
}

export const fetchActivities = async (params: FetchActivitiesParams): Promise<ApiResponse> => {
  try {
    const { page, limit, appliedSearchTerm, dateFrom, dateTo, selectedLocations, selectedPriorities } = params
    
    const offset = (page - 1) * limit
    const queryParams = new URLSearchParams({
      status: '2',
      limit: limit.toString(),
      offset: offset.toString()
    })

    // Add search filter if applied
    if (appliedSearchTerm) {
      queryParams.append('search', appliedSearchTerm)
    }

    // Add date filters if set
    if (dateFrom) {
      queryParams.append('date_from', dateFrom)
    }
    if (dateTo) {
      queryParams.append('date_to', dateTo)
    }

    // Add location filter if selected
    if (selectedLocations && selectedLocations.length > 0) {
      selectedLocations.forEach(location => {
        queryParams.append('location', location)
      })
    }

    // Add priority filter if selected
    if (selectedPriorities && selectedPriorities.length > 0) {
      selectedPriorities.forEach(priority => {
        queryParams.append('priority', priority)
      })
    }

    console.log('API URL:', `/api/content/?${queryParams.toString()}`) // Debug log
    
    // Use your api utility
    const response = await api.get(`/api/content/?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Return the response data
    return response.data
    
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'Failed to fetch data'
    
    console.error('Error fetching activities:', error)
    throw new Error(errorMessage)
  }
}