'use client'
import withAuth from '@/hoc/withAuth';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { getPriorities } from '@/services/priorityService';
import { getLocations } from '@/services/locationService';
import { fetchActivities, Activity, FetchActivitiesParams } from '@/services/paginationService'
import { getUser } from '@/services/userService';
import React, { useState, useEffect } from 'react'
import { Calendar, Download, ChevronDown, X, FileText } from 'lucide-react'

const Dashboardstringer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Options state
  const [locationOptions, setLocationOptions] = useState<Array<{ id: string; name: string }>>([])
  const [priorityOptions, setPriorityOptions] = useState<Array<Record<string, any>>>([])
  const [authorOptions, setAuthorOptions] = useState<Array<{ id: string; name: string }>>([])

  // Loading states
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(true)
  const [isLoadingTable, setIsLoadingTable] = useState(true)

  // Activities data
  const [activities, setActivities] = useState<Activity[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(12)
  const [isInitialLoad, setIsInitialLoad] = useState(true) 

// Helper function to get current month date range (timezone-safe)
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Format dates without timezone conversion
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatDate(firstDayOfMonth),
    to: formatDate(lastDayOfMonth)
  };
};

  const fetchLocations = async () => {
    try {
      setIsLoadingLocations(true)
      const response = await getLocations()

      if (response.success && response.data && Array.isArray(response.data)) {
        const locations = response.data
          .filter((item: any) => item.location && typeof item.location === 'string')
          .map((item: any) => ({ id: item.location.trim(), name: item.location.trim() }))
        setLocationOptions(locations)
      } else {
        console.error('Invalid locations response structure:', response)
        setLocationOptions([])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocationOptions([])
    } finally {
      setIsLoadingLocations(false)
    }
  }

  const fetchPriorities = async () => {
    try {
      setIsLoadingPriorities(true)
      const response = await getPriorities()

      if (response.success && response.data && Array.isArray(response.data)) {
        setPriorityOptions(response.data)
      } else {
        console.error('Invalid priorities response structure:', response)
        setPriorityOptions([])
      }
    } catch (error) {
      console.error('Error fetching priorities:', error)
      setPriorityOptions([])
    } finally {
      setIsLoadingPriorities(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      setIsLoadingAuthors(true)
      const response = await getUser()

      if (response.success && response.data && Array.isArray(response.data)) {
        setAuthorOptions(response.data)
      } else {
        console.error('Invalid authors response structure:', response)
        setAuthorOptions([])
      }
    } catch (error) {
      console.error('Error fetching authors:', error)
      setAuthorOptions([])
    } finally {
      setIsLoadingAuthors(false)
    }
  }

  const fetchTableData = async () => {
    try {
      setIsLoadingTable(true)

      const params: FetchActivitiesParams = {
        status: 2,
        appliedSearchTerm: appliedSearchTerm || undefined,
        selectedLocations: selectedLocations.length > 0 ? selectedLocations : undefined,
        selectedPriorities: selectedPriorities.length > 0 ? selectedPriorities.map(p => p.toString()) : undefined,
        selectedCreatedBy: selectedAuthors.length > 0 ? selectedAuthors : undefined,
      }

      // For initial load, fetch latest month data without pagination
      if (isInitialLoad && !dateFrom && !dateTo && !appliedSearchTerm &&
        selectedLocations.length === 0 && selectedPriorities.length === 0 && selectedAuthors.length === 0) {
        params.fetchLatestMonth = true;
      } else {
        // For subsequent loads or when filters are applied, use pagination
        params.page = currentPage;
        params.limit = limit;
        params.dateFrom = dateFrom || undefined;
        params.dateTo = dateTo || undefined;
      }

      const response = await fetchActivities(params)
      setActivities(response.results)
      setTotalRecords(response.total_records)

      // Set initial date range to current month if it's the first load
      if (isInitialLoad && !dateFrom && !dateTo) {
        const { from, to } = getCurrentMonthRange();
        setDateFrom(from);
        setDateTo(to);
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      setActivities([])
      setTotalRecords(0)
    } finally {
      setIsLoadingTable(false)
    }
  }

  // Effects
  useEffect(() => {
    fetchLocations()
    fetchPriorities()
    fetchAuthors()
  }, [])

  useEffect(() => {
    fetchTableData()
  }, [currentPage, appliedSearchTerm, dateFrom, dateTo, selectedLocations, selectedPriorities, selectedAuthors])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!event.target) return
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter and action functions
  const applySearch = () => {
    setAppliedSearchTerm(searchTerm)
    setCurrentPage(1)
    setIsInitialLoad(false) // Ensure we use pagination for search results
  }

  const clearFilters = () => {
    setSearchTerm('')
    setAppliedSearchTerm('')
    setDateFrom('')
    setDateTo('')
    setSelectedLocations([])
    setSelectedPriorities([])
    setSelectedAuthors([])
    setCurrentPage(1)
    setIsInitialLoad(true) // Reset to initial load state to fetch latest month data
  }

  const downloadCSV = () => {
    const csvContent = [
      ['S.No', 'Title', 'Author', 'Location', 'Priority', 'Date', 'Status', 'Reward'].join(','),
      ...activities.map((row, index) => [
        index + 1,
        `"${row.headline}"`,
        `"${row.created_name}"`,
        `"${row.location}"`,
        `"${row.priority_text}"`,
        `"${formatDate(row.created_date)}"`,
        `"${row.status_text}"`,
        `"${row.content_price}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dashboard_data.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Selection functions
  const toggleLocationSelection = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
    setIsInitialLoad(false)
  }

  const togglePrioritySelection = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
    setIsInitialLoad(false)
  }

  const toggleAuthorSelection = (author: string) => {
    setSelectedAuthors(prev =>
      prev.includes(author)
        ? prev.filter(a => a !== author)
        : [...prev, author]
    )
    setIsInitialLoad(false)
  }

  const selectAllLocations = () => {
    setSelectedLocations(locationOptions.map(loc => loc.id))
    setIsInitialLoad(false)
  }

  const clearAllLocations = () => {
    setSelectedLocations([])
  }

  const selectAllPriorities = () => {
    setSelectedPriorities(priorityOptions.map(priority => priority.id))
    setIsInitialLoad(false)
  }

  const clearAllPriorities = () => {
    setSelectedPriorities([])
  }

  const selectAllAuthors = () => {
    setSelectedAuthors(authorOptions.map(author => author.id))
    setIsInitialLoad(false)
  }

  const clearAllAuthors = () => {
    setSelectedAuthors([])
  }

  // Component functions
  const DateRangeSelector = () => (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpenDropdown(openDropdown === 'dateRange' ? null : 'dateRange')
        }}
        className="flex items-center justify-between space-x-2 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 min-w-[140px] transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span className="truncate">
            {dateFrom || dateTo ? 'Custom Range' : 'Current Month'}
          </span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'dateRange' ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown === 'dateRange' && (
        <div className="absolute z-30 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value)
                  setIsInitialLoad(false)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value)
                  setIsInitialLoad(false)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                  setOpenDropdown(null)
                  setIsInitialLoad(true)
                }}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setOpenDropdown(null)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-orange-600 bg-orange-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'breaking':
        return 'text-red-600 bg-red-50'
      case 'low':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Loading state
  if (isLoadingLocations || isLoadingPriorities || isLoadingAuthors) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex space-x-4 mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-gray-50 shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4">
            <div className="flex flex-col gap-4">
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-between">
                <div className='flex flex-wrap gap-2 sm:gap-3'>
                  <DateRangeSelector />

                  <MultiSelectDropdown
                    label="Location"
                    selectedItems={selectedLocations}
                    options={locationOptions}
                    onToggleItem={toggleLocationSelection}
                    onSelectAll={selectAllLocations}
                    onClearAll={clearAllLocations}
                    dropdownKey="location"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    idKey="id"
                    displayKey="name"
                    isLoading={isLoadingLocations}
                  />

                  <MultiSelectDropdown
                    label="Priority"
                    selectedItems={selectedPriorities}
                    options={priorityOptions}
                    onToggleItem={togglePrioritySelection}
                    onSelectAll={selectAllPriorities}
                    onClearAll={clearAllPriorities}
                    dropdownKey="priority"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    idKey="id"
                    displayKey="priority"
                    isLoading={isLoadingPriorities}
                  />

                  <MultiSelectDropdown
                    label="Author"
                    selectedItems={selectedAuthors}
                    options={authorOptions}
                    onToggleItem={toggleAuthorSelection}
                    onSelectAll={selectAllAuthors}
                    onClearAll={clearAllAuthors}
                    dropdownKey="author"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    idKey="id"
                    displayKey="name"
                    isLoading={isLoadingAuthors}
                  />

                  {(appliedSearchTerm ||
                    dateFrom ||
                    dateTo ||
                    selectedLocations.length > 0 ||
                    selectedPriorities.length > 0 ||
                    selectedAuthors.length > 0) && (
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-2xl hover:bg-red-50 transition-colors bg-red-100"
                      >
                        <div className="flex items-center gap-2">
                          <X size={16} />
                          <span className="hidden sm:inline">Clear Filters</span>
                          <span className="sm:hidden">Clear</span>
                        </div>
                      </button>
                    )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={applySearch}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Apply
                  </button>
                  <button
                    onClick={downloadCSV}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">CSV</span>
                    <span className="sm:hidden">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-4 sm:p-6 pt-2 sm:pt-2">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {isLoadingTable ? (
            <div className="p-4 sm:p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      S.No
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Headline
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reward
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity, index) => (
                    <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-blue-600 bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                          {((currentPage - 1) * limit) + index + 1}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs lg:max-w-sm xl:max-w-md line-clamp-3">
                          {activity.headline}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(activity.created_date)}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">

                          {activity.content_price}
                        </div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.created_name}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.location}</div>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(activity.priority_text)}`}>
                          {activity.priority_text}
                        </span>
                      </td>
                      <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{activity.status_text}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>


      </div>
    </div>
  )
}

export default withAuth(Dashboardstringer)