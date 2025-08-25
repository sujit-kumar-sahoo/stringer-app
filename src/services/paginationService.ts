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
  selectedCreatedBy?: string[] 
  selectedContentTypes?: string[] 
}

export const fetchActivities = async (params: FetchActivitiesParams): Promise<ApiResponse> => {
  try {
    const { 
      page, 
      limit, 
      appliedSearchTerm, 
      dateFrom, 
      dateTo, 
      selectedLocations, 
      selectedPriorities,
      selectedCreatedBy,
      selectedContentTypes
    } = params
    
    const offset = (page - 1) * limit
    
   
    const queryParts = [
      `status=2`,
      `limit=${limit}`,
      `offset=${offset}`
    ]

   
    if (appliedSearchTerm) {
      queryParts.push(`headline=${encodeURIComponent(appliedSearchTerm)}`)
    }

    
    if (dateFrom) {
      queryParts.push(`from_date=${dateFrom}`)
    }
    if (dateTo) {
      queryParts.push(`to_date=${dateTo}`)
    }

    if (selectedLocations && selectedLocations.length > 0) {
      queryParts.push(`location=${selectedLocations.join(',')}`)
    }

    if (selectedPriorities && selectedPriorities.length > 0) {
      queryParts.push(`priority=${selectedPriorities.join(',')}`)
    }

    if (selectedCreatedBy && selectedCreatedBy.length > 0) {
      queryParts.push(`created_by=${selectedCreatedBy.join(',')}`)
    }

    if (selectedContentTypes && selectedContentTypes.length > 0) {
      queryParts.push(`content_type=${selectedContentTypes.join(',')}`)
    }

    const queryString = queryParts.join('&')
    console.log('API URL:', `/api/content/?${queryString}`) 
    
    const response = await api.get(`/api/content/?${queryString}`, {
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