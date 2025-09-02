'use client'
import withAuth from '@/hoc/withAuth';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown'; 
import { getPriorities } from '@/services/priorityService';
import { getLocations } from '@/services/locationService';
import React, { useState, useEffect } from 'react'
import { Search, Calendar, User, FileText, Edit3, Upload, ChevronDown, X, MapPin } from 'lucide-react'

interface Activity {
  id: string
  type: 'edit' | 'upload'
  user: string
  action: string
  storyTitle: string
  status: 'Input WIP' | 'Waiting in Input' | 'Published' | 'Draft'
  timestamp: string
  location: string
  priority: string
  link?: string
}

const Activity: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [locationOptions, setLocationOptions] = useState<string[]>([])
  const [priorityOptions, setPriorityOptions] = useState<Array<Record<string, any>>>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(true)
  const [isLoadingPriorities, setIsLoadingPriorities] = useState(true)
  
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'edit',
      user: 'You',
      action: 'edited a story',
      storyTitle: 'Sujit story title ver 2',
      status: 'Input WIP',
      timestamp: 'Aug 7, 2025, 4:38 PM',
      location: 'Mumbai',
      priority: 'High',
      link: '#'
    },
    {
      id: '2',
      type: 'upload',
      user: 'You',
      action: 'uploaded a story',
      storyTitle: 'asd',
      status: 'Waiting in Input',
      timestamp: 'Aug 7, 2025, 4:20 PM',
      location: 'Delhi',
      priority: 'Medium'
    },
    {
      id: '3',
      type: 'upload',
      user: 'Soumen',
      action: 'uploaded a story',
      storyTitle: 'Sujit story title:',
      status: 'Waiting in Input',
      timestamp: 'Aug 7, 2025, 4:15 PM',
      location: 'Kolkata',
      priority: 'Breaking',
      link: '#'
    },
    {
      id: '4',
      type: 'edit',
      user: 'Soumen',
      action: 'edited a story',
      storyTitle: 'test 19-12-2024',
      status: 'Draft',
      timestamp: 'Aug 7, 2025, 4:10 PM',
      location: 'Chennai',
      priority: 'Low',
      link: '#'
    }
  ])

  const [isLoading, setIsLoading] = useState(true)

  // Fetch locations and priorities
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
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
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
      }
    } catch (error) {
      console.error('Error fetching priorities:', error)
    } finally {
      setIsLoadingPriorities(false)
    }
  }

  useEffect(() => {
    fetchLocations()
    fetchPriorities()
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
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  // Helper function to parse date string to Date object
  const parseDate = (dateStr: string) => {
    // Convert "Aug 7, 2025, 4:38 PM" format to Date
    const datePart = dateStr.split(',')[0] + ', ' + dateStr.split(',')[1]
    return new Date(datePart)
  }

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
  }

  // Location and Priority filter functions
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

  const getFilteredActivities = () => {
    let filtered = activities.filter(activity => {
      // Search filter
      const searchMatch = !appliedSearchTerm ||
        activity.storyTitle.toLowerCase().includes(appliedSearchTerm.toLowerCase()) ||
        activity.user.toLowerCase().includes(appliedSearchTerm.toLowerCase())

      // Date range filter
      let dateMatch = true
      if (dateFrom || dateTo) {
        const activityDate = parseDate(activity.timestamp)
        if (dateFrom) {
          const fromDate = new Date(dateFrom)
          dateMatch = dateMatch && activityDate >= fromDate
        }
        if (dateTo) {
          const toDate = new Date(dateTo)
          toDate.setHours(23, 59, 59, 999) 
          dateMatch = dateMatch && activityDate <= toDate
        }
      }

      // Location filter
      const locationMatch = selectedLocations.length === 0 || 
        selectedLocations.includes(activity.location)

      // Priority filter
      const priorityMatch = selectedPriorities.length === 0 || 
        selectedPriorities.includes(activity.priority)

      return searchMatch && dateMatch && locationMatch && priorityMatch
    })

    return filtered
  }

  const filteredActivities = getFilteredActivities()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-orange-600'
      case 'Medium':
        return 'text-yellow-600'
      case 'Breaking':
        return 'text-red-600'
      case 'Low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getActivityIcon = (type: string) => {
    if (type === 'edit') {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Edit3 size={14} className="text-blue-600" />
        </div>
      )
    }
    return (
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
        <Upload size={14} className="text-green-600" />
      </div>
    )
  }

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

  if (isLoading || isLoadingLocations || isLoadingPriorities) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex space-x-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
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
        <div>
          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap gap-3">
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

                {/* Clear Filters Button */}
                {(appliedSearchTerm || 
                  dateFrom || 
                  dateTo || 
                  selectedLocations.length > 0 || 
                  selectedPriorities.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-2xl hover:bg-red-50 transition-colors bg-red-100"
                  >
                    <div className="flex items-center gap-2">
                      <X size={16} />
                      <span>Clear Filters</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && applySearch()}
                    placeholder="Search activities..."
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64 bg-white"
                  />
                </div>
                <button
                  onClick={applySearch}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-6">
        {/* Activities Feed */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="relative">
                  <div className="flex space-x-4">
                    {/* Activity Icon */}
                    {getActivityIcon(activity.type)}
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with user and action */}
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium text-gray-900">{activity.user}</span>
                        <span className="text-gray-600">{activity.action}</span>
                      </div>
                      
                      {/* Story Title */}
                      <div className="mb-3">
                        {activity.link ? (
                          <a
                            href={activity.link}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-base block"
                          >
                            {activity.storyTitle}
                          </a>
                        ) : (
                          <span className="text-gray-900 font-semibold text-base block">
                            {activity.storyTitle}
                          </span>
                        )}
                      </div>

                      {/* Location and Priority Row */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin size={14} />
                          <span className="text-sm">{activity.location}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">priority</div>
                          <div className={`text-sm font-semibold ${getPriorityColor(activity.priority)}`}>
                            {activity.priority}
                          </div>
                        </div>
                      </div>
                      
                      {/* Status and Timestamp */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border`}>
                          {activity.status}
                        </span>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline connector */}
                  {index < filteredActivities.length - 1 && (
                    <div className="absolute left-4 top-12 w-0.5 h-8 bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default withAuth(Activity)