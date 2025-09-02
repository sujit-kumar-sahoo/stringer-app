'use client'
import withAuth from '@/hoc/withAuth';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { getPriorities } from '@/services/priorityService';
import { getLocations } from '@/services/locationService';
// You'll need to create this service for authors
// import { getAuthors } from '@/services/authorService';
import React, { useState, useEffect } from 'react'
import { Search, Calendar, Download, ChevronDown, X, FileText } from 'lucide-react'

interface TableRow {
  id: string
  title: string
  author: string
  location: string
  priority: string
  date: string
  status?: string
  reward?: number
}

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
  
  // Dummy table data
  const [tableData, setTableData] = useState<TableRow[]>([
    {
      id: '1',
      title: 'Breaking News: Major Economic Reform Announced',
      author: 'John Doe',
      location: 'Mumbai',
      priority: 'Breaking',
      date: 'Aug 7, 2025, 4:38 PM',
      status: 'Published',
      reward: 2500
    },
    {
      id: '2',
      title: 'Local Sports Championship Results',
      author: 'Jane Smith',
      location: 'Delhi',
      priority: 'Medium',
      date: 'Aug 7, 2025, 3:20 PM',
      status: 'Draft',
      reward: 1800
    },
    {
      id: '3',
      title: 'Weather Update: Monsoon Predictions',
      author: 'Mike Johnson',
      location: 'Chennai',
      priority: 'Low',
      date: 'Aug 7, 2025, 2:15 PM',
      status: 'Published',
      reward: 1200
    },
    {
      id: '4',
      title: 'Technology Innovation in Healthcare',
      author: 'Sarah Wilson',
      location: 'Bangalore',
      priority: 'High',
      date: 'Aug 7, 2025, 1:45 PM',
      status: 'Review',
      reward: 3200
    },
    {
      id: '5',
      title: 'Environmental Conservation Efforts',
      author: 'David Brown',
      location: 'Kolkata',
      priority: 'Medium',
      date: 'Aug 6, 2025, 5:30 PM',
      status: 'Published',
      reward: 1950
    },
    {
      id: '6',
      title: 'Educational Policy Changes',
      author: 'Lisa Garcia',
      location: 'Pune',
      priority: 'High',
      date: 'Aug 6, 2025, 4:15 PM',
      status: 'Draft',
      reward: 2800
    },
    {
      id: '7',
      title: 'Infrastructure Development Update',
      author: 'Robert Taylor',
      location: 'Hyderabad',
      priority: 'Medium',
      date: 'Aug 6, 2025, 2:30 PM',
      status: 'Published',
      reward: 2100
    },
    {
      id: '8',
      title: 'Cultural Festival Highlights',
      author: 'Emma Davis',
      location: 'Jaipur',
      priority: 'Low',
      date: 'Aug 5, 2025, 6:45 PM',
      status: 'Published',
      reward: 1500
    }
  ])

  // Fetch functions
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
        // Fallback dummy data
        setLocationOptions([
          { id: 'Mumbai', name: 'Mumbai' },
          { id: 'Delhi', name: 'Delhi' },
          { id: 'Chennai', name: 'Chennai' },
          { id: 'Bangalore', name: 'Bangalore' },
          { id: 'Kolkata', name: 'Kolkata' },
          { id: 'Pune', name: 'Pune' }
        ])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      // Fallback dummy data
      setLocationOptions([
        { id: 'Mumbai', name: 'Mumbai' },
        { id: 'Delhi', name: 'Delhi' },
        { id: 'Chennai', name: 'Chennai' },
        { id: 'Bangalore', name: 'Bangalore' },
        { id: 'Kolkata', name: 'Kolkata' },
        { id: 'Pune', name: 'Pune' }
      ])
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
        // Fallback dummy data
        setPriorityOptions([
          { id: 'Breaking', priority: 'Breaking' },
          { id: 'High', priority: 'High' },
          { id: 'Medium', priority: 'Medium' },
          { id: 'Low', priority: 'Low' }
        ])
      }
    } catch (error) {
      console.error('Error fetching priorities:', error)
      // Fallback dummy data
      setPriorityOptions([
        { id: 'Breaking', priority: 'Breaking' },
        { id: 'High', priority: 'High' },
        { id: 'Medium', priority: 'Medium' },
        { id: 'Low', priority: 'Low' }
      ])
    } finally {
      setIsLoadingPriorities(false)
    }
  }

  const fetchAuthors = async () => {
    try {
      setIsLoadingAuthors(true)
      // Replace with actual API call when available
      // const response = await getAuthors()
      
      // For now, using dummy data
      const dummyAuthors = [
        { id: 'John Doe', name: 'John Doe' },
        { id: 'Jane Smith', name: 'Jane Smith' },
        { id: 'Mike Johnson', name: 'Mike Johnson' },
        { id: 'Sarah Wilson', name: 'Sarah Wilson' },
        { id: 'David Brown', name: 'David Brown' },
        { id: 'Lisa Garcia', name: 'Lisa Garcia' }
      ]
      setAuthorOptions(dummyAuthors)
    } catch (error) {
      console.error('Error fetching authors:', error)
      // Fallback dummy data
      setAuthorOptions([
        { id: 'John Doe', name: 'John Doe' },
        { id: 'Jane Smith', name: 'Jane Smith' },
        { id: 'Mike Johnson', name: 'Mike Johnson' }
      ])
    } finally {
      setIsLoadingAuthors(false)
    }
  }

  // Effects
  useEffect(() => {
    fetchLocations()
    fetchPriorities()
    fetchAuthors()
  }, [])

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

  useEffect(() => {
    setTimeout(() => setIsLoadingTable(false), 1000)
  }, [])

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string) => {
    const datePart = dateStr.split(',')[0] + ', ' + dateStr.split(',')[1]
    return new Date(datePart)
  }

  // Filter and action functions
  const applySearch = () => {
    setAppliedSearchTerm(searchTerm)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setAppliedSearchTerm('')
    setDateFrom('')
    setDateTo('')
    setSelectedLocations([])
    setSelectedPriorities([])
    setSelectedAuthors([])
  }

  const downloadCSV = () => {
    const filteredData = getFilteredTableData()
    const csvContent = [
      ['S.No', 'Title', 'Author', 'Location', 'Priority', 'Date', 'Status', 'Reward'].join(','),
      ...filteredData.map((row, index) => [
        index + 1,
        `"${row.title}"`,
        `"${row.author}"`,
        `"${row.location}"`,
        `"${row.priority}"`,
        `"${row.date}"`,
        `"${row.status || ''}"`,
        `"₹${row.reward || 0}"`
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
  }

  const togglePrioritySelection = (priority: string) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }

  const toggleAuthorSelection = (author: string) => {
    setSelectedAuthors(prev =>
      prev.includes(author)
        ? prev.filter(a => a !== author)
        : [...prev, author]
    )
  }

  const selectAllLocations = () => {
    setSelectedLocations(locationOptions.map(loc => loc.id))
  }

  const clearAllLocations = () => {
    setSelectedLocations([])
  }

  const selectAllPriorities = () => {
    setSelectedPriorities(priorityOptions.map(priority => priority.id))
  }

  const clearAllPriorities = () => {
    setSelectedPriorities([])
  }

  const selectAllAuthors = () => {
    setSelectedAuthors(authorOptions.map(author => author.id))
  }

  const clearAllAuthors = () => {
    setSelectedAuthors([])
  }

  const getFilteredTableData = () => {
    return tableData.filter(row => {
      // Search filter
      const searchMatch = !appliedSearchTerm ||
        row.title.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        row.author.toLowerCase().includes(appliedSearchTerm.toLowerCase())

      // Date range filter
      let dateMatch = true
      if (dateFrom || dateTo) {
        const rowDate = parseDate(row.date)
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          dateMatch = dateMatch && rowDate >= fromDate
        }
        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999)
          dateMatch = dateMatch && rowDate <= toDate
        }
      }

      // Location filter
      const locationMatch = selectedLocations.length === 0 || 
        selectedLocations.includes(row.location)

      // Priority filter
      const priorityMatch = selectedPriorities.length === 0 || 
        selectedPriorities.includes(row.priority)

      // Author filter
      const authorMatch = selectedAuthors.length === 0 || 
        selectedAuthors.includes(row.author)

      return searchMatch && dateMatch && locationMatch && priorityMatch && authorMatch
    })
  }

  const filteredTableData = getFilteredTableData()

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
          <span className="truncate">Date</span>
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
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                  setOpenDropdown(null)
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

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              
               
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
          ) : filteredTableData.length === 0 ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No data found</h3>
              <p className="text-sm sm:text-base text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                <div className="p-4 space-y-4">
                  {filteredTableData.map((row, index) => (
                    <div key={row.id || index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(row.priority)}`}>
                          {row.priority}
                        </span>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{row.title}</h4>
                        <p className="text-xs text-gray-500">{row.date}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Author:</span>
                          <p className="font-medium text-gray-900">{row.author}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium text-gray-900">{row.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium text-gray-900">{row.status}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Reward:</span>
                          <p className="font-semibold text-green-600">₹{row.reward?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                        S.No
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
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
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reward
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTableData.map((row, index) => (
                      <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-semibold text-blue-600 bg-blue-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-3 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs lg:max-w-sm xl:max-w-md">
                            {row.title}
                          </div>
                          {row.date && (
                            <div className="text-xs text-gray-500 mt-1">
                              {row.date}
                            </div>
                          )}
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.author}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.location}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(row.priority)}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{row.status}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">
                            ₹{row.reward?.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Dashboardstringer)